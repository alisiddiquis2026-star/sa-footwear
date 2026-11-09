import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: 0,
  workers: 2,
  reporter: [["list"]],
  use: { baseURL: "http://localhost:3100", trace: "off" },
  webServer: {
    // Requires `npm run build` first. File store enabled so the form can be tested for real.
    command: "INQUIRY_FILE_STORE=1 npx next start -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    timeout: 60_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit-iphone", use: { ...devices["iPhone 14"] } },
    { name: "android-chrome", use: { ...devices["Pixel 7"] } },
  ],
});
