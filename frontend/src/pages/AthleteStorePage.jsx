import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { productService, cartService } from '../api/dataService';
import { getImageUrl, FALLBACK_PRODUCT_IMAGE } from '../utils/imageUrl';
import { toast } from 'react-hot-toast';

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
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCart = async () => {
      try {
        const data = await cartService.getCart();
        setCart(data.items || []);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      }
    };

    fetchProducts();
    fetchCart();
  }, []);

  const sports   = ['All', ...Array.from(new Set(products.map((p) => p.category?.name || p.category || 'General')))];
  const filtered = sport === 'All' ? products : products.filter((p) => (p.category?.name || p.category || 'General') === sport);
  const total    = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = async (product) => {
    try {
      await cartService.addItem(product._id, 1);
      const data = await cartService.getCart();
      setCart(data.items || []);
      toast.success(`${product.title} added to cart!`);
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  const changeQty = async (id, delta) => {
    const item = cart.find(i => (i._id || i.id) === id);
    if (!item) return;

    try {
      const newQty = item.qty + delta;
      if (newQty <= 0) {
        await cartService.removeItem(id);
      } else {
        await cartService.updateQuantity(id, newQty);
      }
      const data = await cartService.getCart();
      setCart(data.items || []);
    } catch (err) {
      toast.error("Failed to update cart");
    }
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Trainer Store</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Browse programs and resources from top trainers</p>
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
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {cart.map((item) => (
                    <div key={item._id} className="flex gap-4 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-dark-border">
                      <img src={getImageUrl(item.images && item.images[0], FALLBACK_PRODUCT_IMAGE)} alt={item.title} className="w-16 h-16 rounded-lg object-cover bg-slate-200" />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 mb-2">${item.price}</p>
                        <div className="flex items-center gap-3">
                          <button onClick={() => changeQty(item._id, -1)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-600 dark:text-slate-300">
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                          <button onClick={() => changeQty(item._id, 1)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-600 dark:text-slate-300">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div key={product._id} className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-200 dark:bg-dark-border">
                <img src={getImageUrl(product.images && product.images[0], FALLBACK_PRODUCT_IMAGE)} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {product.badge && (
                  <span className={`absolute top-3 left-3 text-[10px] font-black px-2 py-1 rounded shadow-sm ${TAG_COLORS[product.badge] || 'bg-slate-900 text-white'}`}>
                    {product.badge}
                  </span>
                )}
                <button
                  onClick={() => addToCart(product)}
                  className="absolute bottom-3 right-3 w-10 h-10 bg-white dark:bg-dark-card rounded-full flex items-center justify-center shadow-lg text-slate-900 dark:text-white hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>{product.trainer?.name || 'TRAINER'}</span>
                  <span>{product.category || 'GENERAL'}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug line-clamp-2">
                  {product.title}
                </h3>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-lg font-black text-slate-900 dark:text-white">${product.price}</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star size={14} className="fill-amber-400" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {Number(product.ratingAvg || 0).toFixed(2)}
                    </span>
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
