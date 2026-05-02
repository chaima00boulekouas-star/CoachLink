import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Check, ShoppingBag, Send, X } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useDispatch } from 'react-redux';
import { cancelAthleteRequest } from '../redux/store';
import { productService } from '../api/dataService';
import { getImageUrl, FALLBACK_PRODUCT_IMAGE } from '../utils/imageUrl';

const COACHES = {
  1: { name: 'Tashi Duncan',    sport: 'Tennis',      bio: 'Professional Tennis Coach with 10+ years helping athletes reach their peak performance through tailored training and mental coaching.', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=600', rating: 4.9, reviews: 36, athletes: 12 },
  2: { name: 'Marcus Johnson',  sport: 'Football',    bio: 'Head Football Coach specialising in defensive strategy and physical conditioning for athletes at every level.', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=600', rating: 4.8, reviews: 28, athletes: 9 },
  3: { name: 'Elena Williams',  sport: 'Basketball',  bio: 'Elite Basketball Coach with 8 years of experience building full-game excellence through conditioning and defensive mastery.', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=600', rating: 4.7, reviews: 21, athletes: 7 },
  4: { name: 'James Carter',    sport: 'Fitness',     bio: 'Certified Strength & Conditioning Specialist helping athletes build explosive power and lasting endurance.', image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=600', rating: 4.6, reviews: 15, athletes: 5 },
};

const PLANS = [
  { id: 'starter',  name: 'Starter',  price: '$49', period: '/month', popular: false, features: ['3 sessions/week', 'Basic nutrition guide', 'Email support'] },
  { id: 'elite',    name: 'Elite',    price: '$99', period: '/month', popular: true,  features: ['6 sessions/week', 'Custom nutrition plan', 'Priority support', '1:1 monthly check-in', 'Progress tracking'] },
  { id: 'champion', name: 'Champion', price: '$149', period: '/month', popular: false, features: ['Unlimited sessions', 'Custom nutrition plan', '24/7 coach access', 'Weekly video calls'] },
];



const TAG_COLORS = { 'Best Seller': 'bg-amber-500', 'New': 'bg-green-500', 'Sale': 'bg-red-500', 'Popular': 'bg-indigo-600' };

const CoachProfile = () => {
  const { id }     = useParams();
  const dispatch   = useDispatch();
  const coach      = COACHES[id] || COACHES[1];
  
  const [products, setProducts]     = useState([]);
  const [requested, setRequested]   = useState(false);
  const [reqMessage, setReqMessage] = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [cart, setCart]             = useState([]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll({ trainerId: id });
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, [id]);

  const doRequest = () => {
    if (!reqMessage.trim()) return;
    setRequested(true);
    setShowForm(false);
  };

  const addToCart = (p) => setCart((prev) => prev.find((i) => i._id === p._id) ? prev : [...prev, p]);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden min-h-[280px]">
          <img src={coach.image} alt={coach.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/30" />
          <div className="relative flex flex-col md:flex-row gap-8 p-8 md:p-12">
            <div className="flex-1 text-white self-end md:self-center">
              <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full mb-4">
                {coach.sport} Trainer
              </div>
              <h1 className="text-4xl font-black mb-3">{coach.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                <span className="font-semibold">{coach.rating}</span>
                <span className="text-white/60 text-sm">• {coach.reviews} reviews • {coach.athletes} active athletes</span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed max-w-lg mb-8">{coach.bio}</p>
              <div className="flex flex-wrap gap-3">
                {requested ? (
                  <div className="flex items-center gap-3">
                    <span className="bg-green-500/20 text-green-300 border border-green-500/30 text-sm font-bold px-5 py-3 rounded-xl flex items-center gap-2">
                      <Check size={15} /> Request Sent!
                    </span>
                    <button
                      onClick={() => { setRequested(false); dispatch(cancelAthleteRequest(999)); }}
                      className="text-white/60 text-xs hover:text-white transition-colors flex items-center gap-1"
                    >
                      <X size={13} /> Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowForm((p) => !p)}
                    className="bg-orange-500 text-white text-sm font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/30 flex items-center gap-2"
                  >
                    <Send size={15} /> Send Request
                  </button>
                )}
              </div>
            </div>
            <div className="w-36 h-36 md:w-52 md:h-52 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl flex-shrink-0 self-end md:self-center">
              <img src={coach.image} alt={coach.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Request Form */}
        {showForm && !requested && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="font-black text-slate-900 dark:text-white mb-4">Send a Training Request</h3>
            <textarea
              value={reqMessage}
              onChange={(e) => setReqMessage(e.target.value)}
              placeholder={`Tell ${coach.name} about your goals, current level, and what you'd like to work on...`}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={doRequest}
                disabled={!reqMessage.trim()}
                className="flex items-center gap-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={15} /> Send Request
              </button>
              <button onClick={() => setShowForm(false)} className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Pricing Plans */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Training Programs</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Choose the plan that suits your ambition</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-7 border hover:shadow-lg transition-shadow ${
                  plan.popular ? 'bg-slate-900 dark:bg-slate-800 border-slate-700' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full">MOST POPULAR</div>
                )}
                <h3 className={`text-lg font-black mb-1 ${plan.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{plan.name}</h3>
                <div className="flex items-end gap-1 mb-5">
                  <span className={`text-4xl font-black ${plan.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{plan.price}</span>
                  <span className={`text-sm mb-1 ${plan.popular ? 'text-white/60' : 'text-slate-400'}`}>{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${plan.popular ? 'text-white/80' : 'text-slate-600 dark:text-slate-400'}`}>
                      <Check size={14} className={`mt-0.5 flex-shrink-0 ${plan.popular ? 'text-orange-400' : 'text-indigo-600'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowForm(true)}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                    plan.popular
                      ? 'bg-orange-500 text-white hover:opacity-90 shadow-lg shadow-orange-500/20'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  Send Request
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Store Products */}
        {products.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Trainer Store</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Programs and resources from {coach.name}</p>
              </div>
              {cart.length > 0 && (
                <Link to="/athlete/store">
                  <button className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                    <ShoppingBag size={15} /> View Cart ({cart.length})
                  </button>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {products.map((product) => (
                <div key={product._id} className="flex bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm group">
                  <div className="w-1/3 min-h-[120px] bg-slate-200 dark:bg-slate-700 relative">
                    <img src={getImageUrl(product.images && product.images[0], FALLBACK_PRODUCT_IMAGE)} alt={product.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {product.badge && (
                      <span className={`absolute top-2 left-2 ${TAG_COLORS[product.badge] || 'bg-slate-900'} text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm`}>
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="w-2/3 p-4 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                        {product.title}
                      </h4>
                      <span className="text-xl font-black text-slate-900 dark:text-white">${product.price}</span>
                    </div>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => addToCart(product)}
                        className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl transition-all ${
                          cart.find((i) => i._id === product._id)
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-600 border border-green-200 dark:border-green-800'
                            : 'bg-orange-500 text-white hover:opacity-90 shadow-md shadow-orange-500/20'
                        }`}
                      >
                        <ShoppingBag size={14} />
                        {cart.find((i) => i._id === product._id) ? 'Added' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default CoachProfile;
