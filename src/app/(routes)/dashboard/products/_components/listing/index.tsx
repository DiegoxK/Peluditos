import { columns } from "./table/columns";
import { DataTable } from "./table";
import { StatsCards, StatsCardsSkeleton } from "./_components/stats-cards";
import { DataTableSkeleton } from "./table/_components/loading-skeleton";
import { Suspense } from "react";

export default function ProductListing() {
  return (
    <>
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards />
      </Suspense>
      <Suspense fallback={<DataTableSkeleton />}>
        <DataTable columns={columns} />
      </Suspense>
    </>
  );
}
