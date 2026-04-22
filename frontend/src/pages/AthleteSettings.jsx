import React, { useState } from 'react';
import { User, Bell, Shield, Globe, Moon, Sun, Save, Eye, EyeOff } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useTheme } from '../context/ThemeContext';

const SECTIONS = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security',      label: 'Security',      icon: Shield },
  { id: 'appearance',    label: 'Appearance',    icon: Globe },
];

const SPORTS = ['Tennis', 'Football', 'Basketball', 'Gym', 'Yoga', 'Swimming'];

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
  const [active, setActive]   = useState('profile');
  const [saved, setSaved]     = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const [profile, setProfile] = useState({
    firstName: 'Patrick', lastName: 'Zweig',
    email: 'patrick@example.com', phone: '+1 (555) 000-1234',
    sport: 'Tennis', level: 'Competitive', location: 'New York, NY',
  });

  const [notif, setNotif] = useState({
    emailRequests: true, emailSessions: true, emailPromos: false,
    pushRequests: true, pushSessions: true, pushPromos: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Input = ({ label, value, onChange, type = 'text' }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
      />
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your athlete account preferences</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">

          {/* Sidebar Nav */}
          <div className="w-full sm:w-48 flex-shrink-0">
            <nav className="flex sm:flex-col gap-1 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0">
              {SECTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    active === id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">

            {/* Profile */}
            {active === 'profile' && (
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6">Profile Information</h2>
                <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=200" alt="profile" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">Profile Photo</p>
                    <p className="text-xs text-slate-400 mb-2">JPG, PNG up to 5MB</p>
                    <button className="text-xs font-bold text-indigo-600 border border-indigo-300 px-3 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors">
                      Change Photo
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <Input label="First Name" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
                  <Input label="Last Name" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
                  <Input label="Email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                  <Input label="Phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                  <Input label="Location" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
                </div>
                <div className="mb-5">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Preferred Sport</p>
                  <div className="flex flex-wrap gap-2">
                    {SPORTS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setProfile({ ...profile, sport: s })}
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
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Save size={16} /> {saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            )}

            {/* Notifications */}
            {active === 'notifications' && (
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6">Notification Preferences</h2>
                {[
                  { group: 'Email', keys: [
                    { key: 'emailRequests', label: 'Coach request updates' },
                    { key: 'emailSessions', label: 'Session reminders' },
                    { key: 'emailPromos',   label: 'New programs & offers' },
                  ]},
                  { group: 'Push', keys: [
                    { key: 'pushRequests', label: 'Coach request updates' },
                    { key: 'pushSessions', label: 'Session reminders' },
                    { key: 'pushPromos',   label: 'New programs & offers' },
                  ]},
                ].map(({ group, keys }) => (
                  <div key={group} className="mb-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{group} Notifications</h3>
                    <div className="space-y-3">
                      {keys.map(({ key, label }) => (
                        <div key={key} className="flex items-center justify-between py-2">
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
                          <Toggle value={notif[key]} onChange={() => setNotif((p) => ({ ...p, [key]: !p[key] }))} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Save size={16} /> {saved ? 'Saved!' : 'Save Preferences'}
                </button>
              </div>
            )}

            {/* Security */}
            {active === 'security' && (
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6">Security Settings</h2>
                <div className="space-y-4 mb-6">
                  <div className="relative">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Current Password</label>
                    <input
                      type={showPwd ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                    />
                    <button onClick={() => setShowPwd((p) => !p)} className="absolute right-3 top-10 text-slate-400">
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {['New Password', 'Confirm New Password'].map((l) => (
                    <div key={l} className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{l}</label>
                      <input type="password" placeholder="••••••••" className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm" />
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl mb-6">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Password must be at least 8 characters and include a number and special character.</p>
                </div>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Save size={16} /> {saved ? 'Updated!' : 'Update Password'}
                </button>
              </div>
            )}

            {/* Appearance */}
            {active === 'appearance' && (
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6">Appearance</h2>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Color Theme</p>
                <div className="grid grid-cols-2 gap-4">
                  {[{ label: 'Light Mode', icon: Sun, value: 'light' }, { label: 'Dark Mode', icon: Moon, value: 'dark' }].map(({ label, icon: Icon, value }) => (
                    <button
                      key={value}
                      onClick={() => { if (theme !== value) toggleTheme(); }}
                      className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                        theme === value
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Icon size={32} className={theme === value ? 'text-indigo-600' : 'text-slate-400'} />
                      <span className={`text-sm font-bold ${theme === value ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-400'}`}>{label}</span>
                      {theme === value && <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">Active</span>}
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
