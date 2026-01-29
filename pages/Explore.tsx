import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import { MOCK_LISTINGS, AMENITIES_LIST } from '../constants';
import { ListingType, AISearchResult } from '../types';
import { Filter, X } from 'lucide-react';

const Explore: React.FC = () => {
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const aiState = (location.state as any)?.aiFilter as AISearchResult | undefined;

  const [filterType, setFilterType] = useState<ListingType | 'ALL'>('ALL');
  const [priceMax, setPriceMax] = useState<number>(1500);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [filteredListings, setFilteredListings] = useState(MOCK_LISTINGS);
  const [showFilters, setShowFilters] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  useEffect(() => {
    if (aiState) {
        if (aiState.maxPrice) setPriceMax(aiState.maxPrice);
        if (aiState.listingType) setFilterType(aiState.listingType);
        // We could use keywords to filter text, simplified here
        setAiMessage(`AI applied filters based on: "${aiState.keywords.join(', ')}"`);
    }
  }, [aiState]);

  useEffect(() => {
    let result = MOCK_LISTINGS;

    // Filter by Type
    if (filterType !== 'ALL') {
      result = result.filter(l => l.type === filterType);
    } else {
        // By default explore shows rent & roommates, 'coming soon' is usually separate but included if ALL
        result = result.filter(l => l.type !== ListingType.COMING_SOON);
    }

    // Filter by Price
    result = result.filter(l => l.price <= priceMax);

    // Filter by Amenities
    if (selectedAmenities.length > 0) {
      result = result.filter(l => 
        selectedAmenities.every(a => l.amenities.includes(a))
      );
    }
    
    // Filter by AI keywords (Simple matching)
    if (aiState?.keywords && aiState.keywords.length > 0) {
         result = result.filter(l => {
             const text = (l.title + l.description + l.location).toLowerCase();
             return aiState.keywords.some(k => text.includes(k.toLowerCase()));
         });
    }

    setFilteredListings(result);
  }, [filterType, priceMax, selectedAmenities, aiState]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Explore Housing</h1>
          <p className="text-gray-500">Find the perfect spot near campus</p>
        </div>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="mt-4 md:mt-0 flex items-center bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 md:hidden"
        >
          <Filter className="w-4 h-4 mr-2" /> Filters
        </button>
      </div>

      {aiMessage && (
          <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
              <span className="text-sm">{aiMessage}</span>
              <button onClick={() => { setAiMessage(null); /* Reset AI state logic would go here in real app */ }}><X className="w-4 h-4"/></button>
          </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
            
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-700 uppercase mb-2">Type</label>
              <div className="space-y-2">
                {['ALL', ListingType.VACANT_ROOM, ListingType.ROOMMATE_WANTED].map((t) => (
                  <label key={t} className="flex items-center">
                    <input 
                      type="radio" 
                      name="type" 
                      checked={filterType === t}
                      onChange={() => setFilterType(t as ListingType | 'ALL')}
                      className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-600 capitalize">
                      {t === 'ALL' ? 'All Listings' : t === ListingType.VACANT_ROOM ? 'Vacant Room' : 'Roommates'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-700 uppercase mb-2">
                Max Price: ${priceMax}
              </label>
              <input 
                type="range" 
                min="300" 
                max="2000" 
                step="50"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$300</span>
                <span>$2000+</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase mb-2">Amenities</label>
              <div className="space-y-2">
                {AMENITIES_LIST.slice(0, 6).map(amenity => (
                  <label key={amenity} className="flex items-center">
                    <input 
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-600">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="flex-1">
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">No listings found matching your criteria.</p>
              <button 
                onClick={() => {setFilterType('ALL'); setPriceMax(2000); setSelectedAmenities([])}}
                className="mt-4 text-indigo-600 font-medium hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
