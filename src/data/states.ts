import type { ServiceState } from "./types";

/**
 * Four owner-stated wholesale markets. Copy sticks to general, checkable
 * market context (language, climate, festival buying seasons) and makes no
 * claims about our delivery times, customer counts or warehouses.
 */
export const serviceStates: ServiceState[] = [
  {
    slug: "telangana",
    name: "Telangana",
    language: "Telugu",
    headline: "Wholesale footwear inquiries from Telangana",
    paragraphs: [
      "If you run a footwear shop in Hyderabad, a district town or a mandal market in Telangana, you can send us a wholesale inquiry with the brands, categories and quantities you want to stock.",
      "Hot, dry months push demand for light sandals and slippers, while the festive run from Dasara and Bathukamma into Diwali is when many shops restock casual and family footwear. Tell us your season and shop type and we will respond with what we can supply.",
      "Telangana shopkeepers usually have customers who ask in Telugu first. Brand names and model numbers on our pages stay exactly as the brand prints them, so you can match them against what your customers ask for.",
    ],
    cityTargets: ["Hyderabad", "Warangal"],
    woccyDistribution: true,
  },
  {
    slug: "andhra-pradesh",
    name: "Andhra Pradesh",
    language: "Telugu",
    headline: "Wholesale footwear inquiries from Andhra Pradesh",
    paragraphs: [
      "Retailers across Andhra Pradesh, from coastal towns to Rayalaseema, can request a quotation for multi-brand footwear through our inquiry form or WhatsApp.",
      "Humid coastal weather means slippers, sandals and easy-wear casuals move through much of the year, and Sankranti and Ugadi are well-known restocking points. Share the sizes and categories you sell most and we will tell you what is available.",
      "We list the brands we supply openly, so a new shop owner can see the choice before making contact, rather than being asked to call first for a price sheet.",
    ],
    cityTargets: ["Vijayawada", "Visakhapatnam", "Guntur", "Tirupati"],
    woccyDistribution: true,
  },
  {
    slug: "tamil-nadu",
    name: "Tamil Nadu",
    language: "Tamil",
    headline: "Wholesale footwear inquiries from Tamil Nadu",
    paragraphs: [
      "Shop owners and resellers in Tamil Nadu can ask us for wholesale footwear quotations covering the brands and categories listed on this site.",
      "Pongal and Deepavali are the busiest buying windows for many Tamil Nadu retailers, and warm weather keeps open footwear in steady demand. If you are planning stock for either season, send your quantities early so there is time to confirm availability.",
      "Mention your shop's location and the customers you serve, family footwear, college crowds or daily-wear buyers, and we will point you to the right part of the range.",
    ],
    cityTargets: ["Chennai", "Coimbatore", "Madurai"],
  },
  {
    slug: "karnataka",
    name: "Karnataka",
    language: "Kannada",
    headline: "Wholesale footwear inquiries from Karnataka",
    paragraphs: [
      "Footwear retailers in Karnataka, from Bengaluru's busy markets to Mysuru and North Karnataka towns, can send us a bulk inquiry for the brands we list.",
      "Bengaluru's milder weather and monsoon months shift demand toward closed casuals and sturdier slippers alongside sandals, while Dasara and Diwali drive festive restocking. Tell us what your shop already sells and what is missing from the shelf.",
      "Ordering for a new shop? Say so in the form. We can discuss starter assortments by category and size run instead of asking you to guess.",
    ],
    cityTargets: ["Bengaluru", "Mysuru", "Hubballi"],
  },
];

export const getState = (slug: string) => serviceStates.find((s) => s.slug === slug);
