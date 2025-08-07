import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";
import {
  PawPrint,
  Weight,
  Calendar,
  HeartHandshake,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdoptionInfoDialog from "./_components/adoption-info-dialog";

interface PetPageProps {
  params: {
    petId: string;
  };
}

const InfoPill = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="bg-background flex items-center gap-3 rounded-lg border p-3">
    <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

export default async function PetPage({ params }: PetPageProps) {
  try {
    const pet = await api.pets.getPetById({ _id: params.petId });

    return (
      <>
        <h1 className="bg-primary w-full py-8 text-center text-3xl font-medium text-white">
          {pet.name} - Detalles de Adopción
        </h1>
        <div className="container mx-auto max-w-5xl space-y-8 px-4 py-12">
          <div className="grid grid-cols-1 gap-8 rounded-lg border bg-white/80 p-8 shadow-md md:grid-cols-2 md:gap-12">
            <div className="w-full">
              <AspectRatio
                ratio={1 / 1}
                className="relative overflow-hidden rounded-2xl shadow-lg"
              >
                <Image
                  src={pet.image}
                  alt={`Foto de ${pet.name}`}
                  fill
                  className="object-cover transition-all hover:-translate-y-1 hover:scale-102"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </AspectRatio>
            </div>

            <div className="flex flex-col space-y-6">
              <div className="space-y-2">
                <Badge variant="secondary" className="capitalize">
                  {pet.specie}
                </Badge>
                <h1 className="text-primary text-4xl font-bold tracking-tight sm:text-5xl">
                  {pet.name}
                </h1>
                <p className="text-muted-foreground text-lg">{pet.breed}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoPill
                  icon={<PawPrint size={20} />}
                  label="Sexo"
                  value={pet.gender === "macho" ? "Macho" : "Hembra"}
                />
                <InfoPill
                  icon={<Calendar size={20} />}
                  label="Edad"
                  value={`${pet.age} ${pet.age === 1 ? "año" : "años"}`}
                />
                <InfoPill
                  icon={<Weight size={20} />}
                  label="Peso"
                  value={`${pet.weight} kg`}
                />
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Mi Historia</h2>
                <p className="text-base leading-relaxed text-slate-700">
                  {pet.description}
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Estado de Salud</h3>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    {pet.vaccinated ? (
                      <CheckCircle2 className="text-green-600" />
                    ) : (
                      <XCircle className="text-muted-foreground" />
                    )}
                    <span className="text-sm">Vacunado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {pet.sterilized ? (
                      <CheckCircle2 className="text-green-600" />
                    ) : (
                      <XCircle className="text-muted-foreground" />
                    )}
                    <span className="text-sm">Esterilizado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="h-fit rounded-md border bg-white/80 p-4 shadow-md">
            <div className="bg-primary/5 rounded-xl p-8 text-center">
              <HeartHandshake className="text-primary mx-auto size-12" />
              <h2 className="mt-4 text-2xl font-bold">
                ¿Sientes una conexión?
              </h2>
              <p className="text-muted-foreground mx-auto mt-2 max-w-md">
                Podrías ser la persona que {pet.name} ha estado esperando.
                Contáctanos para saber más sobre el proceso de adopción.
              </p>
              <AdoptionInfoDialog>
                <Button size="lg" className="mt-6">
                  Iniciar Proceso de Adopción
                </Button>
              </AdoptionInfoDialog>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    notFound();
  }
}
