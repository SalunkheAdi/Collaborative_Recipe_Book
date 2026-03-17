import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, Share2, Settings, Check, X, Plus } from 'lucide-react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';

import AuthContext from '../context/AuthContext';
import api from '../services/api';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dietaryFilter, setDietaryFilter] = useState('all');

    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();


    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getActiveTab = () => {
        const path = location.pathname;
        if (path === '/') return 'discover';
        if (path === '/trending') return 'trending';
        if (path === '/food-news') return 'food-news';
        if (path === '/tv-shows') return 'tv-shows';
        if (path.startsWith('/cuisines')) return 'cuisines';
        if (path === '/my-recipes') return 'my-recipes';
        if (path === '/favorites') return 'favorites';
        if (path === '/add-recipe') return 'add-recipe';
        return '';
    };

    const handleTabChange = (id) => {
        if (id === 'discover') navigate('/');
        else if (id === 'cuisines') return; // Handled by sub-menu
        else navigate(`/${id}`);
    };

    const getTitle = () => {
        const tab = getActiveTab();
        if (tab === 'discover') return 'Discover';
        if (tab === 'trending') return 'Trending Recipes';
        if (tab === 'food-news') return 'Food News';
        if (tab === 'tv-shows') return 'TV Shows';
        if (tab === 'cuisines') return 'Cuisines';
        if (tab === 'my-recipes') return 'My Recipes';
        if (tab === 'favorites') return 'Favorites';
        if (tab === 'add-recipe') return 'Add Recipe';
        return 'CookBook';
    };

    return (
        <div className="flex h-screen bg-stone-100 dark:bg-stone-900 font-sans text-stone-900 dark:text-stone-100 transition-colors duration-300">
            <Sidebar
                activeTab={getActiveTab()}
                setActiveTab={handleTabChange}
                isOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <header className="h-20 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300">
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xl font-bold hidden md:block text-stone-800 dark:text-stone-100">
                            {getTitle()}
                        </h1>
                    </div>

                    <div className="flex-1 max-w-md mx-4 hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search for pasta, healthy snacks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-stone-100 dark:bg-stone-800 border-transparent focus:bg-white dark:focus:bg-stone-700 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 focus:border-orange-300 dark:focus:border-orange-700 transition-all text-sm outline-none text-stone-800 dark:text-stone-100 placeholder-stone-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex bg-stone-100 dark:bg-stone-800 rounded-lg p-1">
                            {['all', 'veg', 'non-veg'].map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setDietaryFilter(filter)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${dietaryFilter === filter ? 'bg-white dark:bg-stone-700 shadow-sm text-stone-800 dark:text-stone-100' : 'text-stone-500 hover:text-stone-700 dark:text-stone-400'}`}
                                >
                                    {filter === 'non-veg' ? 'Non-Veg' : filter}
                                </button>
                            ))}
                        </div>

                        <ThemeToggle />

                        {user ? (
                            <>
                                <div className="hidden md:flex items-center gap-3 pl-4 border-l border-stone-200 dark:border-stone-700">
                                    <div className="relative group">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 p-0.5 cursor-pointer">
                                            <div className="w-full h-full rounded-full bg-white dark:bg-stone-800 flex items-center justify-center overflow-hidden">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'User'}`} alt="User" className="w-full h-full" />
                                            </div>
                                        </div>
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-stone-800 rounded-xl shadow-lg py-1 hidden group-hover:block border border-stone-100 dark:border-stone-700 z-50">
                                            <button onClick={() => navigate('/change-password')} className="block w-full text-left px-4 py-2 text-sm text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 flex items-center gap-2">
                                                <Settings size={16} /> Change Password
                                            </button>
                                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 flex items-center gap-2">
                                                <Share2 size={16} className="rotate-180" /> Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4 ml-4">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-stone-600 dark:text-stone-300 font-medium hover:text-stone-900 dark:hover:text-white transition-colors"
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="text-stone-600 dark:text-stone-300 font-medium hover:text-stone-900 dark:hover:text-white transition-colors"
                                >
                                    Sign Up
                                </button>
                                <button
                                    className="text-stone-600 dark:text-stone-300 font-medium hover:text-stone-900 dark:hover:text-white transition-colors"
                                >
                                    Contact Us
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
                    <Outlet context={{ searchQuery, dietaryFilter }} />
                </main>


            </div>


        </div>
    );
};

export default Layout;
