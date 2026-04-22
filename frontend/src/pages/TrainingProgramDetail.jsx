import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Edit2, Trash2, Shield, Zap, ChevronRight, Plus } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const programImages = [
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1541960071727-c531398e7b71?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&q=80&w=800',
];

const productIcons = [
  { label: '+4 more', className: 'bg-slate-200 dark:bg-dark-border text-slate-500 text-xs font-bold' }
];

// Type / Format / Level selector component
const OptionSelector = ({ label, options, selected, onSelect }) => (
  <div className="mb-5">
    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
      {label} <span className="text-slate-400 font-normal">· {selected}</span>
    </p>
    <div className="flex gap-2 flex-wrap">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`px-4 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
            selected === opt
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
              : 'bg-white dark:bg-dark-card text-slate-600 dark:text-slate-400 border-slate-200 dark:border-dark-border hover:border-slate-400'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const TrainingProgramDetail = () => {
  const navigate = useNavigate();
  const [productType, setProductType] = useState('Program');
  const [format, setFormat] = useState('Video');
  const [level, setLevel] = useState('Intermediate');
  const [activeImage, setActiveImage] = useState(0);

  const highlights = [
    'Complete week-by-week training schedule',
    'HD video demonstrations for every exercise',
    'Personalised feedback form (first 30 days)',
    'Private community access for 12 weeks',
    'Printable progress tracker & checklists',
  ];

  const benefits = [
    'Built by a certified professional coach',
    'Proven with 100+ athletes',
    'Works for all body types and fitness levels',
    'Immediate digital access after payment',
  ];

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-6">
        <Link to="/store" className="hover:text-primary-blue transition-colors">Store</Link>
        <ChevronRight size={12} />
        <Link to="/store" className="hover:text-primary-blue transition-colors">Training Programs</Link>
        <ChevronRight size={12} />
        <span className="text-slate-600 dark:text-slate-300 truncate">12-Week Football Training Program</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-6xl">
        {/* Left: Images */}
        <div>
          {/* Main Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-video mb-4 bg-slate-200 dark:bg-dark-card">
            <div className="absolute top-3 left-3 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg z-10">POPULAR</div>
            <img
              src={programImages[activeImage]}
              alt="Training program"
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {programImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`flex-shrink-0 w-16 h-16 sm:flex-1 sm:w-auto aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === i ? 'border-primary-blue' : 'border-transparent hover:border-slate-200'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
            <button className="flex-1 aspect-square rounded-xl bg-slate-100 dark:bg-dark-card border-2 border-slate-200 dark:border-dark-border flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400">
              +4 more
            </button>
          </div>
        </div>

        {/* Right: Details */}
        <div>
          {/* Author */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center text-white font-bold text-xs">T</div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Ted Lasso</span>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500">SKU-0001</span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
            12-Week Football Training Program
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
            ))}
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">142 reviews</span>
          </div>

          {/* Price */}
          <p className="text-4xl font-black text-slate-900 dark:text-white mb-6">$299.00</p>

          {/* Selectors */}
          <OptionSelector label="Type" options={['Guide', 'Equipment', 'Program']} selected={productType} onSelect={setProductType} />
          <OptionSelector label="Format" options={['Video', 'Physical']} selected={format} onSelect={setFormat} />
          <OptionSelector label="Level" options={['Beginner', 'Intermediate', 'Advanced']} selected={level} onSelect={setLevel} />

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-slate-700 dark:text-slate-300 font-bold text-sm hover:border-primary-blue hover:text-primary-blue transition-all">
              <Edit2 size={16} /> Edit Product
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-orange text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20">
              <Trash2 size={16} /> Delete Product
            </button>
          </div>

          {/* Trust Badges */}
          <div className="space-y-2">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mt-10 sm:mt-12 pt-8 border-t border-slate-100 dark:border-dark-border">
        {/* About */}
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">About this product</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Comprehensive shooting and ball-handling program designed for intermediate to advanced players.
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Designed for athletes who are serious about levelling up, this program delivers a structured, proven approach that adapts to your schedule and fitness level. Whether you're just starting out or pushing past a plateau, Ted Lasso guides you every step of the way.
          </p>
        </div>

        {/* Included + Benefits */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">What's Included</h3>
            <ul className="space-y-2">
              {highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="w-4 h-4 rounded-full border-2 border-primary-blue flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-blue" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">Benefits</h3>
            <ul className="space-y-2">
              {benefits.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="w-4 h-4 rounded-full border-2 border-primary-orange flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-orange" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TrainingProgramDetail;
