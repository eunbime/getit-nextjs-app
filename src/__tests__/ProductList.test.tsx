import { render, screen } from "@testing-library/react";
import { InfiniteData } from "@tanstack/react-query";
import ProductList from "@/components/products/ProductList";

// ProductCard 컴포넌트 모킹
jest.mock("@/components/products/ProductCard", () => {
  return function MockProductCard({ data }: { data: any }) {
    return <div data-testid="product-card">{data.name}</div>;
  };
});

describe("ProductList", () => {
  const mockProducts: InfiniteData<any> = {
    pages: [
      {
        data: [
          { id: 1, name: "상품1", price: 10000 },
          { id: 2, name: "상품2", price: 20000 },
        ],
        hasMore: true,
        currentPage: 1,
      },
      {
        data: [
          { id: 3, name: "상품3", price: 30000 },
          { id: 4, name: "상품4", price: 40000 },
        ],
        hasMore: false,
        currentPage: 2,
      },
    ],
    pageParams: [1, 2],
  };

  it("상품 목록이 없을 때 빈 화면을 렌더링한다", () => {
    render(<ProductList products={undefined} />);
    const productCards = screen.queryAllByTestId("product-card");
    expect(productCards).toHaveLength(0);
  });

  it("상품 목록을 정상적으로 렌더링한다", () => {
    render(<ProductList products={mockProducts} />);

    const productCards = screen.getAllByTestId("product-card");
    expect(productCards).toHaveLength(4);

    // 상품 이름이 올바르게 표시되는지 확인
    expect(screen.getByText("상품1")).toBeInTheDocument();
    expect(screen.getByText("상품2")).toBeInTheDocument();
    expect(screen.getByText("상품3")).toBeInTheDocument();
    expect(screen.getByText("상품4")).toBeInTheDocument();
  });

  it("그리드 레이아웃이 올바르게 적용되어 있다", () => {
    render(<ProductList products={mockProducts} />);

    const gridContainer = screen.getByTestId("product-grid");
    expect(gridContainer).toHaveClass(
      "w-full",
      "grid",
      "grid-cols-1",
      "sm:grid-cols-2",
      "md:grid-cols-3",
      "lg:grid-cols-4",
      "xl:grid-cols-5",
      "2xl:grid-cols-6"
    );
  });
});
