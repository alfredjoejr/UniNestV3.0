import { Listing, ListingType } from './types';

export const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Sunny Studio near Engineering Faculty',
    description: 'A bright, fully furnished studio apartment perfect for a solo student. Quiet environment, ideal for studying.',
    location: 'North Avenue, 5 mins walk to campus',
    price: 650,
    type: ListingType.VACANT_ROOM,
    images: ['https://picsum.photos/800/600?random=1', 'https://picsum.photos/800/600?random=2'],
    amenities: ['WiFi', 'AC', 'Private Bath', 'Kitchenette'],
    universityProximity: '0.2 miles',
    availableFrom: '2024-06-01',
    ownerName: 'Sarah Jenkins',
    maxOccupants: 1
  },
  {
    id: '2',
    title: 'Looking for a chill roommate!',
    description: 'I have a 2-bedroom apartment and my roommate is graduating. Looking for someone clean and friendly. I love gaming and cooking.',
    location: 'Westside Apartments',
    price: 450,
    type: ListingType.ROOMMATE_WANTED,
    images: ['https://picsum.photos/800/600?random=3', 'https://picsum.photos/800/600?random=4'],
    amenities: ['Shared Living Room', 'Laundry in unit', 'Balcony', 'High-speed Internet'],
    universityProximity: '1.5 miles (Shuttle available)',
    availableFrom: 'Immediate',
    ownerName: 'Mike Chen',
    ownerBio: 'Computer Science junior. Night owl, gamer, but keeps common areas clean.',
    currentOccupants: 1,
    maxOccupants: 2
  },
  {
    id: '3',
    title: 'The Hub - Luxury Student Living',
    description: 'State-of-the-art student housing complex currently under construction. Featuring a gym, study lounges, and rooftop pool.',
    location: 'Downtown Campus District',
    price: 900,
    type: ListingType.COMING_SOON,
    images: ['https://picsum.photos/800/600?random=5', 'https://picsum.photos/800/600?random=6'],
    amenities: ['Gym', 'Pool', 'Study Lounge', '24/7 Security'],
    universityProximity: 'On Campus',
    availableFrom: '2025-01-01',
    ownerName: 'Urban Developers Ltd.',
    projectCompletionDate: 'December 2024'
  },
  {
    id: '4',
    title: 'Cozy Room in Shared House',
    description: 'One bedroom available in a 4-bedroom house. We are a mix of Arts and Science students. Weekly potlucks!',
    location: 'Maple Street',
    price: 350,
    type: ListingType.ROOMMATE_WANTED,
    images: ['https://picsum.photos/800/600?random=7'],
    amenities: ['Shared Kitchen', 'Backyard', 'Bike Storage'],
    universityProximity: '0.8 miles',
    availableFrom: '2024-07-01',
    ownerName: 'The Maple Crew',
    ownerBio: 'We are social, eco-friendly, and love movie nights.',
    currentOccupants: 3,
    maxOccupants: 4
  },
  {
    id: '5',
    title: 'Modern Loft - 2 Bed 2 Bath',
    description: 'Spacious loft with high ceilings. Looking to fill the master bedroom.',
    location: 'Arts District',
    price: 800,
    type: ListingType.VACANT_ROOM,
    images: ['https://picsum.photos/800/600?random=8', 'https://picsum.photos/800/600?random=9'],
    amenities: ['In-unit Laundry', 'Gym Access', 'Parking'],
    universityProximity: '2 miles',
    availableFrom: '2024-08-15',
    ownerName: 'Alex Rivera',
    maxOccupants: 2
  },
  {
    id: '6',
    title: 'Campus View Residences II',
    description: 'Phase 2 of the popular Campus View project. Pre-leasing now for the Spring semester.',
    location: 'East Gate',
    price: 750,
    type: ListingType.COMING_SOON,
    images: ['https://picsum.photos/800/600?random=10'],
    amenities: ['Cafeteria', 'Library', 'Gaming Room'],
    universityProximity: '0.1 miles',
    availableFrom: '2025-03-01',
    ownerName: 'Campus Living Corp',
    projectCompletionDate: 'February 2025'
  }
];

export const AMENITIES_LIST = [
  'WiFi', 'AC', 'Private Bath', 'Kitchenette', 'Laundry', 'Parking', 'Gym', 'Pool'
];
