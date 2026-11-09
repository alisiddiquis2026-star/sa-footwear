import { PolicyPage } from "@/components/PolicyPage";
import { pageMetadata } from "@/lib/seo";
import { business } from "@/config/business";

export const metadata = pageMetadata({ title: "Terms and conditions", description: "Terms for using this website.", path: "/terms", noindex: true });

export default function Page() {
  return (
    <PolicyPage title="Terms and conditions" path="/terms">
      <p>By using this website you agree to these terms. {business.name} is an independent footwear seller.</p>
      <h2>Brands and trademarks</h2>
      <p>Brand names and logos belong to their owners and are used only to identify the products we sell. We are not the brand&apos;s official website unless we say so in writing.</p>
      <h2>Inquiries and orders</h2>
      <p>Submitting an inquiry is not an order. Prices, availability and order terms are confirmed directly with you.</p>
      <h2>Information on this site</h2>
      <p>We try to keep details accurate, but product information and availability can change. [Owner and legal reviewer to complete liability, jurisdiction and dispute clauses.]</p>
    </PolicyPage>
  );
}
