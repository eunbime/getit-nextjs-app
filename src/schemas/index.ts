import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "이메일 형식이 올바르지 않습니다.",
  }),
  password: z.string().min(1, {
    message: "비밀번호는 필수 입력 항목입니다.",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "이메일 형식이 올바르지 않습니다.",
  }),
  password: z.string().min(6, {
    message: "비밀번호는 최소 6자 이상이어야 합니다.",
  }),
  name: z.string().min(1, {
    message: "이름은 필수 입력 항목입니다.",
  }),
});
