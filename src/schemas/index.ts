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

export const ProductSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "제목은 필수 입력 항목입니다.",
    })
    .max(50, {
      message: "제목은 최대 50자까지 입력할 수 있습니다.",
    }),
  description: z
    .string()
    .min(1, {
      message: "설명은 필수 입력 항목입니다.",
    })
    .max(1000, {
      message: "설명은 최대 500자까지 입력할 수 있습니다.",
    }),
  category: z.string().min(1, {
    message: "카테고리는 필수 선택 항목입니다.",
  }),
  subCategory: z.string().min(1, {
    message: "서브카테고리는 필수 선택 항목입니다.",
  }),
  imageSrc: z.string().min(1, {
    message: "이미지를 업로드해주세요",
  }),
  price: z
    .number({
      required_error: "가격을 입력해주세요",
      invalid_type_error: "가격은 숫자만 입력할 수 있습니다.",
    })
    .min(1, {
      message: "가격은 0원 이상이어야 합니다.",
    })
    .max(1000000000, {
      message: "최대 10억원까지 입력 가능합니다.",
    }),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
});

export const PostSchema = z.object({
  title: z.string().min(1, {
    message: "제목은 필수 입력 항목입니다.",
  }),
  content: z.string().min(1, {
    message: "내용은 필수 입력 항목입니다.",
  }),
  category: z.string().min(1, {
    message: "카테고리는 필수 선택 항목입니다.",
  }),
  subcategory: z.string().min(1, {
    message: "서브카테고리는 필수 선택 항목입니다.",
  }),
});
