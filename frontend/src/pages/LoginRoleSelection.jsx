import React from 'react';
import { motion } from 'framer-motion';
import { Target, Trophy, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Logo from '../components/Logo';

const LoginRoleSelection = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-[#0A0A16] flex items-center">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-12 space-y-4">
          <div className="flex justify-center mb-4">
            <Logo className="h-14" />
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">Welcome back to CoachLink</h1>
          <p className="text-slate-600 dark:text-slate-400 text-xl">Choose your role to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Athlete Login Option */}
          <Card className="flex flex-col items-center text-center p-12 group hover:ring-4 hover:ring-indigo-500/10 transition-all duration-300 ease-out hover:scale-105">
            <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
              <Target size={48} className="text-indigo-600" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">I'm an Athlete</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium flex-1">
              Find expert trainers to help you reach your goals and improve your performance
            </p>
            <Link to="/login/athlete" className="w-full mt-auto">
              <Button variant="blue" className="py-4 font-bold">Continue as Athlete</Button>
            </Link>
            <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">
              Don't have an account? <Link to="/join" className="text-indigo-600 dark:text-indigo-400 hover:underline">Sign up</Link>
            </p>
          </Card>

          {/* Trainer Login Option */}
          <Card className="flex flex-col items-center text-center p-12 group hover:ring-4 hover:ring-orange-500/10 transition-all duration-300 ease-out hover:scale-105">
            <div className="w-24 h-24 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
              <Trophy size={48} className="text-orange-500" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">I'm a Trainer</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium flex-1">
              Connect with motivated athletes and grow your coaching business
            </p>
            <Link to="/login/trainer" className="w-full mt-auto">
              <Button variant="orange" className="py-4 font-bold">Continue as Trainer</Button>
            </Link>
            <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">
              Don't have an account? <Link to="/join" className="text-orange-500 dark:text-orange-400 hover:underline">Sign up</Link>
            </p>
          </Card>
        </div>

        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <ArrowLeft size={18} className="mr-2" />
            <span className="text-sm font-bold">Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginRoleSelection;
