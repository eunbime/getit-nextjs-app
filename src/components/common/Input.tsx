import { useState } from "react";
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

interface InputProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  isTextArea?: boolean;
}

const Input = <T extends FieldValues>({
  id,
  label,
  type,
  disabled,
  formatPrice,
  register,
  required,
  errors,
  isTextArea,
}: InputProps<T>) => {
  const [showWarning, setShowWarning] = useState(false);
  const MAX_VALUE = 1000000000;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formatPrice) {
      // 콤마 제거 후 숫자만 추출
      let value = e.target.value.replace(/,/g, "");
      value = value.replace(/[^\d]/g, "");

      // 최대값 제한
      const numValue = Number(value);
      if (numValue > MAX_VALUE) {
        setShowWarning(true);
        value = String(MAX_VALUE);
      } else {
        setShowWarning(false);
      }

      // register에 콤마가 포함된 값 전달
      const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      e.target.value = formattedValue;
    }
  };

  return (
    <div className="relative w-full">
      {formatPrice && (
        <span className="absolute text-neutral-500 top-2 left-3">₩</span>
      )}
      {isTextArea ? (
        <textarea
          id={id}
          disabled={disabled}
          {...register(id, { required })}
          placeholder=" "
          rows={4}
          maxLength={500}
          className={`
            w-full
            p-4
            pt-6
            font-light
            bg-white
            border-2
            rounded-md
            outline-none
            transition
            disabled:opacity-70
            disabled:cursor-not-allowed
            ${errors[id] ? "border-rose-500" : "border-neutral-300"}
            ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}
          `}
        />
      ) : (
        <input
          id={id}
          disabled={disabled}
          {...register(id, {
            required,
            setValueAs: (value: string) => {
              if (formatPrice && value) {
                return Number(String(value).replace(/,/g, ""));
              }
              return value;
            },
            onChange: handleInputChange,
          })}
          placeholder=" "
          type={formatPrice ? "text" : type}
          className={`w-full p-3 pt-7 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
              ${formatPrice ? "pl-9" : "pl-4"}
              ${
                errors[id as string as keyof T]
                  ? "border-rose-500"
                  : "border-neutral-300"
              }
              ${
                errors[id as string as keyof T]
                  ? "focus:border-rose-500"
                  : "focus:border-black"
              }`}
          aria-label={label}
          aria-invalid={errors[id] ? "true" : "false"}
        />
      )}

      <label
        htmlFor={id}
        className={`
      absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0]
      ${formatPrice ? "left-9" : "left-4"}
      peer-placeholder-shown:scale-100
      peer-placeholder-shown:translate-y-0
      peer-focus:scale-75
      peer-focus:-translate-y-4
      ${errors[id as string as keyof T] ? "text-rose-500" : "text-zinc-400"}
      `}
      >
        {label}
      </label>
      {showWarning && (
        <p className="text-red-500 text-xs mt-1">
          최대 10억원까지 입력 가능합니다.
        </p>
      )}
    </div>
  );
};

export default Input;
