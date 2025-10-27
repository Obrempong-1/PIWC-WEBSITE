
import { Skeleton } from "@/components/ui/skeleton";

const EventDetailSkeleton = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <div className="flex items-center text-muted-foreground mb-6 space-x-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-36" />
        </div>
        <Skeleton className="w-full h-96 rounded-md mb-6" />
        <div className="prose max-w-none">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
};

export default EventDetailSkeleton;
