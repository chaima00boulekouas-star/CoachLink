import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, TrendingUp, Target, Heart, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

const Home = () => {
  const heroImage = "/coach_training_athlete_hero_1775775147852.png"; // Relative to public if moved, but I'll use a placeholder if relative path fails

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
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link to="/join" className="w-full sm:w-auto">
                <Button variant="blue" className="px-10 py-4 text-base">Find a Trainer</Button>
              </Link>
              <Link to="/join" className="w-full sm:w-auto">
                <Button variant="orange" className="px-10 py-4 text-base">Become a Trainer</Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-orange-500/20 rounded-[3rem] blur-3xl" />
            <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white dark:border-dark-border shadow-2xl">
              <img 
                src={heroImage} 
                alt="Coach training athlete" 
                className="w-full h-auto object-cover aspect-[4/3]"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=1000";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
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
              <Card key={i} className="flex flex-col items-center text-center p-10 h-full group">
                <div className={`w-16 h-16 rounded-2xl ${step.color} border-2 ${step.borderColor} flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                  {React.cloneElement(step.icon, { size: 32 })}
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
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-200 dark:text-slate-800 uppercase tracking-tighter mb-[-1.5rem] select-none">About Us</h2>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white relative">The CoachLink Story</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {missionVision.map((item, i) => (
              <Card key={i} className="space-y-6 !p-12 relative overflow-hidden group">
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

      {/* Call to Action */}
      <section className="py-24 container mx-auto px-4 md:px-6">
        <div className="bg-indigo-600 dark:bg-indigo-800 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full -ml-48 -mb-48 blur-3xl" />
          
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative">Ready to start your journey?</h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto relative opacity-90 font-medium">Join thousands of athletes and coaches already using CoachLink.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
            <Link to="/join">
              <Button variant="orange" className="!w-auto px-12 py-5 text-lg">Join CoachLink Now</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="!w-auto px-12 py-5 text-lg border-white/30 text-white hover:bg-white/10">Contact Support</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
