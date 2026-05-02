import React, { useState } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import authService from '../api/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await authService.forgotPassword(email);
      setIsSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-[#0A0A16] flex items-center">
      <div className="container mx-auto px-4 max-w-lg">
        <Link to="/login" className="inline-flex items-center text-slate-500 hover:text-indigo-600 dark:text-slate-400 mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          <span className="text-sm font-semibold">Back to login</span>
        </Link>

        <Card className="p-10 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center mb-6">
              {isSent ? <Send size={36} className="text-green-500" /> : <Mail size={36} className="text-indigo-600" />}
            </div>
            
            {isSent ? (
              <>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Check your email</h1>
                <p className="text-slate-500 dark:text-slate-400 text-center font-medium">
                  We've sent a password reset link to <span className="text-indigo-600 font-bold">{email}</span>
                </p>
                <div className="mt-8">
                   <Button variant="outline" onClick={() => setIsSent(false)}>Try another email</Button>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Forgot Password?</h1>
                <p className="text-slate-500 dark:text-slate-400 text-center font-medium">Enter your email and we'll send you a link to reset your password</p>
                
                <form onSubmit={handleReset} className="w-full space-y-6 mt-10">
                  <Input 
                    label="Email Address"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  
                  <Button type="submit" variant="blue" className="py-4 text-base font-bold" isLoading={isLoading}>
                    Send Reset Link
                  </Button>
                </form>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
