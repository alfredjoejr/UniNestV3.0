import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_LISTINGS } from '../constants';
import ListingCard from '../components/ListingCard';
import { LayoutDashboard, Heart, MessageSquare, Settings, Bell, Home, Plus, LogOut, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'messages' | 'my-listings'>('overview');

  // Mock data
  const savedListings = MOCK_LISTINGS.slice(0, 2);
  const myListings = MOCK_LISTINGS.slice(3, 4); 
  const messages = [
    { id: 1, sender: 'Mike Chen', preview: 'Hey! Is the room still available?', time: '2 hrs ago', unread: true },
    { id: 2, sender: 'Sarah Jenkins', preview: 'Thanks for the interest. When can you visit?', time: '1 day ago', unread: false },
  ];

  if (!user) {
    return <div className="p-10 text-center">Please log in to view dashboard.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 md:min-h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <img src={user.avatar} alt="Profile" className="w-12 h-12 rounded-full border border-gray-200" />
            <div>
                <h3 className="font-bold text-gray-900">{user.name}</h3>
                <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <LayoutDashboard className="w-5 h-5 mr-3" /> Overview
            </button>
            <button 
                onClick={() => setActiveTab('saved')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'saved' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <Heart className="w-5 h-5 mr-3" /> Saved Homes
            </button>
            <button 
                onClick={() => setActiveTab('my-listings')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'my-listings' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <Home className="w-5 h-5 mr-3" /> My Listings
            </button>
            <button 
                onClick={() => setActiveTab('messages')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'messages' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <MessageSquare className="w-5 h-5 mr-3" /> Messages
                {messages.some(m => m.unread) && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>}
            </button>
            <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50">
                <Settings className="w-5 h-5 mr-3" /> Settings
            </button>
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-100">
             <button onClick={logout} className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50">
                <LogOut className="w-5 h-5 mr-3" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab.replace('-', ' ')}</h1>
                <p className="text-gray-500">Manage your housing journey</p>
            </div>
            <div className="flex gap-4">
                <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </div>
        </header>

        {activeTab === 'overview' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-700">Saved Listings</h3>
                            <Heart className="w-5 h-5 text-pink-500" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{savedListings.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-700">Unread Messages</h3>
                            <MessageSquare className="w-5 h-5 text-indigo-500" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{messages.filter(m => m.unread).length}</p>
                    </div>
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl shadow-md text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-indigo-100">Profile Status</h3>
                            <div className="bg-white/20 px-2 py-1 rounded text-xs">Active</div>
                        </div>
                        <p className="text-sm text-indigo-100 mb-4">You are currently visible to potential roommates.</p>
                        <button className="bg-white text-indigo-600 text-xs font-bold px-3 py-2 rounded-lg hover:bg-gray-100">Edit Profile</button>
                    </div>
                </div>

                <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4">Recent Activity</h2>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    {messages.map(msg => (
                        <div key={msg.id} className="p-4 border-b border-gray-50 flex items-center hover:bg-gray-50 transition cursor-pointer">
                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold mr-4">
                                {msg.sender.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <h4 className={`text-sm ${msg.unread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{msg.sender}</h4>
                                <p className="text-sm text-gray-500 truncate">{msg.preview}</p>
                            </div>
                            <span className="text-xs text-gray-400">{msg.time}</span>
                        </div>
                    ))}
                    <div className="p-4 border-b border-gray-50 flex items-center hover:bg-gray-50 transition cursor-pointer">
                         <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mr-4">
                            <Heart className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-700">You saved "Sunny Studio near Engineering"</h4>
                            <p className="text-sm text-gray-500">Price dropped by $50!</p>
                        </div>
                        <span className="text-xs text-gray-400">1 day ago</span>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'saved' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedListings.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />
                ))}
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer" onClick={() => setActiveTab('overview')}>
                    <Search className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-gray-500 font-medium">Browse more homes</p>
                    <Link to="/explore" className="text-indigo-600 text-sm font-bold mt-2 hover:underline">Go to Explore</Link>
                </div>
            </div>
        )}

        {activeTab === 'my-listings' && (
            <div>
                 <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">Manage the properties or rooms you have listed.</p>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex items-center hover:bg-indigo-700">
                        <Plus className="w-4 h-4 mr-2" /> Add New Listing
                    </button>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myListings.map(listing => (
                        <div key={listing.id} className="relative group">
                             <ListingCard listing={listing} />
                             <div className="absolute top-2 right-2 flex gap-2">
                                <button className="bg-white/90 p-2 rounded-full shadow-sm hover:text-indigo-600"><Settings className="w-4 h-4"/></button>
                             </div>
                             <div className="mt-2 bg-indigo-50 text-indigo-800 text-xs font-bold px-3 py-2 rounded-lg text-center border border-indigo-100">
                                Status: Active • 12 Views today
                             </div>
                        </div>
                    ))}
                    {myListings.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-100">
                             <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                             <h3 className="text-lg font-medium text-gray-900">No listings yet</h3>
                             <p className="text-gray-500 mb-4">Got a spare room? Or looking for a roommate to fill a spot?</p>
                             <button className="text-indigo-600 font-bold hover:underline">Create your first listing</button>
                        </div>
                    )}
                 </div>
            </div>
        )}

        {activeTab === 'messages' && (
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[500px] flex">
                 <div className="w-1/3 border-r border-gray-200">
                     <div className="p-4 border-b border-gray-200">
                         <input type="text" placeholder="Search messages..." className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-indigo-500 text-gray-900" />
                     </div>
                     <div className="overflow-y-auto h-full">
                         {messages.map(msg => (
                             <div key={msg.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${msg.unread ? 'bg-indigo-50/50' : ''}`}>
                                 <div className="flex justify-between items-start mb-1">
                                     <span className={`font-medium ${msg.unread ? 'text-gray-900' : 'text-gray-700'}`}>{msg.sender}</span>
                                     <span className="text-xs text-gray-400">{msg.time}</span>
                                 </div>
                                 <p className="text-sm text-gray-500 truncate">{msg.preview}</p>
                             </div>
                         ))}
                     </div>
                 </div>
                 <div className="w-2/3 flex flex-col items-center justify-center text-gray-400">
                     <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                     <p>Select a conversation to start chatting</p>
                 </div>
             </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;