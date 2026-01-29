import React from 'react';
import { useNavigate } from 'react-router-dom';
import AISearchBar from '../components/AISearchBar';
import ListingCard from '../components/ListingCard';
import { MOCK_LISTINGS } from '../constants';
import { ListingType, AISearchResult } from '../types';
import { ArrowRight, Building2, Users2, Hammer } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleAISearch = (result: AISearchResult) => {
    // Pass the AI result state to the explore page
    navigate('/explore', { state: { aiFilter: result } });
  };

  const featuredListings = MOCK_LISTINGS.filter(l => l.type !== ListingType.COMING_SOON).slice(0, 3);
  const comingSoonListing = MOCK_LISTINGS.find(l => l.type === ListingType.COMING_SOON);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-0">
      {/* Hero Section */}
      <div className="bg-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Find Your Perfect <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">Uni Home</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-indigo-100 mb-10">
              The student-first platform. Find a vacant room, match with compatible roommates, or browse upcoming housing projects.
            </p>
            
            <AISearchBar onSearch={handleAISearch} />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div onClick={() => navigate('/explore')} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer group">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                    <Building2 className="w-6 h-6 text-indigo-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Rent a Room</h3>
                <p className="text-gray-500">Browse hundreds of verified listings near your campus.</p>
            </div>
            
            <div onClick={() => navigate('/roommates')} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer group">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                    <Users2 className="w-6 h-6 text-purple-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Find Roommates</h3>
                <p className="text-gray-500">Connect with students who already have a place and need you.</p>
            </div>

            <div onClick={() => navigate('/coming-soon')} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer group">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-500 transition-colors">
                    <Hammer className="w-6 h-6 text-yellow-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h3>
                <p className="text-gray-500">Check out new buildings under construction and pre-lease.</p>
            </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Listings</h2>
                <p className="text-gray-500 mt-2">Top picks near the university this week</p>
            </div>
            <button onClick={() => navigate('/explore')} className="hidden sm:flex items-center text-indigo-600 font-semibold hover:text-indigo-800">
                View All <ArrowRight className="w-4 h-4 ml-2" />
            </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
            ))}
        </div>
      </div>
      
      {/* Project Spotlight */}
      {comingSoonListing && (
          <div className="bg-gray-900 text-white py-16">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                   <div className="flex flex-col md:flex-row items-center gap-12">
                       <div className="md:w-1/2">
                           <span className="text-yellow-400 font-bold tracking-wider uppercase text-sm">Under Construction</span>
                           <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">{comingSoonListing.title}</h2>
                           <p className="text-gray-300 text-lg mb-6">{comingSoonListing.description}</p>
                           <ul className="space-y-2 mb-8">
                               <li className="flex items-center"><Hammer className="w-5 h-5 mr-3 text-yellow-400"/> Completion: {comingSoonListing.projectCompletionDate}</li>
                               <li className="flex items-center"><Building2 className="w-5 h-5 mr-3 text-yellow-400"/> {comingSoonListing.amenities.length} Premium Amenities</li>
                           </ul>
                           <button onClick={() => navigate(`/listing/${comingSoonListing.id}`)} className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition">
                               Explore Project
                           </button>
                       </div>
                       <div className="md:w-1/2 relative">
                           <div className="absolute inset-0 bg-yellow-400 rounded-2xl transform rotate-3 translate-x-2 translate-y-2"></div>
                           <img src={comingSoonListing.images[0]} alt="Project" className="relative rounded-2xl shadow-2xl w-full object-cover h-80" />
                       </div>
                   </div>
               </div>
          </div>
      )}
    </div>
  );
};

export default Home;
