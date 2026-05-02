import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageCircle, Trophy, Heart, Loader2, MapPin, Target } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { Link, useNavigate } from 'react-router-dom';
import { favoritesService, chatService } from '../api/dataService';
import api from '../api/axios';

const COLORS = ['bg-blue-500', 'bg-pink-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500', 'bg-indigo-500', 'bg-teal-500'];

const AthletesPage = () => {
  const [search, setSearch] = useState('');
  const [athletes, setAthletes] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await api.get('/api/users/athletes');
        setAthletes(usersRes.data.athletes || []);

        try {
          const favData = await favoritesService.getFavorites();
          const favIds = (favData.favorites || []).map(f => f._id || f);
          setFavoriteIds(favIds);
        } catch { /* ignore */ }
      } catch (err) {
        console.error('Failed to fetch athletes:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleFavorite = async (athleteId) => {
    try {
      const data = await favoritesService.toggle(athleteId);
      setFavoriteIds(data.favorites || []);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const startChat = async (athleteId) => {
    try {
      const data = await chatService.getOrCreateConversation(athleteId);
      navigate(`/chat/${data.conversation._id}`);
    } catch (err) {
      console.error('Failed to start chat:', err);
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const filtered = athletes.filter(a => {
    const matchSearch =
      (a.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.sports || []).some(s => s.toLowerCase().includes(search.toLowerCase())) ||
      (a.profileLocation || '').toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Athletes</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Browse and manage athletes on the platform</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-dark-card px-3 py-1.5 rounded-xl border border-slate-200 dark:border-dark-border">
              {athletes.length} Total
            </span>
            <Link to="/favorites">
              <button className="flex items-center gap-1.5 text-sm font-bold text-primary-orange border border-primary-orange/30 px-3 py-1.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors">
                <Heart size={14} className="fill-primary-orange" /> Favorites
              </button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, sport, or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10 transition-all"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <Target size={64} className="mx-auto mb-4 text-slate-200 dark:text-dark-border" />
            <h3 className="text-xl font-black text-slate-400 dark:text-slate-600 mb-2">No athletes found</h3>
            <p className="text-slate-400 dark:text-slate-600 text-sm">Athletes who sign up will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filtered.map((a, index) => {
                const isFav = favoriteIds.includes(a._id);
                const location = a.profileLocation || a.location?.city || a.location?.country || null;
                return (
                  <motion.div
                    key={a._id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm p-5"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      {a.avatar ? (
                        <img
                          src={a.avatar.startsWith('http') ? a.avatar : `http://localhost:5000/${a.avatar}`}
                          alt={a.name}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className={`${COLORS[index % COLORS.length]} w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0`}>
                          {getInitials(a.name)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">{a.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{a.email}</p>
                            {location && (
                              <p className="text-xs text-primary-blue flex items-center gap-1 mt-0.5">
                                <MapPin size={10} /> {location}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => toggleFavorite(a._id)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              isFav
                                ? 'text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100'
                                : 'text-slate-300 dark:text-slate-600 bg-slate-50 dark:bg-white/5 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10'
                            }`}
                            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            <Heart size={15} className={isFav ? 'fill-current' : ''} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Sports tags */}
                    {a.sports && a.sports.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {a.sports.map(sport => (
                          <span key={sport} className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                            {sport}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      <div className="bg-slate-50 dark:bg-white/5 rounded-xl py-2">
                        <p className="text-xs font-black text-slate-900 dark:text-white truncate px-1">{a.level || 'N/A'}</p>
                        <p className="text-[10px] text-slate-400">Level</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-white/5 rounded-xl py-2">
                        <p className="text-xs font-black text-slate-900 dark:text-white truncate px-1">
                          {a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                        </p>
                        <p className="text-[10px] text-slate-400">Joined</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-white/5 rounded-xl py-2">
                        <p className="text-xs font-black text-slate-900 dark:text-white truncate px-1">{a.goal || 'N/A'}</p>
                        <p className="text-[10px] text-slate-400">Goal</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => startChat(a._id)}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-primary-blue border border-primary-blue/30 rounded-xl py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors"
                      >
                        <MessageCircle size={13} /> Message
                      </button>
                      <Link to="/sessions" className="flex-1">
                        <button className="w-full flex items-center justify-center gap-1.5 text-xs font-bold bg-primary-blue text-white rounded-xl py-2 hover:opacity-90 transition-opacity">
                          <Trophy size={13} /> View Sessions
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AthletesPage;
