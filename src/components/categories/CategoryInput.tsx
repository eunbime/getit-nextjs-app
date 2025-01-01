interface CategoryInputProps {
  label: string;
  selected?: boolean;
  path: string;
  onClick: (value: string) => void;
}

const CategoryInput = ({
  label,
  selected,
  path,
  onClick,
}: CategoryInputProps) => {
  return (
    <div
      onClick={() => onClick(path)}
      className={`
        rounded-xl border-2 p-4 flex flex-col gap-3
        hover:border-zinc-600 transition cursor-pointer
        ${selected ? "border-[#0978f6]" : "border-neutral-200"}`}
    >
      <div className="font-semibold">{label}</div>
    </div>
  );
};

export default CategoryInput;
