import { GoogleGenAI, Modality } from "@google/genai";

export async function generateImages(prompt: string, numberOfImages: number): Promise<string[]> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: Math.max(1, Math.min(4, numberOfImages)), // Clamp between 1 and 4
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages.map(img => img.image.imageBytes);
    } else {
      throw new Error("No images were generated.");
    }
  } catch (error) {
    console.error("Error generating images:", error);
    throw new Error("Failed to generate images. Please try again.");
  }
}

export async function editImage(prompt: string, imageBase64: string, mimeType: string): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType,
      },
    };
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
    
    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            return part.inlineData.data;
          }
        }
    }

    throw new Error("No edited image was generated.");

  } catch (error) {
    console.error("Error editing image:", error);
    if (error instanceof Error && error.message.includes('400')) {
        throw new Error("Editing failed. The prompt or image may be inappropriate.");
    }
    throw new Error("Failed to edit the image. Please try again.");
  }
}