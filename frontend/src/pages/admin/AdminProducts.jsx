import React, { useState, useEffect } from 'react';
import { Search, Package, Trash2, Eye, Filter, Loader2, DollarSign } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { adminService } from '../../api/dataService';
import { toast } from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('All');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await adminService.getProducts();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Unexpected data format for products:", data);
        setProducts([]);
      }
    } catch (err) {
      console.error("Fetch products error:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(p => {
    const mF = filter === 'All' || p.category?.toLowerCase() === filter.toLowerCase();
    const mS = p.name?.toLowerCase().includes(search.toLowerCase()) || 
               p.trainer?.name?.toLowerCase().includes(search.toLowerCase());
    return mF && mS;
  });

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Products</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{products.length} active programs and products</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products or trainers..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Program', 'Equipment', 'Supplements'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:border-indigo-400'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
        ) : filtered.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-20 text-center">
            <Package size={64} className="mx-auto mb-4 text-slate-200" />
            <p className="text-slate-400 font-bold">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(p => (
              <div key={p._id} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 dark:bg-slate-900">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300"><Package size={40} /></div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-black text-indigo-600 uppercase tracking-wider">{p.category}</div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white leading-tight line-clamp-1">{p.name}</h3>
                    <span className="text-indigo-600 font-black text-sm">${p.price}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{p.description}</p>
                  <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px] flex items-center justify-center font-black uppercase">{p.trainer?.name?.charAt(0)}</div>
                      <span className="text-[10px] font-bold text-slate-500 truncate max-w-[80px]">{p.trainer?.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <button className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-indigo-600 transition-colors flex items-center justify-center"><Eye size={14}/></button>
                      <button className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-red-500 transition-colors flex items-center justify-center"><Trash2 size={14}/></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
