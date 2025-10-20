
import React, { useState, useCallback } from 'react';
import { ImageFile } from './types';
import { editImageWithGemini } from './services/geminiService';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { EditControls } from './components/EditControls';
import { Loader } from './components/Loader';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setImageFile({
      file: file,
      previewUrl: URL.createObjectURL(file),
    });
    setEditedImage(null);
    setError(null);
  };

  const handleEdit = useCallback(async () => {
    if (!imageFile || !prompt.trim()) {
      setError('Please upload an image and enter an editing prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const newImageBase64 = await editImageWithGemini(imageFile.file, prompt);
      setEditedImage(`data:image/jpeg;base64,${newImageBase64}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, prompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {!imageFile && (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <ImageUploader onImageUpload={handleImageUpload} />
          </div>
        )}

        {imageFile && (
          <>
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6 text-center" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <ImageDisplay label="Original" imageUrl={imageFile.previewUrl} />
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800/80 rounded-lg z-10">
                    <Loader />
                  </div>
                )}
                <ImageDisplay label="Edited" imageUrl={editedImage} />
              </div>
            </div>
            <EditControls
              prompt={prompt}
              onPromptChange={(e) => setPrompt(e.target.value)}
              onEdit={handleEdit}
              isLoading={isLoading}
              onClear={() => {
                setImageFile(null);
                setEditedImage(null);
                setPrompt('');
                setError(null);
              }}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default App;
