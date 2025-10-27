
import { Skeleton } from "@/components/ui/skeleton";

const MilestoneDetailSkeleton = () => {
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="w-full h-96 rounded-lg mb-8" />
          <div className="prose max-w-none">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneDetailSkeleton;
