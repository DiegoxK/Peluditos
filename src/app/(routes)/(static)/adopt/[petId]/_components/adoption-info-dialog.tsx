"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Code2, Heart } from "lucide-react";
import Link from "next/link";

interface AdoptionInfoDialogProps {
  children: React.ReactNode;
}

export default function AdoptionInfoDialog({
  children,
}: AdoptionInfoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="bg-primary/10 mx-auto mb-4 flex size-14 items-center justify-center rounded-full">
            <Heart className="text-primary size-8" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            ¡Gracias por tu interés!
          </DialogTitle>
        </DialogHeader>

        <div className="text-muted-foreground space-y-4 py-4 text-center">
          <p>
            Nos alegra que quieras darle un hogar a una mascota. Este sitio web
            es un
            <strong className="text-primary/90">
              {" "}
              proyecto de demostración
            </strong>{" "}
            para mostrar habilidades en desarrollo web.
          </p>
          <p>
            Las adorables mascotas que ves aquí son parte de esta demo y no
            están disponibles para una adopción real.
          </p>
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Entendido
            </Button>
          </DialogClose>
          <Button asChild>
            <Link href="/about">
              <Code2 className="mr-2 size-4" />
              Saber más del proyecto
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
