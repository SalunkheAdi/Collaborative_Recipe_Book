import React, { useContext, useState, useEffect } from 'react';
import { Search, ChefHat, Heart, Users, Calendar, X, TrendingUp, Shield, UserPlus, Newspaper, Tv, UtensilsCrossed, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../services/api';

const Sidebar = ({ activeTab, setActiveTab, isOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [dailyThought, setDailyThought] = useState(null);
    const [cuisinesOpen, setCuisinesOpen] = useState(false);

    useEffect(() => {
        const fetchDailyThought = async () => {
            try {
                const res = await api.get('/thoughts/today');
                setDailyThought(res.data);
            } catch (err) {
                console.error('Error fetching daily thought:', err);
            }
        };
        fetchDailyThought();
    }, []);

    const handleAdminClick = () => {
        navigate('/admin/dashboard');
        toggleSidebar();
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleSidebar}
            />

            {/* Sidebar Content */}
            <div className={`fixed md:static inset-y-0 left-0 w-64 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col`}>
                <div className="p-6 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2 text-orange-600 font-bold text-xl">
                        <ChefHat />
                        <span>CookBook</span>
                    </div>
                    <button onClick={toggleSidebar} className="md:hidden text-stone-500 dark:text-stone-400">
                        <X size={24} />
                    </button>
                </div>

                <nav className="mt-6 px-4 space-y-2 flex-1 overflow-y-auto pb-4">
                    {[
                        { id: 'discover', label: 'Discover', icon: <Search size={20} /> },
                        { id: 'trending', label: 'Trending', icon: <TrendingUp size={20} /> },
                        { id: 'food-news', label: 'Food News', icon: <Newspaper size={20} /> },
                        { id: 'tv-shows', label: 'TV Shows', icon: <Tv size={20} /> },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); toggleSidebar(); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                                ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-medium shadow-sm'
                                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}

                    {/* Cuisines Dropdown */}
                    <div>
                        <button
                            onClick={() => setCuisinesOpen(!cuisinesOpen)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'cuisines'
                                ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-medium shadow-sm'
                                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <UtensilsCrossed size={20} />
                                <span>Cuisines</span>
                            </div>
                            {cuisinesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>

                        {cuisinesOpen && (
                            <div className="ml-4 pl-4 border-l border-stone-200 dark:border-stone-800 space-y-1 mt-1">
                                {['Indian', 'Italian', 'Chinese', 'South Indian', 'Mexican', 'Thai'].map((cuisine) => (
                                    <button
                                        key={cuisine}
                                        onClick={() => {
                                            navigate(`/cuisines/${cuisine.toLowerCase()}`);
                                            toggleSidebar();
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-stone-600 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800"
                                    >
                                        {cuisine}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {[
                        { id: 'my-recipes', label: 'My Recipes', icon: <ChefHat size={20} /> },
                        { id: 'favorites', label: 'Favorites', icon: <Heart size={20} /> },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); toggleSidebar(); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                                ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-medium shadow-sm'
                                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}

                    {/* Admin Panel - Only show for admin users */}
                    {user?.email === 'admin@cookbook.com' && (
                        <>
                            <div className="border-t border-stone-200 dark:border-stone-800 my-4"></div>
                            <button
                                onClick={handleAdminClick}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-700 dark:text-purple-300 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 font-medium"
                            >
                                <Shield size={20} />
                                Admin Panel
                            </button>
                        </>
                    )}
                </nav>

                <div className="w-full p-4 border-t border-stone-100 dark:border-stone-800 flex-shrink-0">
                    <div className="bg-stone-50 dark:bg-stone-800 rounded-xl p-4 transition-colors">
                        <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase mb-2">Daily Inspiration</p>
                        {dailyThought ? (
                            <>
                                <p className="text-sm text-stone-700 dark:text-stone-300 italic">"{dailyThought.text}"</p>
                                {dailyThought.author && dailyThought.author !== 'Anonymous' && (
                                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">- {dailyThought.author}</p>
                                )}
                            </>
                        ) : (
                            <p className="text-sm text-stone-700 dark:text-stone-300 italic">"Cooking is like love. It should be entered into with abandon or not at all."</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
