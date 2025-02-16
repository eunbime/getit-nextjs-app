"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";

import { Category, Subcategory } from "@prisma/client";
import { ProductSchema } from "@/schemas";
import { CATEGORY_TITLE, CategoryType } from "@/constants/categories";
import { useCategories } from "@/hooks/category/useCategories";
import { useProductById } from "@/hooks/product/useProductById";
import { useSubCategories } from "@/hooks/category/useSubCategories";
import CategoryInput from "@/components/categories/CategoryInput";
import Button from "@/components/common/Button";
import Heading from "@/components/common/Heading";
import Input from "@/components/common/Input";
import ImageUpload from "@/components/ImageUpload";

const KakaoMap = dynamic(() => import("@/components/KakaoMap"), {
  ssr: false,
  loading: () => <p>지도를 불러오는 중...</p>,
});

const ProductForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams?.get("productId");
  const [isLoading, setIsLoading] = useState(false);

  const { data: productData } = useProductById(productId);
  const { data: categories } = useCategories();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      subCategory: "",
      latitude: null,
      longitude: null,
      imageSrc: "",
      price: 1,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (productData) {
      reset({
        title: productData.title,
        description: productData.description,
        category: productData.category?.name || productData.category,
        subCategory: productData.subcategory?.name || productData.subCategory,
        latitude: productData.latitude,
        longitude: productData.longitude,
        imageSrc: productData.imageSrc,
        price: productData.price,
      });
    }
  }, [productData, reset]);

  const { imageSrc, category, subCategory, latitude, longitude } = watch();

  const { data: subCategories } = useSubCategories(category as CategoryType);

  const setCustomValue = (
    id: keyof z.infer<typeof ProductSchema>,
    value: any
  ) => {
    setValue(id, value);
  };

  const onSubmit: SubmitHandler<z.infer<typeof ProductSchema>> = async (
    data
  ) => {
    try {
      setIsLoading(true);

      const response = await (productId
        ? axios.patch(`/api/products/${productId}`, data)
        : axios.post("/api/products", data));

      toast.success(
        productId ? "상품이 수정되었습니다!" : "상품이 등록되었습니다!"
      );
      router.push(`/products/${response.data.id}`);
      reset();
    } catch (error) {
      toast.error("오류가 발생했습니다!");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <Heading title="Product Upload" subtitle="upload your product" />
      <ImageUpload
        onChange={(value) => setCustomValue("imageSrc", value)}
        value={imageSrc}
      />
      {errors.imageSrc && (
        <p className="text-red-500 text-xs mt-1">
          {errors.imageSrc.message?.toString()}
        </p>
      )}
      <hr />
      <Input
        id="title"
        label="Title"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <hr />
      <Input
        id="description"
        label="Description"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        isTextArea
      />
      <hr />
      <Input
        id="price"
        label="Price"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        formatPrice
        type="number"
      />
      <hr />

      {/* 카테고리 선택 */}
      <div
        className="
      grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto
      "
      >
        {categories?.map((item: Category) => (
          <div key={item.id} className="col-span-1">
            <CategoryInput
              onClick={(category) => {
                setCustomValue("category", category);
                setCustomValue("subCategory", "");
              }}
              selected={category === item.name}
              label={CATEGORY_TITLE[item.name as CategoryType]}
              path={item.name}
            />
          </div>
        ))}
      </div>
      {errors.category && (
        <p className="text-red-500 text-xs mt-1">
          {errors.category.message?.toString()}
        </p>
      )}

      {/* 서브카테고리 선택 */}
      {category && (
        <div
          className="
                grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto
                "
        >
          {subCategories?.map((item: Subcategory) => (
            <div key={item.id} className="col-span-1">
              <CategoryInput
                onClick={(subCategory) =>
                  setCustomValue("subCategory", subCategory)
                }
                selected={subCategory === item.name}
                label={item.name}
                path={item.name}
              />
            </div>
          ))}
        </div>
      )}
      {!errors.category && errors.subCategory && (
        <p className="text-red-500 text-xs mt-1">
          {errors.subCategory.message?.toString()}
        </p>
      )}

      <hr />

      <KakaoMap
        setCustomValue={setCustomValue}
        latitude={latitude || 0}
        longitude={longitude || 0}
      />
      <Button
        label={productId ? "상품 수정하기" : "상품 등록하기"}
        disabled={isLoading}
      />
    </form>
  );
};

export default ProductForm;
