import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionStatusSkeleton() {
  return (
    <Card className="mx-auto w-full max-w-lg shadow-lg">
      <CardHeader className="items-center space-y-4">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-full max-w-sm" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 rounded-lg border p-4">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-px w-full" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}
