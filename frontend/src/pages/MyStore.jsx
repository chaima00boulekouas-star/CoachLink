import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, ChevronDown, Edit2, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { productService } from '../api/dataService';
import { storeService } from '../api/dataService';
import { useSelector } from 'react-redux';
import { getImageUrl, FALLBACK_PRODUCT_IMAGE } from '../utils/imageUrl';

const FILTERS = ['All', 'Training Programs', 'Video Courses', 'Equipment', 'Nutrition Guides', 'Mental Training'];

const BADGE_STYLES = {
  POPULAR: 'bg-slate-900 text-white',
  SALE: 'bg-primary-orange text-white',
  NEW: 'bg-primary-blue text-white',
};



const ProductCard = ({ product, onDelete }) => {
  const [hovered, setHovered] = useState(false);

  const displayImage = product.images && product.images.length > 0
    ? getImageUrl(product.images[0])
    : FALLBACK_PRODUCT_IMAGE;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-200 dark:bg-dark-border">
        <img src={displayImage} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded ${BADGE_STYLES[product.badge] || 'bg-slate-900 text-white'}`}>
            {product.badge}
          </span>
        )}

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2"
            >
              <Link to={`/store/product/${product._id}`}>
                <button className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                  VIEW PRODUCT
                </button>
              </Link>
              <div className="flex gap-2">
                <Link to={`/store/product/${product._id}/edit`}>
                  <button className="bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-white/30 border border-white/30 transition-colors">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => onDelete(product._id)}
                  className="bg-primary-orange/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-primary-orange transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-1 uppercase">{product.category || 'Category'}</p>
        <Link to={`/store/product/${product._id}`}>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white hover:text-primary-blue dark:hover:text-primary-blue transition-colors leading-snug line-clamp-2 mb-1">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-slate-900 dark:text-white">${product.price}</span>
        </div>
      </div>
    </motion.div>
  );
};

const MyStore = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [store, setStore] = useState(null);
  const authUser = useSelector(s => s.auth.user);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getMyProducts();
        setProducts(data.products || []);
        // fetch store details
        try {
          const s = await storeService.getMyStore();
          setStore(s.store || null);
        } catch (err) {
          // no store or failed
          setStore(null);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = activeFilter === 'All' ? products : products.filter(p => p.category === activeFilter);

  const handleDelete = async (id) => {
    if (confirm('Delete this product?')) {
      try {
        await productService.delete(id);
        setProducts(prev => prev.filter(p => p._id !== id));
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product. ' + (error.response?.data?.message || ''));
      }
    }
  };

  return (
    <DashboardLayout>
      {/* Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 bg-white dark:bg-dark-card rounded-xl px-4 py-3 border border-slate-100 dark:border-dark-border shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
            {store ? (
              <>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Store Active
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400">
                  <CheckCircle size={13} />
                  <span className="hidden sm:inline">Subscription</span>
                  {store.subscriptionExpiresAt ? (
                    <span> · Next billing: {new Date(store.subscriptionExpiresAt).toLocaleDateString()}</span>
                  ) : (
                    <span> · Active</span>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <XCircle size={13} />
                No store / Subscription inactive
              </div>
            )}
        </div>
        <div className="flex items-center gap-3">
          <Link to="/store/new-product">
            <button className="flex items-center gap-1.5 text-xs font-bold text-primary-blue border border-primary-blue px-3 py-1.5 rounded-lg hover:bg-primary-blue hover:text-white transition-all">
              <Plus size={14} /> Add Product
            </button>
          </Link>
          <button
            onClick={async () => {
              if (!store) return alert('No store to cancel subscription for.');
              // If subscription expires in future, disallow
              if (store.subscriptionExpiresAt && new Date() < new Date(store.subscriptionExpiresAt)) {
                return alert('Subscription is active until ' + new Date(store.subscriptionExpiresAt).toLocaleString() + '. You cannot cancel until it ends.');
              }
              if (!confirm('Are you sure you want to cancel your store subscription? This will deactivate your store.')) return;
              try {
                const res = await storeService.cancelSubscription();
                alert(res.message || 'Subscription cancelled');
                // Refresh products and store
                setProducts([]);
                setStore(res.store || null);
              } catch (err) {
                console.error(err);
                alert(err.response?.data?.message || 'Failed to cancel subscription');
              }
            }}
            className={`text-xs font-bold ${store ? 'text-red-500' : 'text-slate-400'} hover:bg-red-50 dark:hover:bg-red-900/10 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap`}
            disabled={!store}
          >
            Cancel Subscription
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-4">
        <Link to="/dashboard" className="hover:text-primary-blue transition-colors font-semibold">HOME</Link>
        <span>›</span>
        <span className="text-slate-600 dark:text-slate-300 font-bold">STORE</span>
      </nav>

      <div className="flex items-end justify-between mb-6">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">MY STORE</h1>
        <span className="text-sm text-slate-400">{products.length} products</span>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-400 mr-2 flex-shrink-0">
            <Filter size={15} />
            FILTERS
          </div>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeFilter === f
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-white dark:bg-dark-card text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-dark-border hover:border-slate-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-dark-border px-3 py-1.5 rounded-lg hover:border-slate-400 transition-colors flex-shrink-0 ml-4">
          SORT BY <Plus size={13} />
        </button>
      </div>

      {/* Product Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          {filtered.map(product => (
            <ProductCard key={product._id} product={product} onDelete={handleDelete} />
          ))}

          {/* Add Product Cell */}
          <Link to="/store/new-product">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="aspect-auto bg-white dark:bg-dark-card rounded-2xl border-2 border-dashed border-slate-200 dark:border-dark-border flex flex-col items-center justify-center py-12 gap-2 cursor-pointer hover:border-primary-blue hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all group"
            >
              <Plus size={24} className="text-slate-300 dark:text-slate-600 group-hover:text-primary-blue transition-colors" />
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 group-hover:text-primary-blue transition-colors tracking-wider">ADD PRODUCT</span>
            </motion.div>
          </Link>
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default MyStore;
