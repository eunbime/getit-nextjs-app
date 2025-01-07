import LoginForm from "@/components/auth/LoginForm";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("@/components/common/Button", () => {
  return function MockButton({ label, onClick, disabled }: any) {
    return (
      <button onClick={onClick} disabled={disabled} type="submit">
        {label}
      </button>
    );
  };
});

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

jest.mock("@/components/auth/Social", () => {
  return function MockSocial() {
    return <div data-testid="social-login" />;
  };
});

describe("LoginForm", () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
  });

  it("폼이 올바르게 렌더링된다", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /로그인/i })).toBeInTheDocument();
    expect(screen.getByText(/아직 계정이 없으신가요\?/i)).toBeInTheDocument();
  });

  it("이메일과 비밀번호가 비어있을 때 유효성 검사 에러를 표시한다", async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole("button", { name: /로그인/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("이메일 형식이 올바르지 않습니다.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("비밀번호는 필수 입력 항목입니다.")
      ).toBeInTheDocument();
    });
  });

  it("로그인 성공 시 홈페이지로 리다이렉트된다", async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /로그인/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // 로딩 상태를 시뮬레이션하기 위해 signIn 함수를 수정
    (signIn as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({ error: null });
          }, 100);
        })
    );

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "password123",
        redirect: false,
      });
      expect(mockRouter.push).toHaveBeenCalledWith("/");
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  it("로그인 실패 시 에러 메시지를 표시한다", async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /로그인/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    (signIn as jest.Mock).mockResolvedValueOnce({
      error: "Invalid credentials",
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/이메일 또는 비밀번호가 올바르지 않습니다/i)
      ).toBeInTheDocument();
    });
  });

  it("OAuth 계정 연동 에러 메시지를 표시한다", () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("error=OAuthAccountNotLinked")
    );

    render(<LoginForm />);

    expect(
      screen.getByText(/이미 다른 계정에서 사용중인 이메일입니다/i)
    ).toBeInTheDocument();
  });

  it("로딩 중에는 입력 필드와 버튼이 비활성화된다", async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /로그인/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // signIn 함수가 완료되기 전까지 지연
    let resolveSignIn: (value: any) => void;
    (signIn as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSignIn = resolve;
        })
    );

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });

    resolveSignIn!({ error: null });
  });
});
