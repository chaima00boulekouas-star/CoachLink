import React, { useState } from 'react';
import { Search as SearchIcon, X, Star } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';

const searchResults = [
  { id: 1, type: 'trainer', name: 'Marcus Johnson', sub: 'Football · 4.9★', image: 'https://i.pravatar.cc/100?img=8', to: '/profile/me' },
  { id: 2, type: 'product', name: '12-Week Basketball Training Program', sub: '$299 · Training Program', image: 'https://images.unsplash.com/photo-1546519638405-a2c5ba50a55b?auto=format&fit=crop&q=80&w=100', to: '/store/product/1' },
  { id: 3, type: 'trainer', name: 'Elena Williams', sub: 'Basketball · 4.8★', image: 'https://i.pravatar.cc/100?img=5', to: '/profile/me' },
  { id: 4, type: 'product', name: 'Elite Defense Masterclass', sub: '$149 · Video Course', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=100', to: '/store/product/2' },
];

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const filtered = query.length > 1 ? searchResults.filter(r => r.name.toLowerCase().includes(query.toLowerCase())) : [];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Search</h1>

        {/* Search input */}
        <div className="relative mb-8">
          <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            autoFocus
            type="text"
            placeholder="Search trainers, programs, athletes..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-slate-900 dark:text-white text-base focus:outline-none focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10 transition-all"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Results */}
        {query.length > 1 && (
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{query}"
            </p>
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <SearchIcon size={48} className="mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No results found</p>
                <p className="text-sm">Try different keywords</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map(r => (
                  <Link key={r.id} to={r.to}>
                    <div className="flex items-center gap-4 p-4 bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border hover:border-primary-blue transition-all group">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 dark:bg-dark-border flex-shrink-0">
                        <img src={r.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-primary-blue transition-colors truncate">{r.name}</p>
                        <p className="text-xs text-slate-400">{r.sub}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.type === 'trainer' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-primary-blue' : 'bg-orange-50 dark:bg-orange-900/20 text-primary-orange'}`}>
                        {r.type}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Suggestions when empty */}
        {query.length <= 1 && (
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Suggested</p>
            <div className="flex flex-wrap gap-2">
              {['Football', 'Basketball', 'Tennis', 'Strength Training', 'Nutrition', 'Elite Program'].map(tag => (
                <button key={tag} onClick={() => setQuery(tag)} className="px-4 py-2 bg-slate-100 dark:bg-dark-card border border-slate-200 dark:border-dark-border text-sm font-semibold text-slate-600 dark:text-slate-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:text-primary-blue hover:border-primary-blue transition-all">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SearchPage;
