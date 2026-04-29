import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, X, Image } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['Training Programs', 'Video Courses', 'Equipment', 'Nutrition Guides', 'Mental Training'];
const FORMATS = ['Video', 'Physical', 'PDF Guide', 'Live Session'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

const AddProductPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [, setImages] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Training Programs',
    format: 'Video',
    level: 'Intermediate',
    badge: '',
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/store');
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Add New Product</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Create a new product to sell in your store</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
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
            <Input label="Price ($)" type="number" placeholder="0.00" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
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
            <div className="border-2 border-dashed border-slate-200 dark:border-dark-border rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:border-primary-blue hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all cursor-pointer group">
              <div className="w-14 h-14 bg-slate-100 dark:bg-dark-border rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                <Upload size={24} className="text-slate-400 group-hover:text-primary-blue transition-colors" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Drop images here or click to upload</p>
              <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 10MB each</p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <Button type="submit" variant="orange" className="flex-1 py-4 text-base" isLoading={isLoading}>
              Publish Product
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
