import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/types";
import { getBrand } from "@/data/catalog";

/** Neutral placeholder: used only when a product has no approved photo yet. */
export function ImageSlot({ label = "Photo to be added" }: { label?: string }) {
  return (
    <div className="grid aspect-[4/3] place-items-center rounded-xl border border-dashed border-line bg-sand text-sm text-ink-soft">
      {label}
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const img = product.images[0];
  const brand = getBrand(product.brandSlug);
  return (
    <article className="group overflow-hidden rounded-2xl border border-line bg-paper transition-shadow hover:shadow-xl">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[5/6] overflow-hidden bg-sand">
          {img ? (
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <ImageSlot />
          )}
        </div>
        <div className="p-4">
          {brand && (
            <p className="text-xs font-semibold uppercase tracking-wider text-clay">
              {brand.name}
              {(brand.sample || product.sample) && <span className="ml-2 rounded-full bg-clay px-2 py-0.5 text-[10px] text-white">Sample</span>}
            </p>
          )}
          <h3 className="mt-1 font-semibold">{product.name}</h3>
          <p className="mt-1 text-sm text-ink-soft">
            {product.priceInr ? `₹${product.priceInr.toLocaleString("en-IN")}` : "Price on inquiry"}
          </p>
        </div>
      </Link>
    </article>
  );
}
