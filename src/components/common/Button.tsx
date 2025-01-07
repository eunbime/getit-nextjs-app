import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
  children?: React.ReactNode;
}

const Button = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  icon: Icon,
  children,
}: ButtonProps) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className={`
        relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full
        ${
          outline
            ? "bg-white border-[#0d0c8f] text-[#0d0c8f]"
            : "bg-[#0d0c8f] border-[#0d0c8f] text-white"
        }
        ${
          small
            ? "text-sm py-1 font-light border-[1px]"
            : "text-md py-3 font-semibold border-2"
        }`}
    >
      {Icon && <Icon size={24} className="absolute left-4 top-3" />}
      {label}
      {children}
    </button>
  );
};

export default Button;
