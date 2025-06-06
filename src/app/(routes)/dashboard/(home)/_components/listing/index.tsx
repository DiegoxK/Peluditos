import { columns } from "./table/columns";
import { DataTable } from "./table";
import { StatsCards, StatsCardsSkeleton } from "./_components/stats-cards";
import { Suspense } from "react";

export default function PetListing() {
  return (
    <>
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards />
      </Suspense>
      <DataTable columns={columns} />
    </>
  );
}
