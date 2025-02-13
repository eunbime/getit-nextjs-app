"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationWrapperProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

const PaginationWrapper = ({
  page,
  setPage,
  totalPages,
  hasNextPage,
  isFetchingNextPage,
}: PaginationWrapperProps) => {
  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (hasNextPage && !isFetchingNextPage) {
      setPage(page + 1);
    }
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    // 현재 페이지를 기준으로 앞뒤 delta만큼의 페이지 번호를 생성
    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    // 첫 페이지와 현재 범위 사이에 간격이 있으면 ... 추가
    if (page - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    // 현재 범위와 마지막 페이지 사이에 간격이 있으면 ... 추가
    if (page + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex justify-center mt-10">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePrevious();
              }}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {getPageNumbers().map((pageNumber, i) => (
            <PaginationItem key={i}>
              {pageNumber === "..." ? (
                <span className="px-4 py-2">...</span>
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(Number(pageNumber));
                  }}
                  isActive={page === pageNumber}
                >
                  {pageNumber}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNext();
              }}
              className={
                !hasNextPage || isFetchingNextPage
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {isFetchingNextPage && <div className="text-sm text-gray-500 ml-2"></div>}
    </div>
  );
};

export default PaginationWrapper;
