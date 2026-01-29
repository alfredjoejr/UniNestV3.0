
export enum ListingType {
  VACANT_ROOM = 'VACANT_ROOM',
  ROOMMATE_WANTED = 'ROOMMATE_WANTED',
  COMING_SOON = 'COMING_SOON',
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number; // Monthly rent
  type: ListingType;
  images: string[];
  amenities: string[];
  universityProximity: string; // e.g., "0.5 miles from Main Campus"
  availableFrom: string;
  ownerName: string;
  ownerBio?: string; // For roommate matching
  currentOccupants?: number;
  maxOccupants?: number;
  projectCompletionDate?: string; // For Coming Soon
}

export interface SearchFilters {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: ListingType;
  amenities?: string[];
}

// AI Service Types
export interface AISearchResult {
  keywords: string[];
  maxPrice?: number;
  listingType?: ListingType;
  location?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'STUDENT' | 'LANDLORD';
}
