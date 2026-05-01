import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search, TrendingUp, Target, Heart, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

const slideshowImages = [
  { src: "/slideshow_1.png", alt: "Trainer coaching athlete in the gym" },
  { src: "/slideshow_2.png", alt: "Sprint training on outdoor track" },
  { src: "/slideshow_3.png", alt: "Yoga and stretching session" },
  { src: "/slideshow_4.png", alt: "Boxing coach training athlete" },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const processSteps = [
    {
      title: "Create Your Profile",
      desc: "Sign up as an athlete or trainer and complete your profile with your sport, goals, and preferences.",
      icon: <UserPlus className="text-indigo-600" />,
      color: "bg-indigo-50 dark:bg-indigo-900/20",
      borderColor: "border-indigo-200 dark:border-indigo-800"
    },
    {
      title: "Get Matched by Sport & Goals",
      desc: "Our platform matches you with compatible trainers based on your sport, level, and training style.",
      icon: <Search className="text-orange-500" />,
      color: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800"
    },
    {
      title: "Start Training & Track Progress",
      desc: "Book sessions, communicate with your trainer, and track your progress toward your goals.",
      icon: <TrendingUp className="text-indigo-600" />,
      color: "bg-indigo-50 dark:bg-indigo-900/20",
      borderColor: "border-indigo-200 dark:border-indigo-800"
    }
  ];

  const missionVision = [
    {
      title: "Our Mission",
      content: "At CoachLink, our mission is to help athletes find the right professional trainers who can unlock their full potential. We believe that every athlete deserves access to quality coaching and personalized guidance. By creating meaningful connections between athletes and trainers, we're working to prevent talent dropout and ensure that no aspiring athlete is left behind due to lack of proper support and mentorship.",
      icon: <Target className="text-indigo-600" />,
      color: "bg-indigo-50 dark:bg-indigo-900/10"
    },
    {
      title: "Our Vision",
      content: "We envision a world where every athlete has access to the coaching they need to thrive. Our platform is designed to support long-term athletic growth and development by fostering relationships built on compatibility, trust, and shared goals. We're committed to creating a community where athletes and trainers can connect, collaborate, and achieve excellence together—today, tomorrow, and for years to come.",
      icon: <Heart className="text-orange-500" />,
      color: "bg-orange-50 dark:bg-orange-900/10"
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32">
        <div className="container mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center gap-12">
          {/* Hero Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left z-10"
          >
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6">
              Find the Right Coach.<span className="text-indigo-600 block lg:inline lg:ml-2">Unlock Your Full Potential.</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              CoachLink connects athletes with professional trainers based on sport, level, goals, and compatibility.
            </p>

          </motion.div>

          {/* Hero Slideshow */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-orange-500/20 rounded-[3rem] blur-3xl" />
            <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white dark:border-dark-border shadow-2xl aspect-[4/3]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={slideshowImages[currentSlide].src}
                  alt={slideshowImages[currentSlide].alt}
                  className="w-full h-full object-cover absolute inset-0"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              {/* Slide indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slideshowImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === currentSlide
                        ? "bg-white w-8 shadow-lg"
                        : "bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Stats Badge */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute -bottom-6 -right-6 bg-white dark:bg-dark-card p-4 rounded-2xl shadow-xl flex items-center space-x-4 border border-slate-100 dark:border-dark-border"
            >
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white leading-tight">500+</p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Expert Coaches</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 bg-slate-50 dark:bg-dark-card/30 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">Our Process</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">Get started with CoachLink in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {processSteps.map((step, i) => (
              <Card key={i} className="flex flex-col items-center text-center p-10 h-full group transition-transform duration-300 ease-out hover:scale-105">
                <div className="relative mb-8">
                  <div className="absolute inset-0 rounded-2xl bg-blue-300/0 dark:bg-amber-400/0 group-hover:bg-blue-300/40 dark:group-hover:bg-amber-400/40 blur-xl scale-150 transition-all duration-500 ease-out" />
                  <div className={`relative w-16 h-16 rounded-2xl ${step.color} border-2 ${step.borderColor} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_0_20px_rgba(147,197,253,0.5)] dark:group-hover:shadow-[0_0_20px_rgba(251,191,36,0.5)]`}>
                    {React.cloneElement(step.icon, { size: 32 })}
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 leading-tight">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-white dark:bg-dark-bg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center mb-16 space-y-3">
            <span className="text-lg md:text-xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">About Us</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">The CoachLink Story</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {missionVision.map((item, i) => (
              <Card key={i} className="space-y-6 !p-12 relative overflow-hidden group transition-transform duration-300 ease-out hover:scale-105">
                <div className={`absolute -right-12 -top-12 w-48 h-48 ${item.color} rounded-full blur-3xl opacity-50 transition-all group-hover:scale-150`} />
                <div className="flex items-center space-x-4 mb-6 relative">
                  <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-dark-border flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{item.title}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-loose relative">
                  {item.content}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;
