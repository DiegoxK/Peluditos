"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type DialogOptions = {
  title?: string;
  description?: string;
  content?: () => ReactNode;
};

type DialogContextType = {
  openDialog: (options: DialogOptions) => void;
  closeDialog: () => void;
  setPreventDialogClose: Dispatch<SetStateAction<boolean>>;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<DialogOptions>({});
  const [preventDialogClose, setPreventDialogClose] = useState(false);

  const openDialog = (options: DialogOptions) => {
    setDialogContent(options);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);

    // Delay unmounting until after dialog transition ends
    setTimeout(() => {
      setDialogContent({});
    }, 200); // Match Dialog exit animation duration
  };

  return (
    <DialogContext.Provider
      value={{ openDialog, closeDialog, setPreventDialogClose }}
    >
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          onEscapeKeyDown={(event) => {
            if (preventDialogClose) event.preventDefault();
          }}
          onPointerDownOutside={(event) => {
            if (preventDialogClose) event.preventDefault();
          }}
          onInteractOutside={(event) => {
            if (preventDialogClose) event.preventDefault();
          }}
          className="max-h-[90vh]"
        >
          <DialogHeader>
            {dialogContent.title && (
              <DialogTitle>{dialogContent.title}</DialogTitle>
            )}
            {dialogContent.description && (
              <DialogDescription>{dialogContent.description}</DialogDescription>
            )}
          </DialogHeader>
          {dialogContent.content?.()}
        </DialogContent>
      </Dialog>
    </DialogContext.Provider>
  );
};

export const useDialog = (): DialogContextType => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};
