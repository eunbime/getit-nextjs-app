import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import RegisterForm from "@/components/auth/RegisterForm";
import { act } from "react";

// 모킹 설정
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("axios");

// Input과 Button 컴포넌트 모킹
jest.mock("@/components/common/Input", () => {
  return function MockInput({
    id,
    label,
    register,
    type = "text",
    disabled,
  }: any) {
    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <input id={id} type={type} disabled={disabled} {...register(id)} />
      </div>
    );
  };
});

jest.mock("@/components/common/Button", () => {
  return function MockButton({ label, disabled }: any) {
    return (
      <button type="submit" disabled={disabled} data-testid="submit-button">
        {label}
      </button>
    );
  };
});

describe("RegisterForm", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("폼이 올바르게 렌더링된다", () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "회원가입" })
    ).toBeInTheDocument();
  });

  it("필수 필드가 비어있을 때 유효성 검사 에러를 표시한다", async () => {
    render(<RegisterForm />);

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText("이메일 형식이 올바르지 않습니다.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("이름은 필수 입력 항목입니다.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("비밀번호는 최소 6자 이상이어야 합니다.")
      ).toBeInTheDocument();
    });
  });

  it("회원가입 성공 시 로그인 페이지로 리다이렉트된다", async () => {
    render(<RegisterForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const nameInput = screen.getByLabelText(/name/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByTestId("submit-button");

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(nameInput, { target: { value: "Test User" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
    });

    (axios.post as jest.Mock).mockResolvedValueOnce({ status: 200 });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/register", {
        email: "test@example.com",
        name: "Test User",
        password: "password123",
      });
      expect(mockRouter.push).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("이미 가입된 이메일일 경우 에러 메시지를 표시한다", async () => {
    render(<RegisterForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const nameInput = screen.getByLabelText(/name/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByTestId("submit-button");

    await act(async () => {
      fireEvent.change(emailInput, {
        target: { value: "existing@example.com" },
      });
      fireEvent.change(nameInput, { target: { value: "Test User" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
    });

    (axios.post as jest.Mock).mockRejectedValueOnce(new Error("Email exists"));

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText("이미 가입된 이메일입니다.")).toBeInTheDocument();
    });
  });

  it("로딩 중에는 입력 필드와 버튼이 비활성화된다", async () => {
    render(<RegisterForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const nameInput = screen.getByLabelText(/name/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByTestId("submit-button");

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(nameInput, { target: { value: "Test User" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
    });

    let resolveRequest: (value: any) => void;
    (axios.post as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        })
    );

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(emailInput).toHaveAttribute("disabled");
      expect(nameInput).toHaveAttribute("disabled");
      expect(passwordInput).toHaveAttribute("disabled");
      expect(submitButton).toHaveAttribute("disabled");
    });

    resolveRequest!({ status: 200 });
  });
});
