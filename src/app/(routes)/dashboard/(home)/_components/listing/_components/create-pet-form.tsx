import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CreatePetForm() {
  return (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Nueva Mascota
    </Button>
  );
}
