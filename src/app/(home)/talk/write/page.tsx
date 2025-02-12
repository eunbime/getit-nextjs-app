"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Category } from "@prisma/client";
import TextEditor from "@/components/common/TextEditor";
import CategorySelect from "@/components/talk/CategorySelect";
import SubCategorySelect from "@/components/talk/SubCategorySelect";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PostSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

export default function TalkWritePage() {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams?.get("postId");

  const {
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      subcategory: "",
    },
    mode: "onChange",
  });

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/talk/posts/${postId}`);
      return data;
    },
    enabled: !!postId,
  });

  useEffect(() => {
    if (postId && post && !isLoading) {
      console.log({ post });
      setValue("title", post?.title);
      setValue("content", post?.content || "");
      setValue("category", post?.category.name);
      setValue("subcategory", post?.subcategory.name);
      setSelectedCategory(post?.category.name);
    }
  }, [postId, post, setValue, isLoading]);

  const onSubmit = async (data: z.infer<typeof PostSchema>) => {
    try {
      const { title, content, category, subcategory } = data;

      // 카테고리와 서브카테고리 확인
      if (!category || !subcategory) {
        toast.error("카테고리와 서브카테고리를 선택해주세요.");
        return;
      }

      // 수정
      if (postId) {
        await axios.put(`/api/talk/posts/${postId}`, {
          title,
          content,
          category,
          subcategory,
        });
        toast.success("게시글이 수정되었습니다.");
      } else {
        // 작성
        await axios.post("/api/talk/posts", {
          title,
          content,
          category,
          subcategory,
        });
        console.log("게시글 작성 완료");
        toast.success("게시글이 작성되었습니다.");
      }

      queryClient.invalidateQueries({ queryKey: ["talk-posts"] });
      if (postId) {
        queryClient.invalidateQueries({ queryKey: ["post", postId] });
      }
      router.push("/talk");
    } catch (error) {
      console.error(error);
    }
  };

  const handleNavigation = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const closestLink = target.closest("a");

      if (closestLink) {
        e.preventDefault();
        const confirmed = window.confirm("저장하지 않고 나가시겠습니까?");
        if (confirmed) {
          router.push(closestLink.getAttribute("href") || "/");
        }
      }
    },
    [router]
  );

  useEffect(() => {
    document.addEventListener("click", handleNavigation, true);

    return () => {
      document.removeEventListener("click", handleNavigation, true);
    };
  }, [handleNavigation]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axios.get("/api/categories");
      return data;
    },
  });

  return (
    <div className="w-full h-full flex flex-col gap-5 p-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = getValues();
          onSubmit(formData);
        }}
      >
        <input
          title="title"
          className="w-full outline-none focus:outline-none focus:ring-0 focus:border-gray-300 border-b-2 border-t-0 border-x-0 border-gray-300 rounded-none text-3xl font-bold p-2"
          placeholder="제목을 입력해주세요."
          {...register("title")}
        />
        {errors.title && <p>{errors.title.message}</p>}
        <div className="flex w-full md:w-1/2 p-3">
          <CategorySelect
            categories={categories}
            setSelectedCategory={setSelectedCategory}
            setCategory={(category: string) => setValue("category", category)}
          />
          <SubCategorySelect
            subCategories={
              categories?.find(
                (category: Category) => category.name === selectedCategory
              )?.subcategories
            }
            setSubCategory={(subcategory: string) => {
              if (subcategory) {
                setValue("subcategory", subcategory);
              }
            }}
          />
        </div>
        <TextEditor
          value={getValues("content")}
          onChange={(value) => setValue("content", value)}
        />
        {errors.content && <p>{errors.content.message}</p>}
        <button
          type="submit" // type을 명시적으로 지정
          className="fixed bottom-10 right-10 bg-[#0d0c8f] text-xl font-bold text-white px-4 py-2 rounded-md"
        >
          {postId ? "수정하기" : "작성하기"}
        </button>
      </form>
    </div>
  );
}
