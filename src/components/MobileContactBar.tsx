import Link from "next/link";
import { INQUIRY_PATH, telHref, waHref } from "@/config/business";

/** Sticky bottom bar on phones. Shows only confirmed channels. */
export function MobileContactBar() {
  const tel = telHref();
  const wa = waHref("Hello, I would like wholesale footwear details.");
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 p-2 backdrop-blur lg:hidden" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}>
      <div className="mx-auto flex max-w-md gap-2">
        {tel && <a href={tel} className="btn btn-ghost flex-1 !min-h-12 !px-3 text-sm" data-evt="call_click">Call</a>}
        {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-wa flex-1 !min-h-12 !px-3 text-sm" data-evt="whatsapp_click">WhatsApp</a>}
        <Link href={INQUIRY_PATH} className="btn btn-primary flex-[1.4] !min-h-12 !px-3 text-sm">Get quote</Link>
      </div>
    </div>
  );
}
