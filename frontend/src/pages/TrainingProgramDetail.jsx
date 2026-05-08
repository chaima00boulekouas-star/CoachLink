import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Edit2, Trash2, Shield, Zap, ChevronRight, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { productService } from '../api/dataService';
import { getImageUrl, FALLBACK_PRODUCT_IMAGE } from '../utils/imageUrl';

const TrainingProgramDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await productService.getById(id);
        // dataService.getById might return { product: ... } or the product directly
        setProduct(data.product || data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Could not load product details.');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(id);
        navigate('/store');
      } catch (err) {
        alert('Failed to delete product.');
      }
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !product) {
    return (
      <DashboardLayout>
        <div className="p-6 bg-red-50 text-red-500 rounded-xl max-w-2xl mx-auto mt-10 text-center">
          <p className="font-bold">{error || 'Product not found.'}</p>
          <button onClick={() => navigate('/store')} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg">
            Back to Store
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [];
  const displayMainImage = images.length > 0 ? getImageUrl(images[activeImage]) : FALLBACK_PRODUCT_IMAGE;

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-6">
        <button onClick={() => navigate(-1)} className="hover:text-primary-blue flex items-center gap-1 transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <span className="mx-2">|</span>
        <Link to="/store" className="hover:text-primary-blue transition-colors">Store</Link>
        <ChevronRight size={12} />
        <span className="text-slate-600 dark:text-slate-300 truncate">{product.category || 'Product'}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-6xl">
        {/* Left: Images */}
        <div>
          {/* Main Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-video mb-4 bg-slate-200 dark:bg-dark-card border border-slate-100 dark:border-dark-border">
            {product.badge && (
              <div className="absolute top-3 left-3 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg z-10">
                {product.badge}
              </div>
            )}
            <img
              src={displayMainImage}
              alt={product.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-16 h-16 sm:flex-1 sm:w-auto aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === i ? 'border-primary-blue' : 'border-transparent hover:border-slate-200'
                  }`}
                >
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div>
          {/* Author / Category */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center text-white font-bold text-xs">
                {(product.trainer?.name || 'T')[0]}
              </div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {product.trainer?.name || 'Trainer'}
              </span>
            </div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
              {product.category || 'General'}
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className={`fill-amber-400 ${i < Math.round(product.ratingAvg || 0) ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700 fill-slate-200 dark:fill-slate-700'}`} />
            ))}
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {Number(product.ratingAvg || 0).toFixed(2)} ({product.reviewsCount || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <p className="text-4xl font-black text-slate-900 dark:text-white mb-6">${product.price}</p>

          {/* Details list instead of selectors (since this is view mode) */}
          <div className="mb-6 space-y-3">
             <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-dark-border">
               <span className="text-sm text-slate-500">Type</span>
               <span className="text-sm font-bold text-slate-800 dark:text-white capitalize">{product.type || 'Program'}</span>
             </div>
             {product.format && (
               <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-dark-border">
                 <span className="text-sm text-slate-500">Format</span>
                 <span className="text-sm font-bold text-slate-800 dark:text-white">{product.format}</span>
               </div>
             )}
             {product.level && (
               <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-dark-border">
                 <span className="text-sm text-slate-500">Level</span>
                 <span className="text-sm font-bold text-slate-800 dark:text-white">{product.level}</span>
               </div>
             )}
             {product.type === 'physical' && (
               <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-dark-border">
                 <span className="text-sm text-slate-500">Stock</span>
                 <span className="text-sm font-bold text-slate-800 dark:text-white">{product.stock || 0} available</span>
               </div>
             )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button onClick={() => navigate(`/store/product/${product._id}/edit`)} className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-slate-700 dark:text-slate-300 font-bold text-sm hover:border-primary-blue hover:text-primary-blue transition-all">
              <Edit2 size={16} /> Edit Product
            </button>
            <button onClick={handleDelete} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-orange text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20">
              <Trash2 size={16} /> Delete Product
            </button>
          </div>

          {/* Trust Badges */}
          <div className="space-y-2 mt-8">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Shield size={14} className="text-green-500" />
              <span>Secure payment via Chargily</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Zap size={14} className="text-amber-500" />
              <span>Instant access after purchase</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lower section */}
      <div className="max-w-6xl mt-10 sm:mt-12 pt-8 border-t border-slate-100 dark:border-dark-border">
        {/* About */}
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">About this product</h2>
          <div className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4 whitespace-pre-wrap">
            {product.description || 'No description provided for this product.'}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TrainingProgramDetail;
