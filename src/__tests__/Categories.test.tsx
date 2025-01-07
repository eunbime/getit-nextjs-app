import { render, screen } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import { useCategories } from "@/hooks/api/useCategories";
import Categories from "@/components/categories/Categories";

// next/navigation 모킹
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

// useCategories 훅 모킹
jest.mock("@/hooks/api/useCategories", () => ({
  useCategories: jest.fn(),
}));

describe("Categories", () => {
  beforeEach(() => {
    // useSearchParams 기본 모킹 설정
    (useSearchParams as jest.Mock).mockImplementation(() => ({
      get: () => null,
    }));
  });

  it("로딩 상태일 때 스켈레톤을 렌더링한다", () => {
    (useCategories as jest.Mock).mockReturnValue({
      isLoading: true,
      data: null,
      error: null,
    });

    render(<Categories />);

    expect(
      screen.getByRole("tablist", { name: "카테고리 로딩 중" })
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton")).toHaveLength(7);
  });

  it("에러 상태일 때 에러 메시지를 표시한다", () => {
    (useCategories as jest.Mock).mockReturnValue({
      isLoading: false,
      data: null,
      error: new Error("에러 발생"),
    });

    render(<Categories />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "카테고리를 불러오는데 실패했습니다"
    );
  });

  it("카테고리 목록을 정상적으로 렌더링한다", () => {
    const mockCategories = [
      { name: "all" },
      { name: "korean" },
      { name: "chinese" },
    ];

    (useCategories as jest.Mock).mockReturnValue({
      isLoading: false,
      data: mockCategories,
      error: null,
    });

    render(<Categories />);

    expect(
      screen.getByRole("tablist", { name: "카테고리 목록" })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(mockCategories.length);
  });

  it("선택된 카테고리가 있을 때 해당 카테고리가 선택된 상태로 표시된다", () => {
    const selectedCategory = "korean";
    (useSearchParams as jest.Mock).mockImplementation(() => ({
      get: () => selectedCategory,
    }));

    const mockCategories = [
      { name: "all" },
      { name: "korean" },
      { name: "chinese" },
    ];

    (useCategories as jest.Mock).mockReturnValue({
      isLoading: false,
      data: mockCategories,
      error: null,
    });

    render(<Categories />);

    const selectedTab = screen.getByRole("tab", { selected: true });
    expect(selectedTab).toHaveAttribute("aria-selected", "true");
  });
});
