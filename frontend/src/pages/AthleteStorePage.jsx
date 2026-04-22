import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const PRODUCTS = [
  { id: 1, coachId: 1, coach: 'Tashi Duncan', title: '12-Week Tennis Mastery Guide', price: 49, image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=400', tag: 'Best Seller', sport: 'Tennis' },
  { id: 2, coachId: 2, coach: 'Marcus Johnson', title: 'Football Conditioning Program', price: 79, image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&q=80&w=400', tag: 'New', sport: 'Football' },
  { id: 3, coachId: 3, coach: 'Elena Williams', title: 'Basketball Fundamentals Course', price: 59, image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400', tag: null, sport: 'Basketball' },
  { id: 4, coachId: 1, coach: 'Tashi Duncan', title: 'Advanced Serve & Volley Tactics', price: 39, image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=400', tag: 'Sale', sport: 'Tennis' },
  { id: 5, coachId: 4, coach: 'James Carter',  title: 'Strength & Conditioning Bundle', price: 99, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400', tag: 'Popular', sport: 'Gym' },
  { id: 6, coachId: 2, coach: 'Marcus Johnson', title: 'Defensive Positioning Masterclass', price: 49, image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&q=80&w=400', tag: null, sport: 'Football' },
];

const TAG_COLORS = {
  'Best Seller': 'bg-amber-500',
  'New':         'bg-green-500',
  'Sale':        'bg-red-500',
  'Popular':     'bg-indigo-600',
};

const AthleteStorePage = () => {
  const [cart, setCart]     = useState([]);
  const [sport, setSport]   = useState('All');
  const [showCart, setShowCart] = useState(false);

  const sports   = ['All', ...Array.from(new Set(PRODUCTS.map((p) => p.sport)))];
  const filtered = sport === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.sport === sport);
  const total    = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const changeQty = (id, delta) => {
    setCart((prev) => prev
      .map((i) => i.id === id ? { ...i, qty: i.qty + delta } : i)
      .filter((i) => i.qty > 0)
    );
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Coach Store</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Browse programs and resources from top coaches</p>
          </div>
          <button
            onClick={() => setShowCart((p) => !p)}
            className="relative flex items-center gap-2 bg-indigo-600 text-white font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25"
          >
            <ShoppingCart size={18} />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Cart Drawer */}
        {showCart && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-lg">
            <h2 className="font-black text-slate-900 dark:text-white text-lg mb-5 flex items-center gap-2">
              <ShoppingCart size={20} className="text-indigo-600" /> Your Cart
            </h2>
            {cart.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 mb-5">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <img src={item.image} alt={item.title} className="w-14 h-14 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.coach}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => changeQty(item.id, -1)} className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-300 transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-bold w-5 text-center text-slate-900 dark:text-white">{item.qty}</span>
                        <button onClick={() => changeQty(item.id, 1)} className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-300 transition-colors">
                          <Plus size={12} />
                        </button>
                        <button onClick={() => changeQty(item.id, -item.qty)} className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors ml-1">
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <span className="font-black text-slate-900 dark:text-white text-sm w-16 text-right">${item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white">Total: <span className="text-indigo-600 text-lg">${total}</span></span>
                  <Link to="/cart">
                    <button className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20">
                      Checkout →
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        )}

        {/* Sport filters */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sports.map((s) => (
            <button
              key={s}
              onClick={() => setSport(s)}
              className={`text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                sport === s
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => (
            <div key={product.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="relative aspect-video overflow-hidden">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                {product.tag && (
                  <span className={`absolute top-2 left-2 ${TAG_COLORS[product.tag] || 'bg-slate-600'} text-white text-[10px] font-black px-2.5 py-1 rounded-full`}>
                    {product.tag}
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} className={i < 4 ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'} />
                  ))}
                  <span className="text-[10px] text-slate-400 ml-1">by {product.coach}</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3 leading-snug">{product.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-slate-900 dark:text-white">${product.price}</span>
                  <div className="flex items-center gap-2">
                    <Link to={`/trainer/${product.coachId}`}>
                      <button className="text-xs font-bold text-indigo-600 border border-indigo-200 dark:border-indigo-800 px-3 py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors">
                        View Coach
                      </button>
                    </Link>
                    <button
                      onClick={() => addToCart(product)}
                      className="flex items-center gap-1.5 bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-orange-500/20"
                    >
                      <ShoppingBag size={13} /> Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AthleteStorePage;
