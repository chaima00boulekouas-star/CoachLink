import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MessageCircle, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter Program',
    price: '$49',
    period: '/month',
    popular: false,
    features: ['3 training sessions/week', 'Basic nutrition guide', 'Email support', 'Access to beginner library'],
  },
  {
    id: 'elite',
    name: 'Elite Program',
    price: '$99',
    period: '/month',
    popular: true,
    features: ['6 training sessions/week', 'Custom nutrition plan', 'Priority support', 'Full video library access', '1:1 monthly check-in', 'Progress tracking'],
  },
  {
    id: 'champion',
    name: 'Champion Program',
    price: '$149',
    period: '/month',
    popular: false,
    features: ['Unlimited sessions', 'Custom nutrition plan', '24/7 coach access', 'Full library + exclusive content', 'Weekly 1:1 video calls', 'Advanced analytics'],
  },
];

const testimonials = [
  {
    id: 1,
    quote: "Transformed my game completely. The personalized training approach and attention to detail means I've become a much better player overall.",
    author: 'Alex Johnson',
    role: 'Football Player',
    rating: 5,
    avatar: 'https://i.pravatar.cc/100?img=3',
  },
  {
    id: 2,
    quote: "Ted's coaching methodology is second to none. I improved my speed by 30% in just 8 weeks using his Elite Program.",
    author: 'Maria Santos',
    role: 'Track Athlete',
    rating: 5,
    avatar: 'https://i.pravatar.cc/100?img=5',
  },
];

const trainingProducts = [
  {
    id: 1,
    title: '12-Week Transformation Guide',
    tag: 'New',
    tagColor: 'bg-primary-blue',
    price: '$49',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 2,
    title: 'Premium Equipment Package',
    tag: 'Sale',
    tagColor: 'bg-primary-orange',
    price: '$199',
    originalPrice: '$249',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
  },
];

const stats = [
  { label: 'Athletes Coached', value: '18' },
  { label: 'Years Experience', value: '5' },
  { label: 'Programs Created', value: '3' },
  { label: 'Avg. Rating', value: '2' },
];

const TrainerProfile = () => {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const t = testimonials[testimonialIndex];

  return (
    <DashboardLayout>
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden mb-6 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-900 dark:to-dark-card border border-slate-100 dark:border-dark-border">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1563237023-b1e970526dcb?auto=format&fit=crop&q=80&w=1600"
            alt="Background"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />
        </div>

        <div className="relative flex flex-col md:flex-row gap-6 p-5 sm:p-8">
          {/* Left: Profile Info */}
          <div className="flex-1">
            {/* Tag */}
            <div className="inline-flex items-center gap-1.5 bg-primary-orange/20 text-primary-orange text-xs font-bold px-3 py-1 rounded-full mb-4">
              Ted's Profile
            </div>

            <h1 className="text-4xl font-black text-white mb-2">Ted Lasso</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < 4 ? 'fill-amber-400 text-amber-400' : 'fill-amber-400/30 text-amber-400/30'} />
              ))}
              <span className="text-white/70 text-sm font-semibold">4.8 • 24 reviews</span>
            </div>

            <p className="text-white/70 text-sm leading-relaxed max-w-md mb-6">
              Professional Football Coach, 11+ years of experience training athletes at every level — from beginners to elite competitors.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/requests">
                <button className="bg-primary-orange text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/25">
                  Send Profile
                </button>
              </Link>
              <button className="bg-white/10 backdrop-blur text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-white/20 border border-white/20 transition-all">
                0 My Trainees Joined • See →
              </button>
            </div>
          </div>

          {/* Right: Photo */}
          <div className="w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl flex-shrink-0 self-start md:ml-auto">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"
              alt="Ted Lasso"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative flex flex-wrap items-center divide-x-0 sm:divide-x divide-white/10 border-t border-white/10">
          {stats.map(s => (
            <div key={s.label} className="flex-1 text-center py-3 sm:py-4 px-2 sm:px-3 border-b sm:border-b-0 border-white/10">
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-xs text-white/50 font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Meet Your Coach */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
        {/* Left: Image */}
        <div className="rounded-2xl overflow-hidden aspect-video bg-slate-200 dark:bg-dark-card">
          <img
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800"
            alt="Coach Team"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Bio + Actions */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Meet Your Coach</h2>
            <Link to="/dashboard" className="text-xs font-bold text-primary-blue hover:underline">← Go</Link>
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
            Ted Lasso is a dedicated professional coach with over 11 years of experience in football training. He specializes in helping athletes of all levels unlock their potential through structured, science-backed programs.
          </p>

          <div className="space-y-2 mb-6">
            {[{ label: 'Support', sub: 'Get help and answers' }, { label: 'OTP', sub: 'Verify your account' }].map(item => (
              <div key={item.label} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-dark-border">
                <div className="w-8 h-8 bg-primary-blue/10 rounded-lg flex items-center justify-center">
                  <MessageCircle size={14} className="text-primary-blue" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/requests">
            <button className="w-full bg-primary-orange text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20">
              Schedule a Session
            </button>
          </Link>
        </div>
      </div>

      {/* Training Programs */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Training Programs</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Choose a program that suits you — from first-timers to competition-ready professionals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map(plan => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -4 }}
              className={`relative rounded-2xl p-6 border transition-shadow ${
                plan.popular
                  ? 'bg-slate-900 dark:bg-slate-800 border-slate-700 shadow-2xl shadow-slate-900/20'
                  : 'bg-white dark:bg-dark-card border-slate-100 dark:border-dark-border shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-orange text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                  MOST POPULAR
                </div>
              )}
              <div className="mb-5">
                <h3 className={`text-lg font-black mb-1 ${plan.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{plan.name}</h3>
                <div className="flex items-end gap-1">
                  <span className={`text-4xl font-black ${plan.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{plan.price}</span>
                  <span className={`text-sm font-semibold mb-1 ${plan.popular ? 'text-white/60' : 'text-slate-400'}`}>{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${plan.popular ? 'text-white/80' : 'text-slate-600 dark:text-slate-400'}`}>
                    <Check size={14} className={`mt-0.5 flex-shrink-0 ${plan.popular ? 'text-primary-orange' : 'text-primary-blue'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/requests">
                <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                  plan.popular
                    ? 'bg-primary-orange text-white hover:opacity-90 shadow-lg shadow-orange-500/20'
                    : 'bg-slate-100 dark:bg-dark-border text-slate-700 dark:text-slate-300 hover:bg-primary-blue hover:text-white'
                }`}>
                  Get Started
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-slate-50 dark:bg-dark-card/50 rounded-3xl p-8 mb-12 text-center">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">What Clients Say</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Real results from real athletes who trained with Ted</p>
        <div className="max-w-2xl mx-auto">
          <div className="text-5xl text-primary-blue/30 font-serif mb-4">"</div>
          <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed italic mb-6">
            {t.quote}
          </p>
          <div className="flex items-center justify-center gap-3">
            <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full" />
            <div className="text-left">
              <p className="text-sm font-black text-slate-900 dark:text-white">{t.author}</p>
              <p className="text-xs text-slate-400">{t.role}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 mt-4">
            {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} className="fill-amber-400 text-amber-400" />)}
          </div>
          {/* Navigation dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === testimonialIndex ? 'bg-primary-blue w-6' : 'bg-slate-300 dark:bg-dark-border'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Training Products */}
      <div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Training Products</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Purchase products and resources to support your training journey</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {trainingProducts.map(product => (
            <Link key={product.id} to={`/store/product/${product.id}`}>
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden group"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className={`absolute top-2 left-2 ${product.tagColor} text-white text-[10px] font-black px-2 py-0.5 rounded`}>
                    {product.tag}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-primary-blue transition-colors">{product.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 dark:text-white">{product.price}</span>
                    {product.originalPrice && <span className="text-xs text-slate-400 line-through">{product.originalPrice}</span>}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TrainerProfile;
