import Link from "next/link";

interface CategoryBoxProps {
  label: string;
  path: string;
  selected?: boolean;
}

const CategoryBox = ({ label, path, selected }: CategoryBoxProps) => {
  return (
    <Link
      href={`/?category=${path}`}
      className={`flex flex-col items-center justify-center gap-2 p-3 border-b-2
        hover:text-neutral-800 transition cursor-pointer
        ${
          selected
            ? "border-b-neutral-800 text-neutral-800"
            : "border-transparent text-neutral-500"
        }
        `}
    >
      <div className="text-sm md:text-base font-medium">{label}</div>
    </Link>
  );
};

export default CategoryBox;
