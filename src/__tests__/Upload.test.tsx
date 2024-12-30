import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import ProductUploadPage from "@/app/products/upload/page";

// 모킹 설정
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

jest.mock("axios");
jest.mock("@/components/KakaoMap", () => {
  return function DummyMap({ setCustomValue }: any) {
    return <div data-testid="kakao-map">카카오맵 컴포넌트</div>;
  };
});

describe("ProductUploadPage", () => {
  const queryClient = new QueryClient();
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    // API 응답 모킹
    (axios.get as jest.Mock).mockResolvedValue({
      data: [
        { id: 1, name: "electronics" },
        { id: 2, name: "furniture" },
      ],
    });
  });

  // ... existing code ...

  it("기본 렌더링이 정상적으로 되어야 함", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProductUploadPage />
      </QueryClientProvider>
    );

    expect(screen.getByText("Product Upload")).toBeInTheDocument();
    // input 요소를 id로 찾도록 수정
    expect(screen.getByRole("textbox", { name: "Title" })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Description" })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Price" })).toBeInTheDocument();
  });

  it("상품 생성 폼 제출이 정상적으로 동작해야 함", async () => {
    // axios.post 모킹 추가
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { id: "123" },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ProductUploadPage />
      </QueryClientProvider>
    );

    // input 요소를 찾는 방식을 수정
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "테스트 상품" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "테스트 설명" },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: "10000" },
    });

    // ... rest of the test ...

    // 폼 제출
    fireEvent.click(screen.getByText("상품 생성하기"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "/api/products",
        expect.any(Object)
      );
      expect(mockRouter.push).toHaveBeenCalledWith("/products/123");
    });
  });

  // ... existing code ...

  it("에러 발생 시 알림이 표시되어야 함", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const mockAlert = jest.spyOn(window, "alert").mockImplementation();

    (axios.post as jest.Mock).mockRejectedValueOnce(
      new Error("에러가 발생했습니다")
    );

    render(
      <QueryClientProvider client={queryClient}>
        <ProductUploadPage />
      </QueryClientProvider>
    );

    // getByLabelText 대신 getByRole과 name 속성 사용
    fireEvent.change(screen.getByRole("textbox", { name: /title/i }), {
      target: { value: "테스트 상품" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /description/i }), {
      target: { value: "테스트 설명" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /price/i }), {
      target: { value: "10000" },
    });

    fireEvent.click(screen.getByText("상품 생성하기"));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("오류가 발생했습니다!");
    });

    consoleSpy.mockRestore();
    mockAlert.mockRestore();
  });
});
