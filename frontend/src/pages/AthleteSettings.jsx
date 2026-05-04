import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Globe, Moon, Sun, Save, Eye, EyeOff, Loader2, Camera } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { settingsService } from '../api/dataService';
import { updateUser } from '../redux/store';
import { toast } from 'react-hot-toast';
import { getImageUrl } from '../utils/imageUrl';

const SECTIONS = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security',      label: 'Security',      icon: Shield },
  { id: 'appearance',    label: 'Appearance',    icon: Globe },
];

const SPORTS = ['Tennis', 'Football', 'Basketball', 'Gym', 'Yoga', 'Swimming', 'Running', 'Cycling'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Competitive', 'Professional'];
const GOALS = [
  { value: 'Fitness',               label: 'Fitness' },
  { value: 'Skill Improvement',     label: 'Skill Improvement' },
  { value: 'Competition Prep',      label: 'Competition Prep' },
  { value: 'Weight Loss',           label: 'Weight Loss' },
  { value: 'Muscle Gain',           label: 'Muscle Gain' },
  { value: 'Recovery',              label: 'Recovery' },
];

const ALGERIAN_WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Djelfa", "Jijel", "Sétif", "Saïda",
  "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
  "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "El M'Ghair", "El Meniaa",
  "Ouled Djellal", "Bordj Baji Mokhtar", "Béni Abbès", "Timimoun", "Touggourt", "Djanet", "In Salah", "In Guezzam"
];

const Input = ({ label, value, onChange, type = 'text', placeholder = '' }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
    />
  </div>
);

const Toggle = ({ value, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`w-11 h-6 rounded-full transition-all relative ${value ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-600'}`}
  >
    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${value ? 'left-5' : 'left-0.5'}`} />
  </button>
);

const AthleteSettings = () => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  
  const [active, setActive]   = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    sport: Array.isArray(user?.sports) ? user.sports[0] : (user?.sport || ''),
    level: user?.level || 'Beginner',
    age: user?.age || '',
    goal: user?.goal || '',
  });

  // Security State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Sync with Redux user if it changes
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        sport: Array.isArray(user.sports) ? user.sports[0] : (user.sport || ''),
        level: user.level || 'Beginner',
        age: user.age || '',
        goal: user.goal || '',
      });
    }
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updateData = {
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        sports: [profile.sport],
        level: profile.level,
        age: profile.age,
        goal: profile.goal,
      };
      const res = await settingsService.update(updateData);
      dispatch(updateUser(res.user));
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await settingsService.changePassword(passwords.currentPassword, passwords.newPassword);
      toast.success('Password updated successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setLoading(true);
    try {
      const res = await settingsService.updateAvatar(formData);
      dispatch(updateUser(res.user));
      toast.success('Profile photo updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload photo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your athlete account preferences</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">

          {/* Sidebar Nav */}
          <div className="w-full md:w-56 flex-shrink-0">
            <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              {SECTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    active === id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Icon size={18} /> {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 md:p-8">

            {/* Profile */}
            {active === 'profile' && (
              <form onSubmit={handleProfileSave}>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Profile Information</h2>
                
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl overflow-hidden bg-indigo-100 dark:bg-indigo-900/30 border-4 border-white dark:border-slate-800 shadow-md">
                      <img 
                        src={getImageUrl(user?.avatar, `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'A')}&background=6366f1&color=fff`)} 
                        alt="profile" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl cursor-pointer">
                      <Camera className="text-white" size={24} />
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </label>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-bold text-slate-900 dark:text-white text-lg">{user?.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{user?.email}</p>
                    <label className="inline-block text-xs font-bold text-indigo-600 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900/50 px-4 py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors cursor-pointer shadow-sm">
                      Change Photo
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <Input label="Full Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  <Input label="Email" type="email" value={profile.email} onChange={() => {}} placeholder="Email cannot be changed" />
                  <Input label="Phone Number" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Location (Wilaya)</label>
                    <select
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                    >
                      <option value="">Select Wilaya</option>
                      {ALGERIAN_WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                      <option value="Online">Online / Remote</option>
                    </select>
                  </div>

                  <Input label="Age" value={profile.age} onChange={(e) => setProfile({ ...profile, age: e.target.value })} />
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Experience Level</label>
                    <select
                      value={profile.level}
                      onChange={(e) => setProfile({ ...profile, level: e.target.value })}
                      className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                    >
                      {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Primary Sport</p>
                  <div className="flex flex-wrap gap-2">
                    {SPORTS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setProfile({ ...profile, sport: s })}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                          profile.sport === s
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                            : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-indigo-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Main Fitness Goal</label>
                  <select
                    value={profile.goal}
                    onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                  >
                    <option value="">Select your goal</option>
                    {GOALS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white font-black px-10 py-4 rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Profile Changes
                </button>
              </form>
            )}

            {/* Notifications */}
            {active === 'notifications' && (
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Notifications</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Choose how you want to be notified about your activity.</p>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-8 rounded-3xl border border-dashed border-slate-200 dark:border-slate-600 text-center">
                  <Bell className="mx-auto text-slate-300 dark:text-slate-500 mb-4" size={48} />
                  <p className="text-slate-500 dark:text-slate-400 font-semibold italic">Notification preferences are coming soon!</p>
                </div>
              </div>
            )}

            {/* Security */}
            {active === 'security' && (
              <form onSubmit={handlePasswordUpdate}>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Security Settings</h2>
                <div className="space-y-6 mb-8">
                  <div className="relative">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Current Password</label>
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                    />
                    <button type="button" onClick={() => setShowPwd((p) => !p)} className="absolute right-3 top-10 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">New Password</label>
                      <input
                        type={showConfirmPwd ? 'text' : 'password'}
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                      />
                    </div>
                    <div className="relative">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Confirm New Password</label>
                      <input
                        type={showConfirmPwd ? 'text' : 'password'}
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                      />
                      <button type="button" onClick={() => setShowConfirmPwd((p) => !p)} className="absolute right-3 top-10 text-slate-400">
                        {showConfirmPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl mb-8">
                  <div className="flex gap-3">
                    <Shield className="text-amber-500 flex-shrink-0" size={18} />
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                      Security tip: Use a strong password with at least 8 characters, including symbols and numbers.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !passwords.currentPassword || !passwords.newPassword}
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white font-black px-10 py-4 rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Shield size={18} />}
                  Update Security Settings
                </button>
              </form>
            )}

            {/* Appearance */}
            {active === 'appearance' && (
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Appearance</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Customize how CoachLink looks on your device.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[{ label: 'Light Mode', icon: Sun, value: 'light' }, { label: 'Dark Mode', icon: Moon, value: 'dark' }].map(({ label, icon: Icon, value }) => (
                    <button
                      key={value}
                      onClick={() => { if (theme !== value) toggleTheme(); }}
                      className={`flex flex-col items-center gap-4 p-8 rounded-3xl border-2 transition-all ${
                        theme === value
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10'
                          : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${theme === value ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                        <Icon size={28} />
                      </div>
                      <div className="text-center">
                        <span className={`block text-sm font-bold mb-1 ${theme === value ? 'text-indigo-600' : 'text-slate-900 dark:text-white'}`}>{label}</span>
                        {theme === value && <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-black uppercase">Selected</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AthleteSettings;
