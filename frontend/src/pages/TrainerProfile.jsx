import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MessageCircle, ChevronLeft, ChevronRight, Check, CheckCircle, Flag, Loader2 } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { trainerService, reviewService } from '../api/dataService';
import ReportModal from '../components/ReportModal';
import { toast } from 'react-hot-toast';
import { getImageUrl } from '../utils/imageUrl';



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
  const { id } = useParams();
  const currentUser = useSelector(s => s.auth.user);
  
  const [trainer, setTrainer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // If no ID is provided, we are viewing our own profile
        const targetId = id || 'me';
        
        const data = targetId === 'me' 
          ? await trainerService.getProfile() 
          : await trainerService.getById(targetId);
        
        setTrainer(data.profile || data);

        // Fetch reviews
        const reviewData = await reviewService.getTrainerReviews(data.user?._id || data.id);
        setReviews(reviewData);
      } catch (err) {
        toast.error("Failed to load trainer profile");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Loader2 size={40} className="text-primary-blue animate-spin" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!trainer) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Trainer not found</h2>
          <p className="text-slate-500 mt-2">The profile you are looking for does not exist.</p>
        </div>
      </DashboardLayout>
    );
  }

  const name = trainer.user?.name || trainer.name || 'Trainer';
  const specialization = trainer.specialization || trainer.sports?.[0] || 'Professional Coach';
  const philosophy = trainer.philosophy || 'Professional Coach dedicated to helping athletes unlock their potential.';
  const avatar = trainer.user?.avatar || trainer.avatar;
  const isVerified = trainer.user?.isVerified || trainer.isVerified;

  const dynamicStats = [
    { label: 'Athletes Coached', value: trainer.traineeCount || '0' },
    { label: 'Years Experience', value: trainer.experience || '0' },
    { label: 'Programs Created', value: trainer.programCount || '0' },
    { label: 'Avg. Rating', value: trainer.ratingAvg?.toFixed(1) || '0.0' },
  ];

  const currentReview = reviews[testimonialIndex];

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
              {name}'s Profile
            </div>

            <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
              {name}
              {isVerified && (
                <span title="Verified Professional" className="bg-white/10 p-1 rounded-full backdrop-blur-sm">
                  <CheckCircle size={24} className="text-primary-blue fill-white" />
                </span>
              )}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < Math.round(trainer.ratingAvg || 0) ? 'fill-amber-400 text-amber-400' : 'fill-white/20 text-white/20'} />
              ))}
              <span className="text-white/70 text-sm font-semibold">{trainer.ratingAvg?.toFixed(1) || '0.0'} • {reviews.length} reviews</span>
            </div>

            <p className="text-white/70 text-sm leading-relaxed max-w-md mb-6">
              {specialization}. {trainer.location ? `Based in ${trainer.location}.` : ''}
            </p>

            <div className="flex flex-wrap gap-3">
              {id && id !== 'me' && id !== currentUser?._id ? (
                <>
                  <Link to={`/requests/new/${id}`}>
                    <button className="bg-primary-orange text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/25">
                      Hire Coach
                    </button>
                  </Link>
                  <button 
                    onClick={() => setReportModalOpen(true)}
                    className="bg-white/10 backdrop-blur text-white/70 text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-white/20 border border-white/10 transition-all flex items-center gap-2"
                  >
                    <Flag size={14} /> Report
                  </button>
                </>
              ) : (
                <Link to="/settings">
                  <button className="bg-primary-blue text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/25">
                    Edit Profile
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Right: Photo */}
          <div className="w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl flex-shrink-0 self-start md:ml-auto bg-slate-800">
            <img
              src={getImageUrl(avatar)}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative flex flex-wrap items-center divide-x-0 sm:divide-x divide-white/10 border-t border-white/10">
          {dynamicStats.map(s => (
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
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
            {philosophy}
          </p>

          <div className="space-y-2 mb-6">
            {[{ label: 'Support', sub: 'Get help and answers' }, { label: 'Direct Access', sub: 'Message the coach directly' }].map(item => (
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
          {id && id !== 'me' && (
            <Link to={`/requests/new/${id}`}>
              <button className="w-full bg-primary-orange text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20">
                Schedule a Session
              </button>
            </Link>
          )}
        </div>
      </div>



      {/* Testimonials / Reviews */}
      {reviews.length > 0 && (
        <div className="bg-slate-50 dark:bg-dark-card/50 rounded-3xl p-8 mb-12 text-center">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">What Clients Say</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Real results from real athletes who trained with {name.split(' ')[0]}</p>
          <div className="max-w-2xl mx-auto">
            <div className="text-5xl text-primary-blue/30 font-serif mb-4">"</div>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed italic mb-6">
              {currentReview?.comment || "No comment provided."}
            </p>
            <div className="flex items-center justify-center gap-3">
              <img 
                src={getImageUrl(currentReview?.athlete?.avatar)} 
                alt={currentReview?.athlete?.name} 
                className="w-10 h-10 rounded-full object-cover" 
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${currentReview?.athlete?.name || 'User'}&background=random`; }}
              />
              <div className="text-left">
                <p className="text-sm font-black text-slate-900 dark:text-white">{currentReview?.athlete?.name || "Anonymous"}</p>
                <p className="text-xs text-slate-400">Athlete</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < (currentReview?.rating || 0) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'} />
              ))}
            </div>
            {/* Navigation dots */}
            <div className="flex justify-center gap-2 mt-6">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === testimonialIndex ? 'bg-primary-blue w-6' : 'bg-slate-300 dark:bg-dark-border'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

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

      <ReportModal 
        isOpen={reportModalOpen} 
        onClose={() => setReportModalOpen(false)}
        reportedUserId={trainer.user?._id || trainer.id}
        reportedUserName={name}
      />
    </DashboardLayout>
  );
};

export default TrainerProfile;
