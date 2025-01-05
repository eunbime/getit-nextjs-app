"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import { Category, Subcategory } from "@prisma/client";
import { useProductById } from "@/hooks/api/useProductById";
import { useCategories } from "@/hooks/api/useCategories";
import { CATEGORY_TITLE, CategoryType } from "@/constants/categories";
import CategoryInput from "@/components/categories/CategoryInput";
import Button from "@/components/common/Button";
import Heading from "@/components/common/Heading";
import Input from "@/components/common/Input";
import ImageUpload from "@/components/ImageUpload";

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
  } = useForm<FieldValues>({
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

  const imageSrc = watch("imageSrc");
  const category = watch("category");
  const subCategory = watch("subCategory");
  const latitude = watch("latitude");
  const longitude = watch("longitude");

  const { data: subCategories } = useQuery({
    queryKey: ["sub-categories", category],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/categories/sub-categories?category=${category}`
      );
      return data;
    },
    enabled: !!category,
  });

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    const productData = {
      ...data,
      price: parseInt(data.price),
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
    };

    const request = productId
      ? axios.patch(`/api/products/${productId}`, productData)
      : axios.post("/api/products", productData);

    request
      .then((response) => {
        router.push(`/products/${response.data.id}`);
        reset();
      })
      .catch((error) => {
        console.error("Error details:", error.response?.data);
        alert(error.response?.data?.error || "오류가 발생했습니다!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const KakaoMap = dynamic(() => import("@/components/KakaoMap"), {
    ssr: false,
  });
  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <Heading title="Product Upload" subtitle="upload your product" />
      <ImageUpload
        onChange={(value) => setCustomValue("imageSrc", value)}
        value={imageSrc}
      />
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

      <hr />

      <KakaoMap
        setCustomValue={setCustomValue}
        latitude={latitude}
        longitude={longitude}
      />
      {productId ? (
        <Button label="상품 수정하기" />
      ) : (
        <Button label="상품 생성하기" />
      )}
    </form>
  );
};

export default ProductForm;
