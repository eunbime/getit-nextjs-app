interface PreviewImageProps {
  e: React.ChangeEvent<HTMLInputElement>;
  setImagePreview: (value: string | null) => void;
  setValue: (name: string, value: File) => void;
}

const previewImage = ({ e, setImagePreview, setValue }: PreviewImageProps) => {
  const file = e.target?.files?.[0];
  if (!file) return;

  setValue("image", file);

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    setImagePreview(reader.result as string);
  };
};

export default previewImage;
