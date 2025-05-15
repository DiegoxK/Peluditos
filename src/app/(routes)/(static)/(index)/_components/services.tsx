import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import Image from "next/image";

import donations from "@/assets/images/services/donaciones.webp";
import products from "@/assets/images/services/products.webp";
import adoptions from "@/assets/images/services/adopciones.webp";

export default function Services() {
  return (
    <section className="container mx-auto space-y-10 py-10">
      {/* Donations card */}

      <div className="border-secondary bg-card/50 text-card-foreground flex gap-5 rounded-md border-2 p-5">
        <Image className="rounded-md" width={400} src={donations} alt="" />
        <div className="flex flex-col justify-between p-4">
          <div className="space-y-2">
            <h3 className="text-primary text-3xl font-medium">Donaciones</h3>
            <p>
              Recuerda, puedes apoyar todo nuestro trabajo y esfuerzo, puedes
              poner tu granito de arena, cada uno de estos peluditos te lo
              agredecerá!.
            </p>
            <Separator className="bg-secondary mt-4" />
          </div>
          <div>
            <Button className="w-full">Dona ya!</Button>
          </div>
        </div>
      </div>

      {/* Products card */}

      <div className="border-secondary bg-card/50 text-card-foreground flex gap-5 rounded-md border-2 p-5">
        <div className="flex flex-col justify-between p-4">
          <div className="space-y-2">
            <h3 className="text-primary text-3xl font-medium">Productos</h3>
            <p>
              Puedes adquirir los mejores productos para tu nuevo amigo, o si ya
              tienes mascota lo puedes consentir con los mejores productos del
              mercado para aseo, alimentación y salud.
            </p>
            <Separator className="bg-secondary mt-4" />
          </div>
          <div>
            <Button className="w-full">Compra ya!</Button>
          </div>
        </div>
        <Image className="rounded-md" width={400} src={products} alt="" />
      </div>

      {/* Adoptions card */}

      <div className="border-secondary bg-card/50 text-card-foreground flex gap-5 rounded-md border-2 p-5">
        <Image className="rounded-md" width={400} src={adoptions} alt="" />
        <div className="flex flex-col justify-between p-4">
          <div className="space-y-2">
            <h3 className="text-primary text-3xl font-medium">Adopciones</h3>
            <p>
              Todavía no tienes mascota, no compres, adopta ya, decenas de
              peluditos esperan por tí, de seguro hay uno que se quedatá en tu
              corazón y en tu alma.
            </p>
            <Separator className="bg-secondary mt-4" />
          </div>
          <div>
            <Button className="w-full">Adopta!</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
