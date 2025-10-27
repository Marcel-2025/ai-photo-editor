import { GoogleGenAI, Modality, Type } from "@google/genai";

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
  // Fix: Use process.env.API_KEY as per Gemini API guidelines. This resolves the TypeScript error with import.meta.env.
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

export const generatePromptSuggestionsForVideo = async (imageFile: File): Promise<{ [key: string]: string[] }> => {
  // Fix: Use process.env.API_KEY as per Gemini API guidelines.
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const base64Image = await fileToBase64(imageFile);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: imageFile.type,
          },
        },
        {
          text: "Analyze this image and suggest creative prompts for generating a short video that starts with this image. Group them into 4 distinct categories: 'Cinematic Actions', 'Scenery Transformations', 'Mood & Atmosphere', and 'Fantastical Elements'. Provide 4 prompts for each category. The prompts should describe an action, a change in scenery, or a mood transformation.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          "Cinematic Actions": {
            type: Type.ARRAY,
            description: "Prompts focusing on dynamic, movie-like actions.",
            items: { type: Type.STRING },
          },
          "Scenery Transformations": {
            type: Type.ARRAY,
            description: "Prompts that describe a change in the background or environment.",
            items: { type: Type.STRING },
          },
          "Mood & Atmosphere": {
            type: Type.ARRAY,
            description: "Prompts related to changing the feeling or lighting of the scene.",
            items: { type: Type.STRING },
          },
          "Fantastical Elements": {
            type: Type.ARRAY,
            description: "Prompts that add magical, sci-fi, or surreal elements.",
            items: { type: Type.STRING },
          },
        },
        required: ['Cinematic Actions', 'Scenery Transformations', 'Mood & Atmosphere', 'Fantastical Elements'],
      },
    },
  });

  try {
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result;
  } catch (e) {
    console.error("Failed to parse JSON for prompt suggestions:", e);
    throw new Error("AI returned an invalid format for prompt suggestions.");
  }
};


export const generateVideoWithGemini = async (
  imageFile: File, 
  prompt: string,
  aspectRatio: '16:9' | '9:16',
  resolution: '720p' | '1080p'
): Promise<string> => {
  // Fix: Use process.env.API_KEY as per Gemini API guidelines.
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const base64Image = await fileToBase64(imageFile);

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: {
      imageBytes: base64Image,
      mimeType: imageFile.type,
    },
    config: {
      numberOfVideos: 1,
      resolution: resolution,
      aspectRatio: aspectRatio,
    }
  });

  // Poll for the result
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
    try {
        operation = await ai.operations.getVideosOperation({operation: operation});
    } catch (e) {
        // If the operation is not found, it might have expired or there was an issue.
        if (e instanceof Error && e.message.includes('not found')) {
            throw new Error('Video generation operation timed out or could not be found. Please try again.');
        }
        throw e; // Re-throw other errors
    }
  }

  if (operation.error) {
    throw new Error(`Video generation failed: ${operation.error.message}`);
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

  if (!downloadLink) {
    throw new Error("Video generation completed, but no download link was found.");
  }

  return downloadLink;
};

export const fetchVideoFromUri = async (uri: string): Promise<Blob> => {
    // Fix: Use process.env.API_KEY as per Gemini API guidelines.
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    const response = await fetch(`${uri}&key=${process.env.API_KEY}`);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch video: ${response.statusText}. Details: ${errorText}`);
    }
    return response.blob();
};
