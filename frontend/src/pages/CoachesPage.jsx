import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Send } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { trainerService } from '../api/dataService';

const WILAYAS = [
  'All', "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Djelfa", "Jijel", "Sétif", "Saïda",
  "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
  "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "El M'Ghair", "El Meniaa",
  "Ouled Djellal", "Bordj Baji Mokhtar", "Béni Abbès", "Timimoun", "Touggourt", "Djanet", "In Salah", "In Guezzam"
];

const SPORTS = [
  'All', 'Football', 'Basketball', 'Tennis', 'Swimming', 'Running', 'Cycling', 'Yoga', 'Gym', 
  'Soccer', 'Baseball', 'Volleyball', 'Martial Arts', 'Golf', 'Boxing', 'Athletics',
  'Handball', 'Judo', 'Karate', 'Taekwondo', 'Wrestling', 'Bodybuilding', 'CrossFit',
  'Rugby', 'Table Tennis', 'Badminton', 'Kickboxing', 'Fencing', 'Archery', 'Rowing',
  'Climbing', 'Skiing', 'Hockey', 'Cricket', 'Squash', 'Paddle', 'Pilates', 'Zumba',
  'Powerlifting', 'Calisthenics', 'MMA', 'Muay Thai', 'BJJ', 'Gymnastics'
];

const CoachesPage = () => {
  const [search, setSearch]       = useState('');
  const [sportFilter, setSportFilter] = useState('All');
  const [expFilter, setExpFilter] = useState('All');
  const [maxPrice, setMaxPrice]   = useState(200);
  const [wilaya, setWilaya]       = useState('All');
  const [showCustomPrice, setShowCustomPrice] = useState(false);
  const [customPriceInput, setCustomPriceInput] = useState('');
  const [coaches, setCoaches]     = useState([]);
  const [loading, setLoading]     = useState(true);

  const fetchTrainers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await trainerService.getAll({
        sport: sportFilter,
        wilaya,
        experience: expFilter,
        maxPrice,
        search,
      });
      setCoaches(data.trainers || data || []);
    } catch (err) {
      console.error('Failed to fetch trainers:', err);
      setCoaches([]);
    } finally {
      setLoading(false);
    }
  }, [sportFilter, wilaya, expFilter, maxPrice, search]);

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  const handleCustomPriceSubmit = () => {
    const val = parseInt(customPriceInput, 10);
    if (!isNaN(val) && val > 0) {
      setMaxPrice(val);
    }
    setShowCustomPrice(false);
    setCustomPriceInput('');
  };

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
              <div className="mb-6">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                  Sport
                  <span className="text-[10px] text-indigo-500 lowercase font-medium">{sportFilter}</span>
                </p>
                <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                  {SPORTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSportFilter(s)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
                        sportFilter === s 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                          : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-indigo-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="mb-6">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                  Experience
                  <span className="text-[10px] text-indigo-500 lowercase font-medium">{expFilter}</span>
                </p>
                <div className="flex flex-wrap gap-2 pr-1">
                  {['All', '1-3 Years', '3-5 Years', '5+ Years'].map((e) => (
                    <button
                      key={e}
                      onClick={() => setExpFilter(e)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
                        expFilter === e 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                          : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-indigo-400'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wilaya */}
              <div className="mb-6">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                  Wilaya
                  <span className="text-[10px] text-indigo-500 lowercase font-medium">{wilaya}</span>
                </p>
                <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                  {WILAYAS.map((w) => (
                    <button
                      key={w}
                      onClick={() => setWilaya(w)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
                        wilaya === w 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                          : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-indigo-400'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Max Price: <span className="text-indigo-600 font-black">${maxPrice}/mo</span></p>
                  <button
                    onClick={() => { setShowCustomPrice(true); setCustomPriceInput(String(maxPrice)); }}
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                  >
                    Custom
                  </button>
                </div>

                {showCustomPrice ? (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                      <input
                        type="number"
                        min="1"
                        value={customPriceInput}
                        onChange={(e) => setCustomPriceInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCustomPriceSubmit()}
                        autoFocus
                        className="w-full pl-7 pr-3 py-2 text-sm rounded-xl border border-indigo-400 dark:border-indigo-500 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none"
                        placeholder="Enter price"
                      />
                    </div>
                    <button
                      onClick={handleCustomPriceSubmit}
                      className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
                    >
                      Set
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="range"
                      className="w-full accent-indigo-600"
                      min="49"
                      max={Math.max(200, maxPrice)}
                      step="10"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>$49</span><span>${Math.max(200, maxPrice)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
              {loading ? 'Loading...' : `${coaches.length} trainer${coaches.length !== 1 ? 's' : ''} found`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {coaches.map((coach) => (
                <div
                  key={coach._id || coach.id}
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
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-3">{coach.type || coach.sport}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(coach.tags || coach.sports || []).map((tag) => (
                        <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 text-slate-600 dark:text-slate-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-400 transition-all flex-shrink-0">
                        <Send size={15} />
                      </button>
                      <Link to={`/trainer/${coach._id || coach.id}`} className="flex-1">
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
