import { Skeleton } from "../ui/skeleton";

export default function CategorySkeleton() {
  return (
    <div
      className="flex flex-row flex-wrap items-center justify-around overflow-x-auto mt-16"
      role="tablist"
      aria-label="카테고리 로딩 중"
    >
      {Array.from({ length: 7 }).map((_, index) => (
        <Skeleton
          key={index}
          data-testid="skeleton"
          className="h-10 md:w-24 w-20 mb-2"
        />
      ))}
    </div>
  );
}
