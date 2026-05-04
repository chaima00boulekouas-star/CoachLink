import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Check, ShoppingBag, Send, X, MapPin, Award, AlertCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useSelector } from 'react-redux';
import { productService, trainerService, requestService } from '../api/dataService';
import { getImageUrl, FALLBACK_PRODUCT_IMAGE } from '../utils/imageUrl';

const TAG_COLORS = { 'Best Seller': 'bg-amber-500', 'New': 'bg-green-500', 'Sale': 'bg-red-500', 'Popular': 'bg-indigo-600' };

const CoachProfile = () => {
  const { id }   = useParams();
  const user     = useSelector((s) => s.auth.user);
  
  const [coach, setCoach]           = useState(null);
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [requested, setRequested]   = useState(false);
  const [reqMessage, setReqMessage] = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [cart, setCart]             = useState([]);
  const [sending, setSending]       = useState(false);
  const [requestError, setRequestError] = useState('');
  const [existingRequestId, setExistingRequestId] = useState(null);

  useEffect(() => {
    const fetchCoachData = async () => {
      setLoading(true);
      try {
        const [profileRes, productsRes] = await Promise.all([
          trainerService.getById(id),
          productService.getAll({ trainerId: id })
        ]);
        
        const p = profileRes.profile;
        setCoach({
          name: p.user?.name || 'Coach',
          sport: p.sports?.[0] || p.specialization || 'Fitness',
          sports: p.sports || [],
          bio: p.philosophy || 'Professional trainer dedicated to your success.',
          image: getImageUrl(p.user?.avatar, 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=600'),
          rating: p.ratingAvg || 5.0,
          reviews: p.ratingCount || 0,
          location: p.location || 'Online',
          experience: p.experience || 'N/A',
          specialization: p.specialization,
          price: p.price
        });
        
        setProducts(productsRes.products || []);
      } catch (error) {
        console.error('Failed to fetch coach profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoachData();
  }, [id]);

  // Check if athlete already has a pending request with this trainer
  useEffect(() => {
    const checkExistingRequest = async () => {
      if (!user) return;
      try {
        const res = await requestService.getOutgoing();
        const pending = res.requests?.find(
          r => r.trainer?._id === id && r.status === 'pending'
        );
        if (pending) {
          setRequested(true);
          setExistingRequestId(pending._id);
        }
      } catch (err) {
        // Silently ignore — athlete may not be logged in
      }
    };
    checkExistingRequest();
  }, [id, user]);

  const doRequest = async () => {
    if (!reqMessage.trim()) return;
    setRequestError('');
    setSending(true);
    try {
      const res = await requestService.send(id, { message: reqMessage });
      setRequested(true);
      setShowForm(false);
      setExistingRequestId(res.request?._id);
      setReqMessage('');
    } catch (err) {
      console.error('Failed to send request:', err);
      setRequestError(err.response?.data?.message || 'Failed to send request. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const doCancelRequest = async () => {
    if (!existingRequestId) return;
    try {
      await requestService.cancel(existingRequestId);
      setRequested(false);
      setExistingRequestId(null);
    } catch (err) {
      console.error('Failed to cancel request:', err);
    }
  };

  const addToCart = (p) => setCart((prev) => prev.find((i) => i._id === p._id) ? prev : [...prev, p]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!coach) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trainer not found</h2>
          <Link to="/coaches" className="text-indigo-600 mt-4 inline-block">Back to search</Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden min-h-[320px]">
          <img src={coach.image} alt={coach.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/30" />
          <div className="relative flex flex-col md:flex-row gap-8 p-8 md:p-12">
            <div className="flex-1 text-white self-end md:self-center">
              <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full mb-4">
                {coach.sport} Trainer
              </div>
              <h1 className="text-4xl font-black mb-3">{coach.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{coach.rating}</span>
                </div>
                <span className="text-white/60 text-sm">• {coach.reviews} reviews • {coach.experience} Experience</span>
                <div className="flex items-center gap-1.5 text-white/80 text-sm">
                  <MapPin size={14} className="text-indigo-400" />
                  {coach.location}
                </div>
              </div>
              {coach.price > 0 && (
                <div className="mb-4">
                  <span className="bg-orange-500/20 text-orange-300 text-sm font-bold px-4 py-1.5 rounded-full">
                    {coach.price} DA / session
                  </span>
                </div>
              )}
              <p className="text-white/80 text-sm leading-relaxed max-w-lg mb-8">{coach.bio}</p>
              <div className="flex flex-wrap gap-3">
                {requested ? (
                  <div className="flex items-center gap-3">
                    <span className="bg-green-500/20 text-green-300 border border-green-500/30 text-sm font-bold px-5 py-3 rounded-xl flex items-center gap-2">
                      <Check size={15} /> Request Sent!
                    </span>
                    <button
                      onClick={doCancelRequest}
                      className="text-white/60 text-xs hover:text-white transition-colors flex items-center gap-1"
                    >
                      <X size={13} /> Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowForm((p) => !p)}
                    className="bg-orange-500 text-white text-sm font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-orange-500/30 flex items-center gap-2 active:scale-95"
                  >
                    <Send size={15} /> Send Training Request
                  </button>
                )}
              </div>
            </div>
            <div className="w-36 h-36 md:w-56 md:h-56 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl flex-shrink-0 self-end md:self-center">
              <img src={coach.image} alt={coach.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Request Form */}
        {showForm && !requested && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-8 shadow-sm">
            <h3 className="font-black text-slate-900 dark:text-white text-xl mb-2">Send a Training Request</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Tell {coach.name} about your goals and what you'd like to achieve. They will review your request and respond.
            </p>
            <textarea
              value={reqMessage}
              onChange={(e) => setReqMessage(e.target.value)}
              placeholder={`Hi ${coach.name}, I'm interested in training with you. My goals are...`}
              rows={5}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none mb-4"
            />

            {requestError && (
              <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                <p className="text-xs font-bold text-red-600 dark:text-red-400">{requestError}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={doRequest}
                disabled={!reqMessage.trim() || sending}
                className="flex items-center gap-2 bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={15} /> Send Request
                  </>
                )}
              </button>
              <button onClick={() => { setShowForm(false); setRequestError(''); }} className="px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Store Products */}
        {products.length > 0 && (
          <div className="pt-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                  <Award className="text-orange-500" /> Trainer Store
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">Specialized programs and resources from {coach.name}</p>
              </div>
              {cart.length > 0 && (
                <Link to="/athlete/store">
                  <button className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-bold px-5 py-3 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20">
                    <ShoppingBag size={16} /> Cart ({cart.length})
                  </button>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map((product) => (
                <div key={product._id} className="flex bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm group hover:shadow-md transition-all border-l-4 border-l-orange-500">
                  <div className="w-1/3 min-h-[140px] bg-slate-200 dark:bg-slate-700 relative">
                    <img src={getImageUrl(product.images && product.images[0], FALLBACK_PRODUCT_IMAGE)} alt={product.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {product.badge && (
                      <span className={`absolute top-3 left-3 ${TAG_COLORS[product.badge] || 'bg-slate-900'} text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-sm`}>
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="w-2/3 p-5 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                        {product.title}
                      </h4>
                      <span className="text-2xl font-black text-indigo-600">${product.price}</span>
                    </div>
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => addToCart(product)}
                        className={`flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-2xl transition-all ${
                          cart.find((i) => i._id === product._id)
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-600 border border-green-200 dark:border-green-800'
                            : 'bg-orange-500 text-white hover:opacity-90 shadow-lg shadow-orange-500/20'
                        }`}
                      >
                        <ShoppingBag size={15} />
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
