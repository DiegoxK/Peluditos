"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { useDialog } from "@/context/dialog-provider";
import type { User } from "@/server/db/schema";
import Image from "next/image";
import CreateUserForm from "./create-user-form";
import { Separator } from "@/components/ui/separator";
import { Loader2, User2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface UserDetailsProps {
  user: User;
}

export default function UserDetails({ user }: UserDetailsProps) {
  const { openDialog } = useDialog();
  const { data: session } = useSession();

  const isCurrentUser = session?.user?.id === user._id;

  return (
    <div>
      <div className="grid max-h-[65vh] gap-6 overflow-y-scroll py-4 ps-1 pr-3">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <div className="bg-secondary relative flex size-32 w-fit items-center justify-center overflow-hidden rounded-full">
            {user.image ? (
              <>
                <Loader2 className="text-muted absolute inset-1/2 size-8 -translate-x-1/2 -translate-y-1/2 animate-spin" />
                <Image
                  src={user.image}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="relative h-full w-full rounded-full object-cover"
                />
              </>
            ) : (
              <User2 className="text-muted-foreground size-16" />
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">{user.name}</h3>
            <p className="text-muted-foreground">{user.email}</p>
            <Badge
              variant={
                user.role === "ADMIN"
                  ? "default"
                  : user.role === "EDITOR"
                    ? "secondary"
                    : "outline"
              }
              className="capitalize"
            >
              {user.role.toLowerCase()}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-2 text-center sm:text-left">
          <h4 className="font-medium">Información</h4>
          <div className="text-muted-foreground text-sm">
            <p>
              Este panel muestra la información básica del usuario del
              dashboard.
            </p>
            <p>El rol determina los permisos dentro del sistema.</p>
          </div>
        </div>
      </div>

      <DialogFooter className="mt-4">
        <Button
          disabled={isCurrentUser}
          onClick={() =>
            openDialog({
              title: `Editar a ${user.name}`,
              description: "Modifique el rol del usuario y guarde los cambios.",
              content: () => <CreateUserForm user={user} />,
            })
          }
        >
          Editar Rol
        </Button>
        <DialogClose asChild>
          <Button variant="outline">Cerrar</Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
}
