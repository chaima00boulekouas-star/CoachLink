import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Send } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const ALL_COACHES = [
  {
    id: 1,
    name: 'Tashi Duncan',
    type: 'Freelance Coach',
    sport: 'Tennis',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400',
    tags: ['Tennis', 'Training', 'Coaching'],
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    type: 'Freelance Coach',
    sport: 'Football',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400',
    tags: ['Football', 'Training', 'Defense'],
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Elena Williams',
    type: 'Freelance Coach',
    sport: 'Basketball',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=400',
    tags: ['Basketball', 'Training', 'Conditioning'],
    rating: 4.7,
  },
  {
    id: 4,
    name: 'James Carter',
    type: 'Club Coach',
    sport: 'Tennis',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=400',
    tags: ['Tennis', 'Fitness', 'Nutrition'],
    rating: 4.6,
  },
];

const SPORTS = ['All', 'Tennis', 'Football', 'Basketball'];

const CoachesPage = () => {
  const [search, setSearch]       = useState('');
  const [sportFilter, setSportFilter] = useState('All');
  const [maxPrice, setMaxPrice]   = useState(200);

  const filtered = ALL_COACHES.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) || c.sport.toLowerCase().includes(q);
    const matchSport  = sportFilter === 'All' || c.sport === sportFilter;
    const matchPrice  = !c.price || c.price <= maxPrice;
    return matchSearch && matchSport && matchPrice;
  });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Find Trainers</h1>
          <p className="text-slate-500 dark:text-slate-400">Discover the perfect coach to help you reach your goals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">

          {/* Filter Panel */}
          <div className="space-y-5">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">Search & Filter</h2>

              {/* Search */}
              <div className="relative mb-5">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Name or sport..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Sport filter */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Sport</p>
                <div className="flex flex-col gap-2">
                  {SPORTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSportFilter(s)}
                      className={`text-left px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                        sportFilter === s
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Experience</p>
                <select className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none">
                  <option>All Experience</option>
                  <option>1-3 Years</option>
                  <option>3-5 Years</option>
                  <option>5+ Years</option>
                </select>
              </div>

              {/* Price Range */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Max Price: <span className="text-indigo-600 font-black">${maxPrice}/mo</span></p>
                  <input
                    type="range"
                    className="w-full accent-indigo-600"
                    min="49"
                    max="200"
                    step="10"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>$49</span><span>$200</span>
                  </div>
                </div>
            </div>
          </div>

          {/* Results */}
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
              {filtered.length} trainer{filtered.length !== 1 ? 's' : ''} found
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((coach) => (
                <div
                  key={coach.id}
                  className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={coach.image}
                      alt={coach.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-lg px-2 py-1 flex items-center gap-1">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{coach.rating}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{coach.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-3">{coach.type}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {coach.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 text-slate-600 dark:text-slate-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-400 transition-all flex-shrink-0">
                        <Send size={15} />
                      </button>
                      <Link to={`/trainer/${coach.id}`} className="flex-1">
                        <button className="w-full bg-orange-500 text-white text-sm font-bold py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-orange-500/20">
                          View Profile
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoachesPage;
