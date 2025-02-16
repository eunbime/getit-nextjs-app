"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";

import { Category } from "@prisma/client";
import { PostSchema } from "@/schemas";
import { useCategories } from "@/hooks/talk/useCategories";
import TextEditor from "@/components/common/TextEditor";
import CategorySelect from "@/components/talk/CategorySelect";
import SubCategorySelect from "@/components/talk/SubCategorySelect";

const TalkWriteForm = () => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams?.get("postId");

  const { data: categories } = useCategories();

  const {
    register,
    formState: { errors, isValid },
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
        router.push(`/talk/${postId}`);
      } else {
        // 작성
        await axios.post("/api/talk/posts", {
          title,
          content,
          category,
          subcategory,
        });

        toast.success("게시글이 작성되었습니다.");
        router.push("/talk");
      }

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (postId) {
        queryClient.invalidateQueries({ queryKey: ["post", postId] });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("게시글 작성 중 오류가 발생했습니다.");
        throw new Error(error.message);
      }
      toast.error("게시글 작성 중 오류가 발생했습니다.");
      throw new Error("게시글 작성 중 오류가 발생했습니다.");
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

  return (
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
      {errors.title && (
        <p className="text-red-500 text-sm">{errors.title.message}</p>
      )}
      <div className="flex w-full md:w-1/2 p-3">
        <CategorySelect
          categories={categories}
          setSelectedCategory={setSelectedCategory}
          setCategory={(category: string) => setValue("category", category)}
          savedCategory={getValues("category")}
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
          savedSubCategory={getValues("subcategory")}
        />
      </div>
      <TextEditor
        value={getValues("content")}
        onChange={(value) =>
          setValue("content", value, {
            shouldValidate: true,
          })
        }
      />
      {errors.content && (
        <p className="text-red-500 text-sm">{errors.content.message}</p>
      )}
      <button
        type="submit"
        disabled={!isValid}
        className={`fixed bottom-10 right-10 bg-[#0d0c8f] text-xl font-bold text-white px-4 py-2 rounded-md
          ${
            !isValid
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#0d0c8f] text-white hover:bg-[#0d0c8f]/90"
          }
        `}
      >
        {postId ? "수정하기" : "작성하기"}
      </button>
    </form>
  );
};

export default TalkWriteForm;
