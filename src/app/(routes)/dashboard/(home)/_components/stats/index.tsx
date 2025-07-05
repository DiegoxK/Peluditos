import { AdoptionRadial } from "./_components/adoption-radial";
import { SpeciesPie } from "./_components/species-pie";
import { VaccineRadial } from "./_components/vaccine-radial";

export default function PetStats() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <SpeciesPie />
      <AdoptionRadial />
      <VaccineRadial />
    </div>
  );
}
