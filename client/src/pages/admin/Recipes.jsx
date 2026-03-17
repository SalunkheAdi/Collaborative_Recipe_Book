import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Plus, Eye, Heart, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Recipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const navigate = useNavigate();

    const fetchRecipes = useCallback(async () => {
        try {
            const res = await api.get('/admin/recipes');
            setRecipes(res.data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            await fetchRecipes();
        };
        loadData();
    }, [fetchRecipes]);

    const handleDeleteRecipe = async (id) => {
        if (!window.confirm('Are you sure you want to delete this recipe?')) return;
        
        try {
            await api.delete(`/admin/recipes/${id}`);
            fetchRecipes();
        } catch {
            alert('Error deleting recipe');
        }
    };

    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              recipe.category?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || recipe.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', ...new Set(recipes.map(r => r.category).filter(Boolean))];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search recipes..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <select 
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="pl-10 pr-8 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none appearance-none cursor-pointer"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/add-recipe')}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium shadow-sm hover:shadow-md"
                >
                    <Plus size={18} />
                    Add Recipe
                </button>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 overflow-hidden transition-colors duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-700">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Recipe</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Category</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Stats</th>
                                <th className="text-right px-6 py-4 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                            {filteredRecipes.map((recipe) => (
                                <tr key={recipe._id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={recipe.image}
                                                alt={recipe.title}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <div>
                                                <div className="font-medium text-stone-800 dark:text-stone-200">{recipe.title}</div>
                                                <div className="text-xs text-stone-500 dark:text-stone-400">{recipe.timeMinutes} min</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-medium">
                                            {recipe.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                            {recipe.difficulty}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
                                            <span className="flex items-center gap-1"><Eye size={12} /> {recipe.views || 0}</span>
                                            <span className="flex items-center gap-1"><Heart size={12} /> {recipe.likesCount || 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/edit-recipe/${recipe._id}`)}
                                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRecipe(recipe._id)}
                                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredRecipes.length === 0 && (
                    <div className="p-8 text-center text-stone-500 dark:text-stone-400">
                        No recipes found matching your filters.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Recipes;
