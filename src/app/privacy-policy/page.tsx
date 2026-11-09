import { PolicyPage } from "@/components/PolicyPage";
import { pageMetadata } from "@/lib/seo";
import { business } from "@/config/business";

export const metadata = pageMetadata({ title: "Privacy policy", description: "How inquiry details are used and kept.", path: "/privacy-policy", noindex: true });

export default function Page() {
  return (
    <PolicyPage title="Privacy policy" path="/privacy-policy">
      <p>This explains what {business.name} collects through this website and why.</p>
      <h2>What we collect</h2>
      <ul>
        <li>Details you type into the inquiry form: name, shop name, phone/WhatsApp, email, state, city, GSTIN (optional), brand, category, quantity and message.</li>
        <li>Basic technical data your browser sends, such as the page you came from.</li>
      </ul>
      <h2>Why we collect it</h2>
      <p>Only to reply to your inquiry and discuss your order. We ask for the minimum needed.</p>
      <h2>Who sees it</h2>
      <p>Our team, and the hosting and storage services that run this site. [Owner to list actual services before launch.]</p>
      <h2>Your choices</h2>
      <p>You can ask us to correct or delete your details. [Owner to add grievance/contact details and retention period.]</p>
    </PolicyPage>
  );
}
