import { GoogleGenAI, Type } from "@google/genai";
import { AISearchResult, ListingType } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Parses a natural language user query into structured search filters.
 */
export const parseSmartSearch = async (userQuery: string): Promise<AISearchResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract search filters from this student housing query: "${userQuery}".
      If the user implies looking for a roommate (e.g., "looking for a room in a shared house", "find listing with people"), set listingType to ROOMMATE_WANTED.
      If the user implies a vacant empty place (e.g. "studio", "apartment for rent"), set listingType to VACANT_ROOM.
      If the user asks for new buildings or projects, set listingType to COMING_SOON.
      If unspecified, leave listingType null.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key terms to match against title/description (e.g. 'quiet', 'modern', 'engineering')",
            },
            maxPrice: {
              type: Type.NUMBER,
              description: "The maximum budget mentioned, or null if none.",
            },
            listingType: {
              type: Type.STRING,
              enum: [ListingType.VACANT_ROOM, ListingType.ROOMMATE_WANTED, ListingType.COMING_SOON],
              description: "The type of listing inferred.",
            },
            location: {
              type: Type.STRING,
              description: "Specific location or proximity mentioned.",
            },
          },
          required: ["keywords"],
        },
      },
    });

    if (response.text) {
        return JSON.parse(response.text) as AISearchResult;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Smart Search Error:", error);
    // Fallback
    return { keywords: [userQuery] };
  }
};

/**
 * Checks compatibility between a user bio and a listing description/owner bio.
 */
export const checkCompatibility = async (userBio: string, listingBio: string): Promise<{ score: number; reason: string }> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Analyze compatibility between a student looking for a room and a current listing owner.
            User Bio: "${userBio}"
            Listing/Owner Bio: "${listingBio}"
            
            Rate from 0 to 100 and give a short 1-sentence reason.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        reason: { type: Type.STRING }
                    }
                }
            }
        });
        
        if (response.text) {
            return JSON.parse(response.text);
        }
        return { score: 50, reason: "Could not analyze compatibility." };
    } catch (e) {
        console.error(e);
        return { score: 0, reason: "Error processing request." };
    }
}
