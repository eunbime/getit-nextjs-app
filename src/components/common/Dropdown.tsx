"use client";

import { useEffect, useRef, useState } from "react";
import { IoChevronDownCircleOutline } from "react-icons/io5";

interface DropdownProps {
  options?: string[];
  selectedOption?: string;
  onSelect?: (option: string) => void;
}

const Dropdown = ({ options, selectedOption, onSelect }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(selectedOption);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedItem(selectedOption);
  }, [selectedOption]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    setIsOpen(false);
    onSelect?.(item);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <div>{selectedItem}</div>
        <div onClick={() => setIsOpen(!isOpen)}>
          <IoChevronDownCircleOutline className="w-4 h-4" />
        </div>
      </div>
      <div
        className={`absolute top-10 left-0 w-full h-fit bg-white text-black  rounded-md shadow-md ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {options?.map((option: string) => (
          <p
            key={option}
            onClick={() => handleItemClick(option)}
            className="p-2 hover:bg-gray-100 w-full"
          >
            {option}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
