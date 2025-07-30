"use client";

import { Button } from "@/components/ui/button";
import { useDialog } from "@/context/dialog-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/server/db/schema";
import { MoreHorizontal } from "lucide-react";
import UserDetails from "./_components/user-details";
import DeleteUserAction from "./_components/delete-user-action";
import CreateUserForm from "./_components/create-user-form";
import { useSession } from "next-auth/react";

interface UserDataTableActionsProps {
  user: User;
}

export default function UserDataTableActions({
  user,
}: UserDataTableActionsProps) {
  const { openDialog } = useDialog();
  const { data: session } = useSession();

  const isCurrentUser = session?.user?.id === user._id;

  console.log(session?.user?.id, user._id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            openDialog({
              title: `Detalles de ${user.name}`,
              description: "Información completa del usuario.",
              content: () => <UserDetails user={user} />,
            })
          }
        >
          Ver detalles
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            openDialog({
              title: `Editar rol de ${user.name}`,
              description: "Modifique el rol del usuario y guarde los cambios.",
              content: () => <CreateUserForm user={user} />,
            })
          }
          disabled={isCurrentUser}
        >
          Editar rol
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() =>
            openDialog({
              title: `¿Eliminar a ${user.name}?`,
              description:
                "Esta acción no se puede deshacer. El usuario será eliminado permanentemente.",
              content: () => <DeleteUserAction user={user} />,
            })
          }
          disabled={isCurrentUser}
          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
