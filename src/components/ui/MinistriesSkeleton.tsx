import { Skeleton } from "@/components/ui/skeleton";

const MinistriesSkeleton = () => {
  const cardCount = 6;

  return (
    <div className="min-h-screen pt-24">
      
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Skeleton className="h-16 w-3/4 mx-auto mb-6" />
            <Skeleton className="h-6 w-full max-w-xl mx-auto" />
          </div>
        </div>
      </section>

      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {Array.from({ length: cardCount }).map((_, index) => (
              <div key={index} className="frosted-glass p-6 rounded-lg">
                <Skeleton className="aspect-video w-full rounded-t-lg mb-6" />
                <Skeleton className="h-8 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-6" />
                <div className="space-y-3 mb-6">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Skeleton className="h-14 w-3/4 mx-auto mb-6" />
            <Skeleton className="h-6 w-full max-w-lg mx-auto mb-8" />
            <Skeleton className="h-14 w-48 mx-auto" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MinistriesSkeleton;
