import { PolicyPage } from "@/components/PolicyPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Accessibility", description: "Our accessibility goals and how to report a problem.", path: "/accessibility", noindex: true });

export default function Page() {
  return (
    <PolicyPage title="Accessibility" path="/accessibility">
      <p>We aim to make this site usable with a keyboard, a screen reader and on small phones, following WCAG 2.2 AA as a target. We have not had an independent audit.</p>
      <p>If something is hard to use, tell us through the contact page and we will try to fix it.</p>
    </PolicyPage>
  );
}
