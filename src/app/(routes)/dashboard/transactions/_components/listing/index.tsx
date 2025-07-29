import { columns } from "./table/columns";
import { DataTable } from "./table";
import { DataTableSkeleton } from "./table/_components/loading-skeleton";
import { Suspense } from "react";
import { StatsCards, StatsCardsSkeleton } from "./_components/stats-cards";

export default function TransactionListing() {
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
