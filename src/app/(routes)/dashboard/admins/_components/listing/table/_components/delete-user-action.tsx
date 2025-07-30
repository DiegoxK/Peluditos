"use client";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import type { User } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useDialog } from "@/context/dialog-provider";
import { useTableState } from "@/context/table-state-provider";

interface DeleteUserActionProps {
  user: User;
}

export default function DeleteUserAction({ user }: DeleteUserActionProps) {
  const { closeDialog: closeParentDialog, setPreventDialogClose } = useDialog();
  const { currentQueryInput } = useTableState();
  const utils = api.useUtils();

  const { mutate: deleteUser, isPending: isDeleting } =
    api.users.deleteUser.useMutation({
      onMutate: async ({ _id }) => {
        setPreventDialogClose(true);
        await utils.users.getAllUsers.cancel(currentQueryInput);

        const previousUsersResponse =
          utils.users.getAllUsers.getData(currentQueryInput);

        utils.users.getAllUsers.setData(currentQueryInput, (oldResponse) => {
          if (!oldResponse) return undefined;
          return {
            ...oldResponse,
            data: oldResponse.data.filter((u) => u._id !== _id),
            totalRowCount: Math.max(0, oldResponse.totalRowCount - 1),
          };
        });

        return { previousUsersResponse, queryInputUsed: currentQueryInput };
      },
      onError: (error, _variables, context) => {
        if (context?.previousUsersResponse) {
          utils.users.getAllUsers.setData(
            context.queryInputUsed,
            context.previousUsersResponse,
          );
        }
        console.error("Error deleting user:", error);
        toast.error(`Error eliminando usuario: ${error.message}`, {
          duration: 3000,
        });
      },
      onSuccess: () => {
        console.log("User deleted successfully");
      },
      onSettled: (_data, error) => {
        void utils.users.getAllUsers.invalidate();

        setPreventDialogClose(false);
        if (!error) {
          toast.success("Usuario eliminado exitosamente!", {
            duration: 3000,
          });
          closeParentDialog();
        }
      },
    });

  const handleDelete = () => {
    deleteUser({ _id: user._id });
  };

  return (
    <DialogFooter className="mt-4">
      <DialogClose asChild>
        <Button variant="outline" type="button" disabled={isDeleting}>
          Cancelar
        </Button>
      </DialogClose>
      <Button
        onClick={handleDelete}
        variant="destructive"
        disabled={isDeleting}
      >
        {isDeleting ? "Eliminando..." : "Eliminar"}
      </Button>
    </DialogFooter>
  );
}
