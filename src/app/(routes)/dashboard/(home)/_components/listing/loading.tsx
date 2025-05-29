import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingListing() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <Skeleton className="ml-4 h-[20px] w-[200px] rounded-md" />
          <div className="mx-4">
            <Separator />
          </div>
          <Skeleton className="my-2 ml-4 h-[20px] w-[20px] rounded-md" />
        </Card>

        <Card>
          <Skeleton className="ml-4 h-[20px] w-[200px] rounded-md" />
          <div className="mx-4">
            <Separator />
          </div>
          <Skeleton className="my-2 ml-4 h-[20px] w-[20px] rounded-md" />
        </Card>
        <Card>
          <Skeleton className="ml-4 h-[20px] w-[200px] rounded-md" />
          <div className="mx-4">
            <Separator />
          </div>
          <Skeleton className="my-2 ml-4 h-[20px] w-[20px] rounded-md" />
        </Card>
      </div>

      <div className="bg-sidebar border-sidebar-border space-y-4 border p-4">
        <Skeleton className="h-[20px] w-[250px] rounded-md" />
        <Skeleton className="h-[20px] w-[150px] rounded-md" />
        <Skeleton className="h-[20px] w-full rounded-md" />
        <div className="flex gap-4">
          <Skeleton className="h-[20px] w-[100px] rounded-md" />
          <Skeleton className="h-[20px] w-[100px] rounded-md" />
          <Skeleton className="h-[20px] w-[100px] rounded-md" />
          <Skeleton className="h-[20px] w-[100px] rounded-md" />
        </div>
        <Separator />
        <div className="space-y-8">
          <div className="grid grid-cols-8 gap-4">
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
          </div>
          <div className="grid grid-cols-8 gap-4">
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
          </div>
          <div className="grid grid-cols-8 gap-4">
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
          </div>
          <div className="grid grid-cols-8 gap-4">
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
            <Skeleton className="h-[20px] w-full rounded-md" />
          </div>
        </div>
      </div>
    </>
  );
}
