import { Skeleton } from "@/components/ui/skeleton";

const GallerySkeleton = () => {
  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <section className="relative py-24 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-20 w-3/4 mx-auto mb-6" />
            <Skeleton className="h-6 w-full max-w-lg mx-auto" />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-1/3 mx-auto mb-16" />
          <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4 max-w-full mx-auto">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" style={{ height: `${Math.random() * 200 + 200}px` }} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-50/50">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-1/3 mx-auto mb-16" />
          <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4 max-w-full mx-auto">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-xl" style={{ height: `${Math.random() * 200 + 250}px` }} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GallerySkeleton;
