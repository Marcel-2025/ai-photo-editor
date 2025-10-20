
import React, { useRef } from 'react';
import { UploadIcon } from './IconComponents';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className="w-full max-w-lg p-8 border-2 border-dashed border-[var(--border-secondary)] rounded-xl text-center cursor-pointer hover:border-[var(--accent-primary)] hover:bg-[var(--background-secondary)] transition-colors duration-300"
      onClick={handleClick}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <div className="flex flex-col items-center">
        <UploadIcon className="w-16 h-16 text-[var(--text-secondary)] mb-4" />
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">Click to upload a photo</h3>
        <p className="text-[var(--text-secondary)] mt-1">PNG, JPG, or WEBP</p>
      </div>
    </div>
  );
};