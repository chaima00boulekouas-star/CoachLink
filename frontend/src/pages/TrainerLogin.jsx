import React, { useState } from 'react';
import { Trophy, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { useDispatch } from 'react-redux';
import { login } from '../redux/store';
import authService from '../api/authService';

const TrainerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleMsg, setGoogleMsg] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const successMessage = location.state?.success || '';

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = await authService.trainerLogin(email, password);
      console.log('Trainer login response:', data);

      // Normalize response shape and ensure localStorage is set before navigation
      const user = data?.user || data?.profile || null;
      const token = data?.token || data?.accessToken || null;

      if (token) {
        try {
          localStorage.setItem('cl_auth', JSON.stringify({ user, role: user?.role || 'trainer', token, isAuthenticated: true }));
        } catch (e) { /* ignore storage errors */ }
      }

      dispatch(login({ user, role: user?.role || 'trainer', token }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-[#0A0A16] flex items-center">
      <div className="container mx-auto px-4 max-w-lg">
        <Link to="/login" className="inline-flex items-center text-slate-500 hover:text-orange-500 dark:text-slate-400 mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          <span className="text-sm font-semibold">Back to role selection</span>
        </Link>

        <Card className="p-10 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-orange-500" />
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-orange-50 dark:bg-orange-900/30 rounded-3xl flex items-center justify-center mb-6">
              <Trophy size={36} className="text-orange-500" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Trainer Login</h1>
            <p className="text-slate-500 dark:text-slate-400 text-center font-medium">Welcome back! Sign in to manage your athletes</p>
          </div>

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm font-semibold text-center">
              ✅ {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <Input 
              label="Email"
              type="email"
              placeholder="trainer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs font-bold text-orange-500 hover:underline">Forgot password?</Link>
              </div>
              <Input 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="orange" className="py-4 text-base font-bold mt-4" isLoading={isLoading}>
              Sign In
            </Button>

          </form>

          <div className="mt-8 text-center space-y-4">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Don't have an account? <Link to="/signup/trainer" className="text-orange-500 font-bold hover:underline">Sign up as Trainer</Link>
            </p>
            
            <div className="pt-6 border-t border-slate-100 dark:border-dark-border">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Are you an athlete?</p>
              <Link to="/login/athlete" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:underline">
                Login here
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TrainerLogin;
