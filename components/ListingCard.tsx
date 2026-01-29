import React from 'react';
import { Listing, ListingType } from '../types';
import { MapPin, Users, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const isComingSoon = listing.type === ListingType.COMING_SOON;
  const isRoommate = listing.type === ListingType.ROOMMATE_WANTED;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={listing.images[0]} 
          alt={listing.title} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
            {isComingSoon && (
                <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full uppercase tracking-wider">
                    Coming Soon
                </span>
            )}
            {isRoommate && (
                <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                    Roommate Wanted
                </span>
            )}
            {!isComingSoon && !isRoommate && (
                <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                    For Rent
                </span>
            )}
        </div>
        <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-semibold">
          ${listing.price}/mo
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{listing.title}</h3>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">{listing.location}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
          {listing.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
            {listing.amenities.slice(0, 3).map((amenity, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                    {amenity}
                </span>
            ))}
            {listing.amenities.length > 3 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                    +{listing.amenities.length - 3}
                </span>
            )}
        </div>

        <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-500">
                {isComingSoon ? (
                    <>
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Done: {listing.projectCompletionDate}</span>
                    </>
                ) : (
                    <>
                        {isRoommate ? <Users className="w-4 h-4 mr-1" /> : <Calendar className="w-4 h-4 mr-1" />}
                        <span>{isRoommate ? `${listing.currentOccupants}/${listing.maxOccupants} Occupied` : `Avail: ${listing.availableFrom}`}</span>
                    </>
                )}
            </div>
            
            <Link to={`/listing/${listing.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                Details <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
