
import { Skeleton } from "@/components/ui/skeleton";

const LeaderDetailSkeleton = () => {
  return (
    <div className='container mx-auto p-6 pt-24 max-w-4xl'>
      <div className='bg-white rounded-lg shadow-xl overflow-hidden'>
        <Skeleton className='w-full h-96' />
        <div className='p-8'>
          <Skeleton className='h-12 w-1/2 mb-2' />
          <Skeleton className='h-6 w-1/3 mb-4' />
          <div className='prose max-w-none text-gray-700'>
            <Skeleton className='h-4 w-full mb-2' />
            <Skeleton className='h-4 w-full mb-2' />
            <Skeleton className='h-4 w-5/6' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderDetailSkeleton;
