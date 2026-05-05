import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, X, Image, Award } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { productService } from '../api/dataService';

const CATEGORIES = ['Training Programs', 'Video Courses', 'Equipment', 'Nutrition Guides', 'Mental Training'];
const FORMATS = ['Video', 'Physical', 'PDF Guide', 'Live Session'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

const AddProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [error, setError] = useState('');
  const user = useSelector(state => state.auth.user);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Training Programs',
    format: 'Video',
    level: 'Intermediate',
    stock: '',
    badge: '',
  });

  if (user && !user.isSubscribed) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto py-20 text-center">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
            <Award size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Subscription Required</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
            You need an active subscription to sell products in your store. Join our premium trainers to start growing your business.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="orange" onClick={() => navigate('/settings')}>Go to Settings</Button>
            <Button variant="outline" onClick={() => navigate('/store')}>Back to Store</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  useEffect(() => {
    if (!id) return;
    // fetch product and prefill form
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await productService.getById(id);
        const product = data.product;
        setForm({
          title: product.title || '',
          description: product.description || '',
          price: product.price != null ? String(product.price) : '',
          category: product.category?.name || product.category || 'Training Programs',
          format: product.format || 'Video',
          level: product.level || 'Intermediate',
          stock: product.stock != null ? String(product.stock) : '',
          badge: product.badge || '',
        });
        setExistingImages(product.images || []);
      } catch (err) {
        console.error('Failed to load product:', err);
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('category', form.category);
      
      let type = 'digital';
      if (form.format === 'Physical' || form.category === 'Equipment') type = 'physical';
      if (form.format === 'Video' || form.format === 'Live Session') type = 'program';
      formData.append('type', type);
      
      formData.append('format', form.format);
      formData.append('level', form.level);
      formData.append('stock', form.stock || 0);
      // Only append new images if the user selected files — otherwise leave existing images untouched
      if (images && images.length > 0) {
        images.forEach(img => formData.append('images', img));
      }

      if (id) {
        await productService.update(id, formData);
        navigate('/store');
      } else {
        await productService.create(formData);
        navigate('/store');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">{id ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{id ? 'Update product details' : 'Create a new product to sell in your store'}</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl font-semibold text-sm">{error}</div>}
          {/* Basic Info */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm p-6 space-y-4">
            <h2 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-wider">Product Details</h2>
            <Input label="Product Title" placeholder="e.g. 12-Week Football Training Program" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Description</label>
              <textarea
                rows={4}
                placeholder="Describe what's included and who it's for..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10 transition-all resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Price ($)" type="number" placeholder="0.00" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              <Input label="Stock (Optional)" type="number" placeholder="e.g. 10" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
            </div>
          </div>

          {/* Classification */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm p-6 space-y-5">
            <h2 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-wider">Classefication</h2>
            {[
              { label: 'Category', key: 'category', options: CATEGORIES },
              { label: 'Format', key: 'format', options: FORMATS },
              { label: 'Level', key: 'level', options: LEVELS },
            ].map(({ label, key, options }) => (
              <div key={key}>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{label}</p>
                <div className="flex flex-wrap gap-2">
                  {options.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm({ ...form, [key]: opt })}
                      className={`px-4 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
                        form[key] === opt
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                          : 'bg-white dark:bg-dark-card text-slate-600 dark:text-slate-400 border-slate-200 dark:border-dark-border hover:border-slate-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Badge */}
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Badge (optional)</p>
              <div className="flex flex-wrap gap-2">
                {['', 'POPULAR', 'NEW', 'SALE'].map(badge => (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => setForm({ ...form, badge })}
                    className={`px-4 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
                      form.badge === badge
                        ? 'bg-primary-orange text-white border-primary-orange'
                        : 'bg-white dark:bg-dark-card text-slate-600 dark:text-slate-400 border-slate-200 dark:border-dark-border hover:border-slate-400'
                    }`}
                  >
                    {badge || 'None'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm p-6">
            <h2 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-4">Product Images</h2>
            <label className="border-2 border-dashed border-slate-200 dark:border-dark-border rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:border-primary-blue hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all cursor-pointer group">
              <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageChange} />
              <div className="w-14 h-14 bg-slate-100 dark:bg-dark-border rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                <Upload size={24} className="text-slate-400 group-hover:text-primary-blue transition-colors" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                {images.length > 0 ? `${images.length} images selected` : (existingImages.length > 0 ? `${existingImages.length} existing images` : 'Drop images here or click to upload')}
              </p>
              <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 10MB each</p>
            </label>

            {/* Preview: show new images if selected, otherwise show existing images */}
            <div className="mt-4 flex gap-3 flex-wrap">
              {images && images.length > 0 && images.map((f, i) => (
                <div key={i} className="w-28 h-20 rounded-lg overflow-hidden border">
                  <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                </div>
              ))}
              {(!images || images.length === 0) && existingImages && existingImages.length > 0 && existingImages.map((p, i) => (
                <div key={i} className="w-28 h-20 rounded-lg overflow-hidden border">
                  <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${p}`} alt={`img-${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <Button type="submit" variant="orange" className="flex-1 py-4 text-base" isLoading={isLoading}>
              {id ? 'Update Product' : 'Publish Product'}
            </Button>
            <Button type="button" variant="outline" className="flex-1 py-4 text-base" onClick={() => navigate('/store')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddProductPage;
