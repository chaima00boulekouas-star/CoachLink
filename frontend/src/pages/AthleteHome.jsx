import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Zap, BookOpen, MessageSquare, Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const FEATURED_COACHES = [
  {
    id: 1,
    name: 'Tashi Duncan',
    sport: 'Tennis',
    rating: 4.9,
    reviews: 36,
    price: '$99/mo',
    tag: 'Top Rated',
    tagColor: 'bg-amber-500',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    sport: 'Football',
    rating: 4.8,
    reviews: 28,
    price: '$79/mo',
    tag: 'Popular',
    tagColor: 'bg-indigo-600',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 3,
    name: 'Elena Williams',
    sport: 'Basketball',
    rating: 4.7,
    reviews: 21,
    price: '$89/mo',
    tag: 'New',
    tagColor: 'bg-green-500',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=400',
  },
];

const RECOMMENDED = [
  {
    id: 4,
    name: 'James Carter',
    sport: 'Tennis',
    rating: 4.6,
    price: '$69/mo',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=400',
    reason: 'Matches your sport preference',
  },
  {
    id: 1,
    name: 'Tashi Duncan',
    sport: 'Tennis',
    rating: 4.9,
    price: '$99/mo',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400',
    reason: 'Highly rated in your area',
  },
];

const QUICK_ACTIONS = [
  { icon: Search,      label: 'Find Trainers',    sub: 'Browse all coaches',      to: '/coaches',               color: 'bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600' },
  { icon: BookOpen,    label: 'My Programs',       sub: 'View active programs',    to: '/athlete/store',         color: 'bg-orange-50 dark:bg-orange-900/10 text-orange-500' },
  { icon: MessageSquare, label: 'Messages',        sub: 'Your conversations',      to: '/requests',              color: 'bg-green-50 dark:bg-green-900/10 text-green-600' },
  { icon: Calendar,    label: 'My Bookings',       sub: 'Upcoming sessions',       to: '/athlete/sessions',      color: 'bg-purple-50 dark:bg-purple-900/10 text-purple-600' },
];

const CoachCard = ({ coach }) => (
  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
    <div className="relative aspect-[4/3] overflow-hidden">
      <img src={coach.image} alt={coach.name} className="w-full h-full object-cover" />
      {coach.tag && (
        <span className={`absolute top-3 left-3 ${coach.tagColor} text-white text-[10px] font-black px-2.5 py-1 rounded-full`}>
          {coach.tag}
        </span>
      )}
      {coach.reason && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <p className="text-[10px] text-white/80 font-semibold">{coach.reason}</p>
        </div>
      )}
      <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-lg px-2 py-1 flex items-center gap-1">
        <Star size={11} className="fill-amber-400 text-amber-400" />
        <span className="text-xs font-bold text-slate-900 dark:text-white">{coach.rating}</span>
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-bold text-slate-900 dark:text-white">{coach.name}</h3>
      <p className="text-xs text-orange-500 font-semibold mb-3">{coach.sport}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-black text-slate-900 dark:text-white">{coach.price}</span>
        <Link to={`/trainer/${coach.id}`}>
          <button className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
            View Profile
          </button>
        </Link>
      </div>
    </div>
  </div>
);

const AthleteHome = () => (
  <DashboardLayout>
    <div className="max-w-6xl mx-auto space-y-10">

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl overflow-hidden p-8 md:p-12 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
        </div>
        <div className="relative max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            <Zap size={12} /> Athlete Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3 leading-tight">
            Find your perfect<br />coach today
          </h1>
          <p className="text-white/80 text-sm mb-6 leading-relaxed">
            Browse top-rated trainers, book sessions, and start crushing your goals with a personalised growth plan.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/coaches">
              <button className="bg-white text-indigo-600 text-sm font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors shadow-lg">
                Browse Coaches
              </button>
            </Link>
            <Link to="/athlete/profile">
              <button className="bg-white/20 backdrop-blur text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-white/30 border border-white/30 transition-all">
                My Profile
              </button>
            </Link>
          </div>
        </div>
        <div className="hidden md:flex absolute right-8 bottom-0 items-end gap-3 h-full">
          <TrendingUp size={120} className="text-white/10 mb-4" />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-5">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.to + action.label} to={action.to}>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:-translate-y-1 transition-all duration-200 shadow-sm cursor-pointer group">
                  <div className={`w-11 h-11 rounded-xl ${action.color} flex items-center justify-center mb-3`}>
                    <Icon size={20} />
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{action.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{action.sub}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recommended Coaches */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Recommended for You</h2>
            <p className="text-xs text-slate-500 mt-0.5">Based on your sport: Tennis</p>
          </div>
          <Link to="/coaches" className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {RECOMMENDED.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>
      </div>

      {/* Featured / Popular Coaches */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Popular Coaches</h2>
          <Link to="/coaches" className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURED_COACHES.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>
      </div>

    </div>
  </DashboardLayout>
);

export default AthleteHome;
