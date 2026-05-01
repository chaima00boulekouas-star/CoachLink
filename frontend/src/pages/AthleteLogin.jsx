import React, { useState } from 'react';
import { Target, ArrowLeft, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { useDispatch } from 'react-redux';
import { login } from '../redux/store';

const AthleteLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login
    setTimeout(() => {
      dispatch(login({ user: { email, name: 'John Athlete' }, role: 'athlete' }));
      setIsLoading(false);
      navigate('/athlete/home');
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-[#0A0A16] flex items-center">
      <div className="container mx-auto px-4 max-w-lg">
        <Link to="/login" className="inline-flex items-center text-slate-500 hover:text-indigo-600 dark:text-slate-400 mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          <span className="text-sm font-semibold">Back to role selection</span>
        </Link>

        <Card className="p-10 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" />
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center mb-6">
              <Target size={36} className="text-indigo-600" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Athlete Login</h1>
            <p className="text-slate-500 dark:text-slate-400 text-center font-medium">Welcome back! Sign in to find your perfect trainer</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input 
              label="Email"
              type="email"
              placeholder="athlete@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <Link to="/forgot-password" virtual className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Forgot password?</Link>
              </div>
              <Input 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="blue" className="py-4 text-base font-bold mt-4" isLoading={isLoading}>
              Sign In
            </Button>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex-1 h-px bg-slate-200 dark:bg-dark-border" />
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-dark-border" />
            </div>

            <button
              type="button"
              onClick={() => {
                // TODO: Wire up Google OAuth
                window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google?role=athlete`;
              }}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border-2 border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-slate-700 dark:text-slate-200 font-bold text-base hover:bg-slate-50 dark:hover:bg-dark-border/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Don't have an account? <Link to="/signup/athlete" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Sign up as Athlete</Link>
            </p>
            
            <div className="pt-6 border-t border-slate-100 dark:border-dark-border">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Are you a trainer?</p>
              <Link to="/login/trainer" className="inline-flex items-center text-sm font-bold text-orange-500 hover:underline">
                Login here
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AthleteLogin;
