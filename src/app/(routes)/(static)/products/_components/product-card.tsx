import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/server/db/schema";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isSale = product.previousPrice && product.previousPrice > product.price;

  return (
    <Link
      href={`/products/${product._id}`}
      className="group hover:border-primary block overflow-hidden rounded-lg border bg-white/70 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <AspectRatio ratio={1 / 1} className="bg-muted relative overflow-hidden">
        <Image
          fill
          src={product.image}
          alt={`Imagen de ${product.name}`}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {isSale && (
          <Badge variant="destructive" className="absolute top-3 right-3">
            ¡Oferta!
          </Badge>
        )}
      </AspectRatio>
      <div className="p-4">
        <p className="text-muted-foreground text-sm">{product.category.name}</p>
        <h3 className="line-clamp-2 h-12 font-semibold">{product.name}</h3>
        <div className="flex flex-col pt-2">
          <p className="text-primary text-lg font-bold">
            {formatPrice(product.price)}
          </p>
          {isSale && (
            <p className="text-muted-foreground text-sm line-through">
              {formatPrice(product.previousPrice)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
