import React, { useState } from 'react';
import { Shield, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/store';
import logoImg from '../assets/logo.png';
import authService from '../api/authService';

const AdminLoginPage = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authService.adminLogin(email, password);
      dispatch(login({ user: data.user, role: 'admin', token: data.token }));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">

      {/* Back link */}
      <Link
        to="/login"
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold"
      >
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Top accent */}
          <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600" />

          <div className="p-10">
            {/* Icon */}
            <div className="flex flex-col items-center mb-8">
              <img
                src={logoImg}
                alt="CoachLink"
                className="h-14 w-auto object-contain mb-4"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <h1 className="text-2xl font-black text-white">Admin Access</h1>
              <p className="text-slate-400 text-sm mt-1 text-center">Secure access for CoachLink administrators</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-900/30 border border-red-800 text-red-400 text-sm font-semibold text-center">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-300 block mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@coachlink.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-300 block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm pr-11"
                  />
                  <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 top-3.5 text-slate-400 hover:text-white transition-colors">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Authenticating...</>
                ) : (
                  <><Shield size={16} /> Access Admin Panel</>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          This page is restricted to platform administrators only.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
