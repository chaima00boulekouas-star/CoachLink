import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Save, MapPin, Loader2 } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../redux/store';
import { authService } from '../api/authService';

const SPORTS = ['Tennis', 'Football', 'Basketball', 'Gym', 'Yoga', 'Boxing', 'Swimming', 'Running'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Competitive'];

const AthleteProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [profile, setProfile] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    location: user?.location || '',
    age: user?.age || '',
    sport: Array.isArray(user?.sports) ? user.sports[0] : (user?.sport || 'Tennis'),
    level: user?.level || 'Beginner',
    goal: user?.goal || '',
  });

  // Keep state in sync if user object changes
  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        location: user.location || '',
        age: user.age || '',
        sport: Array.isArray(user.sports) ? user.sports[0] : (user.sport || 'Tennis'),
        level: user.level || 'Beginner',
        goal: user.goal || '',
      });
    }
  }, [user]);

  const set = (key) => (e) => setProfile((p) => ({ ...p, [key]: e.target.value }));

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        name: `${profile.firstName} ${profile.lastName}`.trim(),
        location: profile.location,
        age: profile.age,
        sports: [profile.sport],
        level: profile.level,
        goal: profile.goal,
      };
      
      const response = await authService.updateProfile(user.id || user._id, payload);
      
      if (response.user) {
        dispatch(updateUser(response.user));
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
          navigate('/athlete/profile');
        }, 1000);
      }
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">

        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Athlete Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your personal information and sport preferences.</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 sm:p-8 shadow-sm">

          {/* Avatar */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-slate-100 dark:border-slate-700">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-indigo-800 flex items-center justify-center shadow-md">
              <span className="text-4xl font-black text-white/40">
                {profile.firstName ? profile.firstName.charAt(0) : 'A'}
              </span>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Profile Photo</h2>
              <p className="text-sm text-slate-500 mb-3">JPG, GIF or PNG. Max size 5MB.</p>
              <div className="flex gap-3 justify-center sm:justify-start">
                <button className="text-sm font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors">
                  Upload Photo
                </button>
                <button className="text-sm font-bold text-slate-500 hover:text-red-500 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
            <User size={18} className="text-indigo-600" /> Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              { label: 'First Name', key: 'firstName' },
              { label: 'Last Name', key: 'lastName' },
              { label: 'Email', key: 'email', type: 'email' },
              { label: 'Age', key: 'age', type: 'number' },
            ].map(({ label, key, type }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
                <input
                  type={type || 'text'}
                  value={profile[key]}
                  onChange={set(key)}
                  className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            ))}

            {/* Location */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <MapPin size={13} /> Location
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={set('location')}
                className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Athletic Profile */}
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Athletic Profile</h3>

          <div className="space-y-5 mb-8">
            {/* Sport */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Preferred Sport</label>
              <div className="flex flex-wrap gap-2">
                {SPORTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setProfile((p) => ({ ...p, sport: s }))}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      profile.sport === s
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-indigo-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Level */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Current Level</label>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setProfile((p) => ({ ...p, level: l }))}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      profile.level === l
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-orange-400'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Primary Goal</label>
              <input
                type="text"
                value={profile.goal}
                onChange={set('goal')}
                placeholder="e.g. skill-improvement, fitness, competition"
                className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Save */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-700 space-y-4">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                {error}
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AthleteProfile;
