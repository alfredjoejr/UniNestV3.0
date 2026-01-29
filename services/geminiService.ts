
import { AISearchResult, ListingType } from "../types";

/**k
 * SIMULATED AI SERVICE
 * 
 * Since the Gemini API Key requirement has been removed, this service 
 * now uses local logic to simulate the AI features.
 */

/**
 * Parses a natural language user query into structured search filters using basic string matching.
 */
export const parseSmartSearch = async (userQuery: string): Promise<AISearchResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const lowerQuery = userQuery.toLowerCase();
  const keywords = userQuery.split(' ').filter(word => word.length > 3);
  
  let listingType: ListingType | undefined = undefined;
  let maxPrice: number | undefined = undefined;

  // 1. Detect Listing Type
  if (lowerQuery.includes('roommate') || lowerQuery.includes('share') || lowerQuery.includes('people')) {
    listingType = ListingType.ROOMMATE_WANTED;
  } else if (lowerQuery.includes('apartment') || lowerQuery.includes('studio') || lowerQuery.includes('private') || lowerQuery.includes('vacant')) {
    listingType = ListingType.VACANT_ROOM;
  } else if (lowerQuery.includes('new') || lowerQuery.includes('project') || lowerQuery.includes('building')) {
    listingType = ListingType.COMING_SOON;
  }

  // 2. Detect Price (looks for numbers like "500" or "$500")
  const priceMatch = lowerQuery.match(/\$?(\d{3,4})/);
  if (priceMatch) {
    maxPrice = parseInt(priceMatch[1]);
  }

  // 3. Detect Location (Mock logic)
  let location: string | undefined = undefined;
  if (lowerQuery.includes('campus') || lowerQuery.includes('north') || lowerQuery.includes('downtown')) {
    location = "Near Campus";
  }

  return {
    keywords,
    maxPrice,
    listingType,
    location
  };
};

/**
 * Checks compatibility between a user bio and a listing description/owner bio using a randomizer.
 */
export const checkCompatibility = async (userBio: string, listingBio: string): Promise<{ score: number; reason: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate a random score between 65 and 98 to make it feel positive
    const score = Math.floor(Math.random() * (98 - 65 + 1)) + 65;
    
    const positiveReasons = [
        "Your study schedules seem to align perfectly based on the description.",
        "Both of you value a quiet environment, which is a great match.",
        "You share similar interests in social activities.",
        "Your cleanliness standards appear to match the owner's expectations.",
        "Great vibe match! You both seem to be night owls."
    ];

    const reason = positiveReasons[Math.floor(Math.random() * positiveReasons.length)];

    return { score, reason };
}
