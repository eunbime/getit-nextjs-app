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
      role="tab"
      aria-selected={selected}
      className={`flex flex-col items-center justify-center gap-2 py-2 px-4 transition-all duration-300 cursor-pointer rounded-md mb-2
        ${
          selected
            ? "bg-[#0d0c8f] text-white"
            : " text-neutral-500 bg-gray-100 hover:text-neutral-800"
        }
        `}
    >
      <div className="text-sm md:text-base font-medium">{label}</div>
    </Link>
  );
};

export default CategoryBox;
