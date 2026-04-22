import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Trophy, Target, TrendingUp, ExternalLink } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';

// Favourite athletes for a trainer — their top students / interesting prospects
const favoriteAthletes = [
  {
    id: 1,
    name: 'Alex Johnson',
    sport: 'Football',
    level: 'Competitive',
    goal: 'Skill Improvement',
    sessions: 12,
    progress: 78,
    badge: 'Top Performer',
    initials: 'AJ',
    color: 'bg-blue-500',
    image: 'https://i.pravatar.cc/200?img=11',
  },
  {
    id: 2,
    name: 'Sarah Martinez',
    sport: 'Basketball',
    level: 'Intermediate',
    goal: 'Competition Prep',
    sessions: 8,
    progress: 62,
    badge: 'Rising Star',
    initials: 'SM',
    color: 'bg-pink-500',
    image: 'https://i.pravatar.cc/200?img=5',
  },
  {
    id: 3,
    name: 'Mike Brown',
    sport: 'Football',
    level: 'Beginner',
    goal: 'Fitness',
    sessions: 5,
    progress: 40,
    badge: null,
    initials: 'MB',
    color: 'bg-green-500',
    image: 'https://i.pravatar.cc/200?img=15',
  },
  {
    id: 4,
    name: 'Emma Davis',
    sport: 'Tennis',
    level: 'Intermediate',
    goal: 'Technique',
    sessions: 3,
    progress: 30,
    badge: 'Most Dedicated',
    initials: 'ED',
    color: 'bg-orange-500',
    image: 'https://i.pravatar.cc/200?img=9',
  },
];

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState(favoriteAthletes);

  const removeFavorite = (id) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

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
              {favorites.map(athlete => (
                <motion.div
                  key={athlete.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden group"
                >
                  {/* Image strip */}
                  <div className="relative h-36 overflow-hidden bg-slate-200 dark:bg-dark-border">
                    <img
                      src={athlete.image}
                      alt={athlete.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    {/* Badge */}
                    {athlete.badge && (
                      <span className="absolute top-3 left-3 bg-primary-orange text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        {athlete.badge}
                      </span>
                    )}

                    {/* Remove from favourites */}
                    <button
                      onClick={() => removeFavorite(athlete.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white dark:bg-dark-bg rounded-full flex items-center justify-center text-red-400 hover:text-red-500 hover:scale-110 transition-all shadow-md"
                      title="Remove from favourites"
                    >
                      <Heart size={15} className="fill-current" />
                    </button>

                    {/* Avatar + name on image */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <div className={`${athlete.color} w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                        {athlete.initials}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm leading-tight drop-shadow">{athlete.name}</p>
                        <p className="text-white/70 text-[10px] font-semibold">{athlete.sport}</p>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-slate-50 dark:bg-white/5 rounded-xl py-2 text-center">
                        <p className="text-xs font-black text-slate-900 dark:text-white">{athlete.level}</p>
                        <p className="text-[10px] text-slate-400">Level</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-white/5 rounded-xl py-2 text-center">
                        <p className="text-xs font-black text-slate-900 dark:text-white">{athlete.sessions}</p>
                        <p className="text-[10px] text-slate-400">Sessions</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-white/5 rounded-xl py-2 text-center">
                        <p className="text-xs font-black text-slate-900 dark:text-white">{athlete.progress}%</p>
                        <p className="text-[10px] text-slate-400">Progress</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                        <span className="flex items-center gap-1">
                          <Target size={10} className="text-primary-orange" />
                          Goal: {athlete.goal}
                        </span>
                        <span className="text-primary-blue">{athlete.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-dark-border rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${athlete.progress}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full bg-gradient-to-r from-primary-blue to-indigo-400 rounded-full"
                        />
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
