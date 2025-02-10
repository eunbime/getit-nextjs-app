"use client";

import { useState } from "react";
import Dropdown from "../common/Dropdown";

const SortSelect = () => {
  const [selectedSort, setSelectedSort] = useState<string>("최신순");

  return (
    <Dropdown
      options={["최신순", "조회순", "좋아요순"]}
      selectedOption={selectedSort}
      onSelect={setSelectedSort}
    />
  );
};

export default SortSelect;
