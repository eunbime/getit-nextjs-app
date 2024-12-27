"use client";

import qs from "query-string";
import previewImage from "@/helpers/previewImage";
import uploadImage from "@/helpers/uploadImage";
import axios from "axios";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CgClose } from "react-icons/cg";
import { IoImageOutline } from "react-icons/io5";
import { RiSendPlaneLine } from "react-icons/ri";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface InputProps {
  receiverId: string;
  currentUserId: string;
  apiUrl: string;
}

const Input = ({ receiverId, currentUserId, apiUrl }: InputProps) => {
  const imageRef = useRef<null | HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const formSchema = z.object({
    text: z.string().optional(),
    image: z.any(),
  });

  const { register, handleSubmit, reset, setValue } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      image: null,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const imgUrl = values.image
      ? await uploadImage(values.image as File)
      : null;

    if (values)
      if (values.text || imgUrl) {
        try {
          const url = qs.stringifyUrl({
            url: apiUrl,
            query: {
              receiverId,
              senderId: currentUserId,
            },
          });

          await axios.post(url, {
            text: values.text || "",
            image: imgUrl || "",
            receiverId,
            senderId: currentUserId,
          });
        } catch (error) {
          console.log(error);
        }
      }

    reset();
    setImagePreview(null);
  };

  const chooseImage = () => {
    imageRef.current?.click();
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue("image", null);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative flex items-center justify-between w-full gap-4 p-2 pl-4 border-[1px] border-gray-300 rounded-md shadow-sm"
    >
      {imagePreview && (
        <div className="absolute right-0 w-full overflow-hidden rounded-md bottom-[4.2rem] max-w-[300px] shadow-md">
          <img src={imagePreview} alt="imagePreview" />
          <span
            className="absolute flex items-center justify-center p-2 text-xl text-white bg-gray-900
          cursor-pointer top-[0.4rem] right-[0.4rem] rounded-full opacity-60 hover:opacity-100"
            onClick={removeImage}
          >
            <CgClose />
          </span>
        </div>
      )}
      <input
        className="w-full text-base outline-none"
        type="text"
        placeholder="메시지를 입력해주세요."
        {...register("text")}
      />
      <input
        className="hidden"
        type="file"
        onChange={(e) =>
          previewImage({
            e,
            setImagePreview,
            setValue: (_, file) => setValue("image", file),
          })
        }
        ref={imageRef}
        accept="image/*"
        multiple={false}
      />
      <div
        onClick={chooseImage}
        className="text-2xl text-gray-200 cursor-pointer"
      >
        <IoImageOutline />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center p-2 text-xl text-gray-900 bg-rose-400 rounded-lg cursor-pointer hover:bg-rose-400 disabled:opacity-60"
      >
        <RiSendPlaneLine className="text-white" />
      </button>
    </form>
  );
};

export default Input;
