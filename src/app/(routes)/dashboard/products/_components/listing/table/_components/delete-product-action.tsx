"use client";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import type { Product } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useDialog } from "@/context/dialog-provider";
import { useTableState } from "@/context/table-state-provider";

interface DeleteProductActionProps {
  product: Product;
}

export default function DeleteProductAction({
  product,
}: DeleteProductActionProps) {
  const { closeDialog: closeParentDialog, setPreventDialogClose } = useDialog();
  const { currentQueryInput, resetToFirstPage } = useTableState();
  const utils = api.useUtils();

  const { mutate: deleteProduct, isPending: isDeleting } =
    api.products.deleteProduct.useMutation({
      onMutate: async ({ _id }) => {
        await utils.products.getAllProducts.cancel(currentQueryInput);

        const previousProductsResponse =
          utils.products.getAllProducts.getData(currentQueryInput);

        utils.products.getAllProducts.setData(
          currentQueryInput,
          (oldResponse) => {
            if (!oldResponse) return undefined;
            return {
              ...oldResponse,
              data: oldResponse.data.filter((p) => p._id !== _id),
              totalRowCount: Math.max(0, oldResponse.totalRowCount - 1),
            };
          },
        );

        return { previousProductsResponse, queryInputUsed: currentQueryInput };
      },
      onError: (error, _variables, context) => {
        if (context?.previousProductsResponse) {
          utils.products.getAllProducts.setData(
            context.queryInputUsed,
            context.previousProductsResponse,
          );
        }
        console.error("Error deleting product:", error);
        toast.error(`Error eliminando producto: ${error.message}`, {
          duration: 3000,
        });
      },
      onSuccess: () => {
        console.log("Product deleted successfully");
        resetToFirstPage();
      },
      onSettled: (_data, error) => {
        void utils.products.getAllProducts.invalidate();
        void utils.products.getDashboardSummary.invalidate();

        if (!error) {
          toast.success("Producto eliminado exitosamente!", {
            duration: 3000,
          });
          setPreventDialogClose(false);
          closeParentDialog();
        }
      },
    });

  const handleDelete = () => {
    setPreventDialogClose(true);
    deleteProduct({ _id: product._id });
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
