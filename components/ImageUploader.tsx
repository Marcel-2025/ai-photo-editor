import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UploadIcon } from './IconComponents';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      } else {
        alert(t('imageUploader.alert'));
      }
    }
  };

  return (
    <div
      className={`w-full max-w-lg p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-300 ${
        isDragging
          ? 'border-[var(--accent-primary)] bg-[var(--background-secondary)] ring-4 ring-[var(--accent-primary)]/20 scale-105'
          : 'border-[var(--border-secondary)] hover:border-[var(--accent-primary)] hover:bg-[var(--background-secondary)]'
      }`}
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <div className="flex flex-col items-center pointer-events-none">
        <UploadIcon className="w-16 h-16 text-[var(--text-secondary)] mb-4" />
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">
          {isDragging ? t('imageUploader.drop') : t('imageUploader.click')}
        </h3>
        <p className="text-[var(--text-secondary)] mt-1">{t('imageUploader.formats')}</p>
      </div>
    </div>
  );
};
