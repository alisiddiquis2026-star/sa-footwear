import { expect, test, type Page } from "@playwright/test";

const ROUTES = [
  "/", "/shop", "/shop/woccy-wl-5515", "/category/ladies-footwear", "/brands", "/brands/woccy", "/wholesale", "/wholesale/inquiry", "/become-a-dealer",
  "/about", "/contact", "/faq", "/service-areas", "/service-areas/telangana", "/service-areas/andhra-pradesh",
  "/service-areas/tamil-nadu", "/service-areas/karnataka", "/privacy-policy", "/terms",
  "/shipping-and-returns", "/accessibility", "/does-not-exist",
];
const WIDTHS = [320, 360, 375, 390, 414, 768, 1024, 1280, 1440, 1920];

function watchErrors(page: Page) {
  const errors: string[] = [];
  // WebKit surfaces cancelled Next prefetch fetches (URL contains ?_rsc=) as page errors. Only those are ignored.
  page.on("pageerror", (e) => !e.message.includes("_rsc=") && errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && errors.push(`console: ${m.text()}`));
  // Next's <Link> prefetches (?_rsc=) are aborted when we navigate away mid-flight: not an app error.
  // Requests cancelled by navigation (prefetches, lazy images) are not app errors; other failures still count.
  page.on("requestfailed", (r) => {
    const why = r.failure()?.errorText ?? "";
    if (r.url().includes("_rsc=") || /abort|cancel/i.test(why)) return;
    errors.push(`requestfailed: ${r.url()} (${why})`);
  });
  return errors;
}

test("every route loads without console errors or broken requests", async ({ page }) => {
  const errors = watchErrors(page);
  for (const r of ROUTES) {
    const before = errors.length;
    const res = await page.goto(r);
    expect(res?.status(), r).toBe(r === "/does-not-exist" ? 404 : 200);
    // The browser logs a console error for any 404 document; that is expected for the 404 route only.
    if (r === "/does-not-exist") errors.length = before;
    await expect(page.locator("h1").first(), r).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("no horizontal overflow at any required width (chromium only)", async ({ page }, info) => {
  test.skip(info.project.name !== "chromium", "viewport sweep runs once");
  const bad: string[] = [];
  for (const w of WIDTHS) {
    await page.setViewportSize({ width: w, height: 800 });
    for (const r of ROUTES) {
      await page.goto(r);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (over > 0) bad.push(`${r} @${w}px overflows by ${over}px`);
    }
  }
  expect(bad).toEqual([]);
});

test("images have alt text and links have names", async ({ page }) => {
  await page.goto("/");
  expect(await page.locator("img:not([alt])").count()).toBe(0);
  const unnamed = await page.locator("a").evaluateAll((as) => as.filter((a) => !(a.textContent || "").trim() && !a.getAttribute("aria-label")).length);
  expect(unnamed).toBe(0);
});

test("skip link is first tab stop and works", async ({ page }, info) => {
  test.skip(info.project.use.hasTouch === true, "keyboard test is desktop-only");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to main content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("mobile menu opens, lists links, closes on Escape and on navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  const menu = page.locator("#mobile-menu");
  await expect(menu).toBeVisible();
  await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await toggle.click();
  await menu.getByRole("link", { name: "Brands" }).click();
  await expect(page).toHaveURL(/\/brands$/);
  await expect(menu).toBeHidden();
});

test("shop lists products, filters work, and an empty result is handled", async ({ page }) => {
  await page.goto("/shop");
  expect(await page.locator("article").count()).toBeGreaterThan(20);
  const res = await page.goto("/shop?brand=woccy&category=gents-footwear&sort=name");
  expect(res?.status()).toBe(200);
  expect(await page.locator("article").count()).toBeGreaterThan(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await page.goto("/shop?q=zzzznothing");
  await expect(page.getByText("No products match these filters")).toBeVisible();
});

test("product page: gallery images, no price, inquiry CTA, Product schema without Offer", async ({ page }) => {
  await page.goto("/shop/woccy-wl-5515");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Woccy WL 5515");
  expect(await page.locator("main img").count()).toBeGreaterThanOrEqual(2);
  await expect(page.getByText("Price on inquiry").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Inquire about this product" })).toHaveAttribute("href", /product=Woccy%20WL%205515/);
  const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join("");
  expect(ld).toContain('"@type":"Product"');
  expect(ld).not.toContain("Offer");
  const broken = await page.locator("main img").evaluateAll((imgs) => (imgs as HTMLImageElement[]).filter((i) => i.complete && i.naturalWidth === 0).length);
  expect(broken).toBe(0);
});

test("sample-brand products are noindex and badged", async ({ page }) => {
  await page.goto("/shop/hoppins-8873");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await page.goto("/brands/hoppins");
  await expect(page.getByText("Sample", { exact: true }).first()).toBeVisible();
});

test("contact CTAs hide unconfirmed channels (no fake numbers)", async ({ page }) => {
  await page.goto("/contact");
  expect(await page.locator('a[href^="tel:"]').count()).toBe(0);
  expect(await page.locator('a[href^="https://wa.me"]').count()).toBe(0);
  expect(await page.locator('a[href^="mailto:"]').count()).toBe(0);
});

test("inquiry form: validation errors, then successful submission", async ({ page }, info) => {
  test.skip(info.project.name !== "chromium", "limits real submissions to avoid the rate limiter");
  await page.goto("/wholesale/inquiry");

  await page.getByRole("button", { name: "Send inquiry" }).click();
  await expect(page.getByText("Enter your name")).toBeVisible();
  await expect(page.getByText("Please tick the consent box")).toBeVisible();
  await expect(page.locator("#contactName")).toBeFocused();

  await page.getByLabel("Your name").fill("Test Buyer");
  await page.getByLabel("Shop or company name").fill("Test Footwear");
  await page.getByLabel("Mobile number").fill("9123456780");
  await page.getByLabel("State").selectOption("Karnataka");
  await page.getByLabel("City or town").fill("Mysuru");
  await page.getByLabel("Brand of interest").selectOption("Woccy");
  await page.getByLabel("Footwear category").selectOption("Ladies' footwear");
  await page.getByLabel("Approximate quantity").fill(`${Date.now() % 1000} pairs`);
  await page.getByLabel(/I agree to be contacted/).check();
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await expect(page.getByRole("heading", { name: "Inquiry received" })).toBeVisible();
});

test("product-prefilled inquiry link carries the product name", async ({ page }) => {
  await page.goto("/wholesale/inquiry?product=Test%20Sandal&brand=Woccy");
  await expect(page.getByText("Inquiring about:")).toContainText("Test Sandal");
  await expect(page.getByLabel("Brand of interest")).toHaveValue("Woccy");
});

test("structured data is valid JSON and has no fake commerce data", async ({ page }) => {
  await page.goto("/faq");
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const types = blocks.map((b) => JSON.parse(b)["@type"]);
  expect(types).toEqual(expect.arrayContaining(["Organization", "BreadcrumbList", "FAQPage"]));
  const all = blocks.join("");
  for (const banned of ["aggregateRating", "\"Offer\"", "\"Review\"", "LocalBusiness", "ShoeStore"]) {
    expect(all, banned).not.toContain(banned);
  }
});

test("reduced motion shows reveal content immediately", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect.poll(() => page.locator(".reveal:not(.is-in)").count()).toBe(0);
  await ctx.close();
});
