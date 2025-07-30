import { columns } from "./table/columns";
import { DataTable } from "./table";
import { DataTableSkeleton } from "./table/_components/loading-skeleton";
import { Suspense } from "react";

export default function UsersListing() {
  return (
    <Suspense fallback={<DataTableSkeleton />}>
      <DataTable columns={columns} />
    </Suspense>
  );
}
