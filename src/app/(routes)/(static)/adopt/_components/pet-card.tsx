import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { Pet } from "@/server/db/schema";
import Image from "next/image";
import Link from "next/link";

interface PetCardProps {
  pet: Pet;
}

export function PetCard({ pet }: PetCardProps) {
  return (
    <Link
      href={`/adopt/${pet._id}`}
      className="group hover:border-primary block overflow-hidden rounded-lg border bg-white/70 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <AspectRatio ratio={1 / 1} className="relative overflow-hidden">
        <Image
          fill
          src={pet.image}
          alt={`Imagen de ${pet.name}`}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      </AspectRatio>
      <div className="space-y-1 p-4">
        <h3 className="text-xl font-bold">{pet.name}</h3>
        <p
          className="text-muted-foreground line-clamp-2 text-sm"
          title={pet.description}
        >
          {pet.description}
        </p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-600 capitalize">{pet.gender}</span>
          <span className="text-sm text-gray-600">
            {pet.age} {pet.age === 1 ? "año" : "años"}
          </span>
        </div>
      </div>
    </Link>
  );
}
