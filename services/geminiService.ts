import { GoogleGenAI, Modality } from "@google/genai";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove "data:mime/type;base64," prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const editImageWithGemini = async (imageFile: File, prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const base64Image = await fileToBase64(imageFile);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: imageFile.type,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  // A successful response should have candidates with content.
  if (!response.candidates || response.candidates.length === 0) {
      const blockReason = response.promptFeedback?.blockReason;
      const blockMessage = response.promptFeedback?.blockReasonMessage;
      let errorMessage = "AI response was blocked, which may be due to safety policies. Please adjust your prompt and try again.";
      if (blockReason) {
          errorMessage = `Request was blocked for reason: ${blockReason}.`;
          if (blockMessage) {
              errorMessage += ` Details: ${blockMessage}`;
          }
      }
      throw new Error(errorMessage);
  }
  
  // Find the part containing image data
  const imagePart = response.candidates[0].content?.parts?.find(
      (part) => !!part.inlineData
  );

  if (imagePart && imagePart.inlineData) {
    return imagePart.inlineData.data;
  } 
  
  // If no image part, check for a text response, which might explain the refusal.
  const textResponse = response.text;
  if (textResponse && textResponse.trim()) {
      throw new Error(`AI did not return an image, but provided a text response: "${textResponse.trim()}"`);
  }

  // Fallback error if the response is malformed or empty in an unexpected way.
  throw new Error("AI did not return an image. The response may have been empty or refused due to safety policies. Please try a different prompt.");
};