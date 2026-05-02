import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Trophy, Target, Loader2 } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';
import { favoritesService } from '../api/dataService';

const COLORS = ['bg-blue-500', 'bg-pink-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500', 'bg-indigo-500', 'bg-teal-500'];

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await favoritesService.getFavorites();
        setFavorites(data.favorites || []);
      } catch (err) {
        console.error('Failed to fetch favorites:', err);
        setError('Failed to load favorites');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const removeFavorite = async (id) => {
    try {
      await favoritesService.toggle(id);
      setFavorites(prev => prev.filter(f => f._id !== id));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const getColor = (index) => COLORS[index % COLORS.length];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="animate-spin text-primary-blue" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Heart size={28} className="text-primary-orange fill-primary-orange" /> Favourite Athletes
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {favorites.length} saved athlete{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-semibold text-sm mb-6">{error}</div>
        )}

        {favorites.length === 0 ? (
          <div className="text-center py-24">
            <Heart size={64} className="mx-auto mb-4 text-slate-200 dark:text-dark-border" />
            <h3 className="text-xl font-black text-slate-400 dark:text-slate-600 mb-2">No favourite athletes yet</h3>
            <p className="text-slate-400 dark:text-slate-600 text-sm mb-6">Browse your athlete roster and save the ones you want to track closely</p>
            <Link to="/athletes">
              <button className="bg-primary-orange text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20">
                Browse Athletes
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <AnimatePresence>
              {favorites.map((athlete, index) => (
                <motion.div
                  key={athlete._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden group"
                >
                  {/* Header strip with avatar */}
                  <div className="relative h-28 overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                    {/* Remove from favourites */}
                    <button
                      onClick={() => removeFavorite(athlete._id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white dark:bg-dark-bg rounded-full flex items-center justify-center text-red-400 hover:text-red-500 hover:scale-110 transition-all shadow-md z-10"
                      title="Remove from favourites"
                    >
                      <Heart size={15} className="fill-current" />
                    </button>

                    {/* Avatar + name on gradient */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-3">
                      {athlete.avatar ? (
                        <img
                          src={athlete.avatar.startsWith('http') ? athlete.avatar : `http://localhost:5000/${athlete.avatar}`}
                          alt={athlete.name}
                          className="w-10 h-10 rounded-full border-2 border-white object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className={`${getColor(index)} w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                          {getInitials(athlete.name)}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-bold text-sm leading-tight drop-shadow">{athlete.name}</p>
                        <p className="text-white/70 text-[10px] font-semibold">{athlete.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    {/* Location if available */}
                    {athlete.location && (athlete.location.city || athlete.location.country) && (
                      <div className="mb-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          📍 {[athlete.location.city, athlete.location.country].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    )}

                    {/* Stats row */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-slate-50 dark:bg-white/5 rounded-xl py-2 text-center">
                        <p className="text-xs font-black text-slate-900 dark:text-white">{athlete.role || 'Athlete'}</p>
                        <p className="text-[10px] text-slate-400">Role</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-white/5 rounded-xl py-2 text-center">
                        <p className="text-xs font-black text-slate-900 dark:text-white">
                          {athlete.createdAt ? new Date(athlete.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                        </p>
                        <p className="text-[10px] text-slate-400">Joined</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link to="/requests" className="flex-1">
                        <button className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-primary-blue border border-primary-blue/30 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl py-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-colors">
                          <MessageCircle size={13} /> Message
                        </button>
                      </Link>
                      <Link to="/sessions" className="flex-1">
                        <button className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-primary-orange rounded-xl py-2 hover:opacity-90 transition-opacity shadow-sm shadow-orange-500/20">
                          <Trophy size={13} /> Sessions
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FavoritesPage;
