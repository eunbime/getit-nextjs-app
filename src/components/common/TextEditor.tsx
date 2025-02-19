"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const QuillWrapper = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] flex justify-center items-center bg-gray-100" />
  ),
});

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TextEditor = ({ value, onChange }: TextEditorProps) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
  };

  return (
    <div className="w-full h-full">
      <QuillWrapper
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className="w-full h-full min-h-[300px]"
      />
    </div>
  );
};

export default TextEditor;
