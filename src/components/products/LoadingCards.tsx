import { Skeleton } from "@/components/ui/skeleton";
import { SearchParams } from "@/hooks/api/useProducts";

interface LoadingCardsProps {
  searchParams: SearchParams;
}

const LoadingCards: React.FC<LoadingCardsProps> = ({ searchParams }) => {
  return (
    <div className="w-full grid grid-cols-1 gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="flex flex-col space-y-3 justify-center items-center"
        >
          {Object.keys(searchParams).length === 0 ? (
            <>
              <Skeleton className="md:h-[250px] h-[300px] md:w-[250px] w-[350px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="md:h-4 h-6 md:w-[200px] w-[300px]" />
                <Skeleton className="md:h-4 h-6 md:w-[150px] w-[250px]" />
                <Skeleton className="md:h-4 h-6 md:w-[250px] w-[350px]" />
              </div>
            </>
          ) : (
            <>
              <Skeleton className="md:h-[200px] h-[300px] md:w-[200px] w-[350px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="md:h-4 h-6 md:w-[150px] w-[300px]" />
                <Skeleton className="md:h-4 h-6 md:w-[100px] w-[250px]" />
                <Skeleton className="md:h-4 h-6 md:w-[200px] w-[350px]" />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default LoadingCards;
