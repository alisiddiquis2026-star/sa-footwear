"use client";
import { useRef, useState } from "react";
import { STATE_OPTIONS } from "@/lib/inquiry-schema";

type Props = {
  brands: string[];
  categories: string[];
  presetBrand?: string;
  presetProduct?: string;
  whatsappHref: string | null;
  phone: string;
};

type Status = "idle" | "sending" | "done" | "error";

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && !error && <p className="text-sm text-ink-soft" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="err" id={`${id}-err`} role="alert">{error}</p>}
    </div>
  );
}

export function InquiryForm({ brands, categories, presetBrand, presetProduct, whatsappHref, phone }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const inputProps = (name: string) => ({
    id: name,
    name,
    className: "input",
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name] ? `${name}-err` : undefined,
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrors({});
    setMessage("");

    const fd = new FormData(e.currentTarget);
    const body: Record<string, unknown> = Object.fromEntries(fd.entries());
    body.consent = fd.get("consent") === "on";
    body.source = window.location.pathname;

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("done");
        formRef.current?.reset();
        return;
      }
      setErrors(data.fields ?? {});
      setMessage(data.error ?? "Something went wrong. Please try again or contact us directly.");
      setStatus("error");
      if (data.fields) {
        const first = Object.keys(data.fields)[0];
        requestAnimationFrame(() => document.getElementById(first)?.focus());
      }
    } catch {
      setMessage("We could not reach the server. Please check your connection or contact us directly.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="rounded-2xl border border-leaf/40 bg-paper p-8">
        <h2 className="font-display text-2xl font-bold text-leaf">Inquiry received</h2>
        <p className="mt-3 text-ink-soft">
          Thank you. We have your details and will get back to you on the mobile number you gave. If it is urgent,
          you can also reach us directly.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="btn btn-ghost mt-6">Send another inquiry</button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-5 rounded-2xl border border-line bg-paper p-5 sm:p-8">
      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {presetProduct && (
        <p className="rounded-lg bg-sand p-3 text-sm">Inquiring about: <strong>{presetProduct}</strong></p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="contactName" label="Your name" error={errors.contactName}>
          <input {...inputProps("contactName")} autoComplete="name" required />
        </Field>
        <Field id="shopName" label="Shop or company name" error={errors.shopName}>
          <input {...inputProps("shopName")} autoComplete="organization" required />
        </Field>
        <Field id="mobile" label="Mobile number" error={errors.mobile} hint="10-digit Indian mobile number">
          <input {...inputProps("mobile")} type="tel" inputMode="tel" autoComplete="tel" required />
        </Field>
        <Field id="whatsapp" label="WhatsApp number (if different)" error={errors.whatsapp}>
          <input {...inputProps("whatsapp")} type="tel" inputMode="tel" />
        </Field>
        <Field id="email" label="Email (optional)" error={errors.email}>
          <input {...inputProps("email")} type="email" autoComplete="email" />
        </Field>
        <Field id="gstin" label="GSTIN (optional)" error={errors.gstin}>
          <input {...inputProps("gstin")} autoCapitalize="characters" maxLength={15} />
        </Field>
        <Field id="state" label="State" error={errors.state}>
          <select {...inputProps("state")} defaultValue="" required>
            <option value="" disabled>Select state</option>
            {STATE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field id="city" label="City or town" error={errors.city}>
          <input {...inputProps("city")} autoComplete="address-level2" required />
        </Field>
        <Field id="brand" label="Brand of interest" error={errors.brand}>
          <select {...inputProps("brand")} defaultValue={presetBrand ?? ""} required>
            <option value="" disabled>Select brand</option>
            {brands.map((b) => <option key={b}>{b}</option>)}
            <option>Not sure / other brand</option>
          </select>
        </Field>
        <Field id="category" label="Footwear category" error={errors.category}>
          <select {...inputProps("category")} defaultValue="" required>
            <option value="" disabled>Select category</option>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      <Field id="quantity" label="Approximate quantity" error={errors.quantity} hint="For example: 120 pairs, or 5 cartons">
        <input {...inputProps("quantity")} required />
      </Field>
      <Field id="message" label="Anything else we should know?" error={errors.message}>
        <textarea {...inputProps("message")} rows={4} maxLength={1500} defaultValue={presetProduct ? `I am interested in: ${presetProduct}` : ""} />
      </Field>

      <div className="field">
        <label className="flex items-start gap-3 font-normal">
          <input type="checkbox" name="consent" id="consent" className="mt-1 size-5 shrink-0" aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? "consent-err" : undefined} />
          <span>I agree to be contacted about this inquiry by phone, WhatsApp or email. I have read the <a className="underline" href="/privacy-policy">privacy policy</a>.</span>
        </label>
        {errors.consent && <p className="err" id="consent-err" role="alert">{errors.consent}</p>}
      </div>

      <div aria-live="polite">
        {status === "error" && message && (
          <div role="alert" className="rounded-lg border border-[#b00020]/40 bg-[#fff4f4] p-4 text-sm">
            <p className="font-medium text-[#b00020]">{message}</p>
            {(whatsappHref || phone) && (
              <p className="mt-2">
                You can also {whatsappHref && <a className="font-semibold underline" href={whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp us</a>}
                {whatsappHref && phone && " or "}
                {phone && <>call <a className="font-semibold underline" href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a></>}.
              </p>
            )}
          </div>
        )}
      </div>

      <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
