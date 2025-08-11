import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";
import { Check } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductPurchasePanel from "../_components/product-purchase-panel";

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const { productId } = await params;
    const product = await api.products.getProductById({
      _id: productId,
    });

    return (
      <>
        <div className="bg-primary">
          <div className="space-y-2 px-4 py-8 text-center text-white">
            <h1 className="text-3xl font-semibold tracking-tight">
              {product.name}
            </h1>
          </div>
        </div>
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <div className="grid grid-cols-1 gap-8 rounded-lg border bg-white/80 p-8 shadow-md md:grid-cols-2 md:gap-12">
            <div className="w-full">
              <AspectRatio
                ratio={1 / 1}
                className="relative overflow-hidden rounded-2xl shadow-lg"
              >
                <Image
                  src={product.image}
                  alt={`Foto de ${product.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </AspectRatio>
            </div>

            <div className="flex flex-col">
              <ProductPurchasePanel product={product} />
            </div>
          </div>

          <div className="mt-8 space-y-8">
            <Separator />
            <div className="grid grid-cols-1 gap-12 rounded-md border bg-white/80 p-8 shadow-md lg:grid-cols-3">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold">Descripción del Producto</h2>
                <div className="prose prose-slate text-muted-foreground mt-4 max-w-none">
                  <p>{product.description}</p>
                </div>
              </div>
              <div className="bg-primary/5 rounded-md p-4">
                <h2 className="text-2xl font-bold">Características</h2>
                {product.features && product.features.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="text-primary size-4" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground mt-4">
                    No hay características destacadas.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    notFound();
  }
}
