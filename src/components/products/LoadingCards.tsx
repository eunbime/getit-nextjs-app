import { Skeleton } from "@/components/ui/skeleton";

const LoadingCards = () => {
  return (
    <div className="flex flex-col space-y-3 justify-center items-center gap-4">
      <>
        <Skeleton className="w-full aspect-square rounded-xl" />
        <div className="w-full space-y-2">
          <Skeleton className="md:h-4 h-6 w-[70%]" />
          <Skeleton className="md:h-4 h-6 w-[60%]" />
          <Skeleton className="md:h-4 h-6 w-full" />
        </div>
      </>
    </div>
  );
};

export default LoadingCards;
