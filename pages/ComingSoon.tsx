import React from 'react';
import ListingCard from '../components/ListingCard';
import { MOCK_LISTINGS } from '../constants';
import { ListingType } from '../types';
import { Hammer } from 'lucide-react';

const ComingSoon: React.FC = () => {
  const futureListings = MOCK_LISTINGS.filter(l => l.type === ListingType.COMING_SOON);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-yellow-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-full mb-4 shadow-sm">
             <Hammer className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Coming Soon Projects</h1>
          <p className="text-lg text-gray-800 font-medium max-w-2xl mx-auto">
            Get early access to student housing currently under construction. Be the first to live in these brand new spaces.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {futureListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
            ))}
        </div>
        
        {futureListings.length === 0 && (
            <div className="text-center py-12">
                <p className="text-gray-500">No upcoming projects listed right now. Check back later!</p>
            </div>
        )}

        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Are you a developer?</h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                List your upcoming student housing project on UniNest to secure tenants before construction is even finished.
            </p>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
                List Your Project
            </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
