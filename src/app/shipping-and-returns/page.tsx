import { PolicyPage } from "@/components/PolicyPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Shipping and returns", description: "Delivery and returns information.", path: "/shipping-and-returns", noindex: true });

export default function Page() {
  return (
    <PolicyPage title="Shipping and returns" path="/shipping-and-returns">
      <p>Online checkout is not enabled. Orders are confirmed through inquiry, and delivery and return terms are agreed at that time.</p>
      <h2>Delivery</h2>
      <p>[Owner to confirm: dispatch times, delivery areas, charges and carriers. None are promised on this website until confirmed.]</p>
      <h2>Returns and exchanges</h2>
      <p>[Owner to confirm the return, exchange and refund policy, including wholesale orders and defective items.]</p>
    </PolicyPage>
  );
}
