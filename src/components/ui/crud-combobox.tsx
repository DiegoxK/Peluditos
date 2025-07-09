import * as React from "react";
import { Check, ChevronsUpDown, Edit, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

export type ComboboxOption = {
  id: string;
  label: string;
};

interface CrudComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange: (value: string) => void;
  onAdd: (label: string) => void;
  onEdit: (option: ComboboxOption) => void;
  onDelete: (id: string) => void;
  className?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  addPlaceholder?: string;
  disabled?: boolean;
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function CrudCombobox({
  options,
  value,
  onChange,
  onAdd,
  onEdit,
  onDelete,
  className,
  placeholder = "Select an option...",
  searchPlaceholder = "Search or add...",
  addPlaceholder = "Press Enter to add",
  disabled = false,
  canAdd = true,
  canEdit = true,
  canDelete = true,
}: CrudComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const [editingOption, setEditingOption] =
    React.useState<ComboboxOption | null>(null);
  const [deletingOptionId, setDeletingOptionId] = React.useState<string | null>(
    null,
  );

  const handleAdd = () => {
    if (searchValue.trim()) {
      onAdd(searchValue.trim());
      setSearchValue("");
    }
  };

  const handleEdit = () => {
    if (editingOption?.label.trim()) {
      onEdit(editingOption);
      setEditingOption(null);
    }
  };

  const handleDelete = () => {
    if (deletingOptionId) {
      onDelete(deletingOptionId);
      setDeletingOptionId(null);
    }
  };

  const selectedOption = React.useMemo(
    () => options.find((option) => option.id === value),
    [options, value],
  );

  const deletingOption = React.useMemo(
    () => options.find((option) => option.id === deletingOptionId),
    [options, deletingOptionId],
  );

  const filteredOptions = React.useMemo(
    () =>
      searchValue
        ? options.filter((option) =>
            option.label.toLowerCase().includes(searchValue.toLowerCase()),
          )
        : options,
    [options, searchValue],
  );

  const showAddOption =
    canAdd &&
    searchValue &&
    !options.some((o) => o.label.toLowerCase() === searchValue.toLowerCase());

  return (
    <>
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between overflow-hidden", className)}
            disabled={disabled}
          >
            <span className="min-w-0 flex-1 truncate text-left">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              value={searchValue}
              onValueChange={setSearchValue}
              placeholder={searchPlaceholder}
              onKeyDown={(e) => {
                if (e.key === "Enter" && showAddOption) {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
            <CommandList>
              <CommandEmpty>No categorias</CommandEmpty>

              {showAddOption && (
                <CommandItem
                  onSelect={handleAdd}
                  className="text-muted-foreground hover:text-primary cursor-pointer"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {addPlaceholder} &quot;{searchValue}&quot;
                </CommandItem>
              )}

              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.label}
                    onSelect={() => {
                      onChange(option.id);
                      setOpen(false);
                    }}
                    className="group flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {option.label}
                    </div>

                    <div
                      className={cn(
                        "flex items-center opacity-0 group-hover:opacity-100",

                        value === option.id && "opacity-100",
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setEditingOption(option)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span className="sr-only">Edit {option.label}</span>
                        </Button>
                      )}

                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive h-6 w-6"
                          onClick={() => setDeletingOptionId(option.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Delete {option.label}</span>
                        </Button>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingOption}
        onOpenChange={(isOpen) => !isOpen && setEditingOption(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Option</DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Edit the label for &quot;{editingOption?.label}&quot;.
            <br />
            Press Enter to save changes.
          </DialogDescription>
          <Input
            value={editingOption?.label ?? ""}
            onChange={(e) =>
              editingOption &&
              setEditingOption({ ...editingOption, label: e.target.value })
            }
            onKeyDown={(e) => e.key === "Enter" && handleEdit()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingOption(null)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingOptionId}
        onOpenChange={(isOpen) => !isOpen && setDeletingOptionId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the &quot;{deletingOption?.label}
              &quot; option. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingOptionId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={handleDelete}
                variant="destructive"
                className="bg-destructive hover:bg-red-500"
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
