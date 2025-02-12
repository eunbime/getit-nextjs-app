"use client";

import { useEffect, useState } from "react";
import Dropdown from "../common/Dropdown";

interface SortSelectProps {
  setSelectOrder: (order: string) => void;
  setSelectedSort: (sort: string) => void;
}

const SortSelect = ({ setSelectOrder, setSelectedSort }: SortSelectProps) => {
  const [options, setOptions] = useState<string>("최신순");

  useEffect(() => {
    if (options === "최신순") {
      setSelectOrder("desc");
      setSelectedSort("createdAt");
    } else if (options === "조회순") {
      setSelectOrder("desc");
      setSelectedSort("viewCount");
    } else if (options === "추천순") {
      setSelectOrder("desc");
      setSelectedSort("recommendCount");
    }
  }, [options]);

  return (
    <Dropdown
      options={["최신순", "조회순", "추천순"]}
      selectedOption={options}
      onSelect={setOptions}
    />
  );
};

export default SortSelect;
