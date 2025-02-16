import { Skeleton } from "@/components/ui/skeleton";

const LoadingCards = () => {
  return (
    <div className="flex flex-col space-y-3 justify-center items-center gap-4">
      <>
        <Skeleton className="w-full aspect-square rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="md:h-4 h-6 md:w-[200px] w-[300px]" />
          <Skeleton className="md:h-4 h-6 md:w-[150px] w-[250px]" />
          <Skeleton className="md:h-4 h-6 md:w-[250px] w-[350px]" />
        </div>
      </>
    </div>
  );
};

export default LoadingCards;
