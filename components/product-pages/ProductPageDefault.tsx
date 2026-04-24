import { ProductDefaultBreadcrumb } from "./default/ProductDefaultBreadcrumb";
import { ProductDefaultEssence } from "./default/ProductDefaultEssence";
import { ProductDefaultFeatureSection } from "./default/ProductDefaultFeatureSection";
import { ProductDefaultGallery } from "./default/ProductDefaultGallery";
import { ProductDefaultHeader } from "./default/ProductDefaultHeader";
import { ProductDefaultPageFooter } from "./default/ProductDefaultPageFooter";
import { ProductDefaultPurchaseClient } from "./default/ProductDefaultPurchaseClient";
import { mergeProductSampleImageUrls } from "@/lib/product-images";
import { productArchiveRef, productEssenceText } from "@/lib/product-page-default-copy";
import type { ProductPagePayload } from "./types";

export function ProductPageDefault({ product }: { product: ProductPagePayload }) {
  const hasDbDescription = Boolean(product.description?.trim());
  const essence = hasDbDescription ? null : productEssenceText(product);
  const ref = productArchiveRef(product.id);
  const galleryImageUrls = mergeProductSampleImageUrls(product);

  return (
    <div
      className="flex min-h-0 flex-1 flex-col bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container"
      data-theme="default"
    >
      <div className="w-full max-w-screen-2xl mx-auto flex-1 px-4 sm:px-6 md:px-8 lg:px-12 pt-6 md:pt-10 pb-16 md:pb-20">
        <ProductDefaultBreadcrumb productName={product.name} />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7 min-w-0">
            <ProductDefaultGallery productName={product.name} imageUrls={galleryImageUrls} />
          </div>

          <div className="lg:col-span-5 flex min-w-0 flex-col">
            <ProductDefaultHeader archiveRef={ref} title={product.name} />
            <div className="flex-1">
              <ProductDefaultPurchaseClient product={product}>
                {essence ? <ProductDefaultEssence className="pt-0" text={essence} /> : null}
              </ProductDefaultPurchaseClient>
            </div>
          </div>
        </div>

        <ProductDefaultFeatureSection
          className="mt-16"
          productName={product.name}
          imageUrls={galleryImageUrls}
        />
      </div>

      <ProductDefaultPageFooter />
    </div>
  );
}
