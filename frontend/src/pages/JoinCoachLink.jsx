import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, User, GraduationCap, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

const JoinCoachLink = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const roles = [
    {
      id: 'athlete',
      title: "I am an Athlete",
      description: "Looking for a professional trainer to help me improve my skills and reach my goals.",
      icon: <User size={32} className="text-indigo-600" />,
      color: "indigo",
      features: [
        "Find trainers in your sport",
        "Match based on your goals and level",
        "Book and manage training sessions",
        "Track your progress"
      ]
    },
    {
      id: 'trainer',
      title: "I am a Trainer",
      description: "Ready to share my expertise and help athletes achieve their full potential.",
      icon: <GraduationCap size={32} className="text-orange-500" />,
      color: "orange",
      features: [
        "Create your professional profile",
        "Connect with motivated athletes",
        "Manage your schedule and sessions",
        "Build your reputation"
      ]
    }
  ];

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/signup/${selectedRole}`);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-[#0A0A16]">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          <span className="text-sm font-semibold">Back to Home</span>
        </Link>

        <div className="text-center mb-12 space-y-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12"
          >
            <Dumbbell size={40} className="text-indigo-600 dark:text-indigo-400 -rotate-12" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Join CoachLink</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Choose how you want to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {roles.map((role) => (
            <div 
              key={role.id} 
              onClick={() => setSelectedRole(role.id)}
              className="relative group cursor-pointer"
            >
              <Card 
                className={`h-full flex flex-col items-center transition-all duration-300 p-10 border-2 
                  ${selectedRole === role.id 
                    ? `border-${role.color === 'indigo' ? 'indigo-500' : 'orange-500'} ring-4 ring-${role.color === 'indigo' ? 'indigo-500/10' : 'orange-500/10'}` 
                    : 'border-transparent'
                  }`}
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-8 
                  ${role.color === 'indigo' ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                  {role.icon}
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{role.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-center text-sm leading-relaxed mb-8 h-12">
                  {role.description}
                </p>

                <ul className="space-y-3 w-full border-t border-slate-100 dark:border-dark-border pt-8">
                  {role.features.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${role.color === 'indigo' ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
                        <div className={`w-2 h-2 rounded-full ${role.color === 'indigo' ? 'bg-indigo-600' : 'bg-orange-500'}`} />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {selectedRole === role.id && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`absolute top-4 right-4 text-${role.color === 'indigo' ? 'indigo-600' : 'orange-500'}`}
                  >
                    <CheckCircle2 size={32} />
                  </motion.div>
                )}
              </Card>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center space-y-6">
          <Button 
            variant={selectedRole === 'trainer' ? 'orange' : 'blue'} 
            className="max-w-md py-4 text-lg"
            onClick={handleContinue}
            disabled={!selectedRole}
          >
            Continue
          </Button>
          
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Already have an account? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinCoachLink;
