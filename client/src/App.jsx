import React, { useContext } from 'react';
import { Routes, Route, Navigate, Outlet, useOutletContext } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ChangePassword from './pages/ChangePassword';
import Layout from './components/Layout';
import Discover from './pages/Discover';
import Trending from './pages/Trending';
import Community from './pages/Community';
import MyRecipes from './pages/MyRecipes';
import Favorites from './pages/Favorites';
import AddRecipe from './pages/AddRecipe';
import RecipeView from './pages/RecipeView';
import FoodNews from './pages/FoodNews';
import TVShows from './pages/TVShows';
import CuisineRecipes from './pages/CuisineRecipes';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import Dashboard from './pages/admin/Dashboard';
import AdminRecipes from './pages/admin/Recipes';
import AdminUsers from './pages/admin/Users';
import AdminThoughts from './pages/admin/Thoughts';
import MealPlanner from './pages/MealPlanner';
import Friends from './pages/Friends';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import Notifications from './pages/Notifications';
import AuthContext from './context/AuthContext';

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);
  const context = useOutletContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 text-stone-600 dark:text-stone-400">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-medium">Loading CookBook...</p>
        </div>
      </div>
    );
  }

  return user ? <Outlet context={context} /> : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user || !user.isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="recipes" element={<AdminRecipes />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="thoughts" element={<AdminThoughts />} />
      </Route>

      {/* Layout Routes */}
      <Route element={<Layout />}>
        {/* Public Routes within Layout */}
        <Route path="/" element={<Discover />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/community" element={<Community />} />
        <Route path="/recipes/:id" element={<RecipeView />} />
        <Route path="/food-news" element={<FoodNews />} />
        <Route path="/tv-shows" element={<TVShows />} />
        <Route path="/cuisines/:type" element={<CuisineRecipes />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/my-recipes" element={<MyRecipes />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:id" element={<GroupDetail />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/edit-recipe/:id" element={<AddRecipe />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
