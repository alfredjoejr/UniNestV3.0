import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_LISTINGS } from '../constants';
import { ListingType } from '../types';
import { MapPin, Wifi, Check, Sparkles, User, Calendar, DollarSign, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { checkCompatibility } from '../services/geminiService';

const ListingDetail: React.FC = () => {
  const { id } = useParams();
  const listing = MOCK_LISTINGS.find(l => l.id === id);
  const [userBio, setUserBio] = useState('');
  const [matchResult, setMatchResult] = useState<{ score: number, reason: string } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  if (!listing) {
    return <div className="p-8 text-center">Listing not found</div>;
  }

  const handleMatch = async () => {
    if (!userBio.trim()) return;
    setAnalyzing(true);
    try {
        const result = await checkCompatibility(userBio, listing.ownerBio || listing.description);
        setMatchResult(result);
    } finally {
        setAnalyzing(false);
    }
  };

  const isRoommate = listing.type === ListingType.ROOMMATE_WANTED;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Back Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link to="/explore" className="text-gray-500 hover:text-indigo-600 flex items-center text-sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Listings
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery (Simple grid for now) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl overflow-hidden">
                {listing.images.map((img, i) => (
                    <img key={i} src={img} alt={`View ${i+1}`} className={`w-full h-64 object-cover hover:scale-105 transition duration-500 ${i === 0 ? 'sm:col-span-2 sm:h-96' : ''}`} />
                ))}
            </div>

            <div>
                <div className="flex items-start justify-between">
                    <div>
                         <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                         <div className="flex items-center text-gray-500 mb-4">
                            <MapPin className="w-5 h-5 mr-1" /> {listing.location}
                         </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">${listing.price}</div>
                        <div className="text-sm text-gray-500">per month</div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 my-6">
                    {listing.type === ListingType.COMING_SOON && (
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">Coming Soon</span>
                    )}
                     <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <Calendar className="w-3 h-3 mr-2" /> {listing.availableFrom}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <MapPin className="w-3 h-3 mr-2" /> {listing.universityProximity}
                    </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">About the place</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{listing.description}</p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {listing.amenities.map(a => (
                        <div key={a} className="flex items-center text-gray-600">
                            <Check className="w-4 h-4 text-green-500 mr-2" /> {a}
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Roommate Matcher Section - Only if listing owner has bio */}
            {(isRoommate || listing.ownerBio) && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 mt-8">
                    <div className="flex items-center mb-4">
                        <Sparkles className="w-6 h-6 text-indigo-600 mr-2" />
                        <h3 className="text-xl font-bold text-gray-900">AI Compatibility Check</h3>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">
                        Wondering if you'll get along with <strong>{listing.ownerName}</strong>? Describe yourself (habits, major, sleep schedule) and our AI will estimate your vibe match!
                    </p>
                    
                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-1">About {listing.ownerName}:</p>
                        <p className="text-sm text-gray-600 italic bg-white/50 p-3 rounded-lg">"{listing.ownerBio || listing.description}"</p>
                    </div>

                    {!matchResult ? (
                        <div className="space-y-3">
                            <textarea
                                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-gray-900"
                                rows={3}
                                placeholder="I'm a quiet engineering student, usually study late, clean, and love coffee..."
                                value={userBio}
                                onChange={(e) => setUserBio(e.target.value)}
                            />
                            <button 
                                onClick={handleMatch}
                                disabled={analyzing || !userBio}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 transition w-full sm:w-auto"
                            >
                                {analyzing ? 'Analyzing Vibe...' : 'Check Compatibility'}
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100 animate-fade-in">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-700 font-semibold">Match Score</span>
                                <span className={`text-2xl font-bold ${matchResult.score > 70 ? 'text-green-600' : matchResult.score > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                                    {matchResult.score}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                                <div className={`h-2.5 rounded-full ${matchResult.score > 70 ? 'bg-green-600' : matchResult.score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${matchResult.score}%` }}></div>
                            </div>
                            <p className="text-gray-600 text-sm">{matchResult.reason}</p>
                            <button onClick={() => setMatchResult(null)} className="text-xs text-indigo-500 mt-3 underline">Check again</button>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Sidebar / Contact */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Listed by</p>
                        <p className="font-bold text-gray-900">{listing.ownerName}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                        Request to Book
                    </button>
                    <button className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition">
                        Message Owner
                    </button>
                </div>

                <div className="mt-6 text-xs text-gray-400 text-center">
                    Identity verified • typically replies in 1 hr
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;