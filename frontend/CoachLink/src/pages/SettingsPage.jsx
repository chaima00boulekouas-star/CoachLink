import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, CreditCard, Globe, Moon, Sun, ChevronRight, Save, Eye, EyeOff } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import Input from '../components/Input';
import Button from '../components/Button';

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'appearance', label: 'Appearance', icon: Globe },
];

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Profile form state
  const [profile, setProfile] = useState({
    firstName: 'Ted',
    lastName: 'Lasso',
    email: 'ted@coachlink.com',
    phone: '+1 (555) 123-4567',
    bio: 'Professional Football Coach with 11+ years of experience.',
    sport: 'Football',
    location: 'San Francisco, CA',
  });

  // Notification toggles
  const [notifSettings, setNotifSettings] = useState({
    emailRequests: true,
    emailOrders: true,
    emailSessions: true,
    pushRequests: false,
    pushOrders: true,
    pushSessions: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account preferences and configurations</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar nav */}
          <div className="w-52 flex-shrink-0">
            <nav className="space-y-1">
              {sections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeSection === id
                      ? 'bg-primary-blue text-white shadow-lg shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm p-6"
            >
              {/* Profile Section */}
              {activeSection === 'profile' && (
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6">Profile Information</h2>
                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
                    <div className="w-16 h-16 rounded-2xl bg-primary-blue overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" alt="profile" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">Profile Photo</p>
                      <p className="text-xs text-slate-400 mb-2">JPG, PNG up to 5MB</p>
                      <button className="text-xs font-bold text-primary-blue border border-primary-blue px-3 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors">
                        Change Photo
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input label="First Name" value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})} />
                    <Input label="Last Name" value={profile.lastName} onChange={e => setProfile({...profile, lastName: e.target.value})} />
                    <Input label="Email" type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
                    <Input label="Phone" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
                    <Input label="Sport" value={profile.sport} onChange={e => setProfile({...profile, sport: e.target.value})} />
                    <Input label="Location" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} />
                  </div>
                  <div className="mb-6">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Bio</label>
                    <textarea
                      value={profile.bio}
                      onChange={e => setProfile({...profile, bio: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10 transition-all resize-none"
                    />
                  </div>
                  <Button variant="blue" className="!w-auto px-8" onClick={handleSave}>
                    {saved ? '✓ Saved!' : <><Save size={16} className="mr-2" /> Save Changes</>}
                  </Button>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6">Notification Preferences</h2>
                  {[
                    { group: 'Email Notifications', items: [
                      { key: 'emailRequests', label: 'New training requests' },
                      { key: 'emailOrders', label: 'New orders & purchases' },
                      { key: 'emailSessions', label: 'Session reminders' },
                    ]},
                    { group: 'Push Notifications', items: [
                      { key: 'pushRequests', label: 'New training requests' },
                      { key: 'pushOrders', label: 'New orders & purchases' },
                      { key: 'pushSessions', label: 'Session reminders' },
                    ]},
                  ].map(({ group, items }) => (
                    <div key={group} className="mb-6">
                      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{group}</h3>
                      <div className="space-y-3">
                        {items.map(({ key, label }) => (
                          <div key={key} className="flex items-center justify-between py-2">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
                            <button
                              onClick={() => setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }))}
                              className={`w-11 h-6 rounded-full transition-all relative ${notifSettings[key] ? 'bg-primary-blue' : 'bg-slate-200 dark:bg-dark-border'}`}
                            >
                              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${notifSettings[key] ? 'left-5' : 'left-0.5'}`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button variant="blue" className="!w-auto px-8" onClick={handleSave}>
                    {saved ? '✓ Saved!' : <><Save size={16} className="mr-2" /> Save Preferences</>}
                  </Button>
                </div>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6">Security Settings</h2>
                  <div className="space-y-4 mb-6">
                    <div className="relative">
                      <Input label="Current Password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" />
                      <button onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-9 text-slate-400">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <Input label="New Password" type="password" placeholder="••••••••" />
                    <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl mb-6">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Password must be at least 8 characters and include a number and special character.</p>
                  </div>
                  <Button variant="blue" className="!w-auto px-8" onClick={handleSave}>
                    {saved ? '✓ Saved!' : 'Update Password'}
                  </Button>
                </div>
              )}

              {/* Billing Section */}
              {activeSection === 'billing' && (
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6">Billing & Subscription</h2>
                  <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-green-700 dark:text-green-400">Store Subscription Active</p>
                      <p className="text-xs text-green-600/70 dark:text-green-500">Next billing: May 8, 2026 · $29/month</p>
                    </div>
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">Active</span>
                  </div>
                  <div className="space-y-3">
                    {['12-Week Football Program — Purchased Apr 7, 2026', 'Elite Tactics Masterclass — Purchased Mar 12, 2026'].map(item => (
                      <div key={item} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl text-sm">
                        <span className="text-slate-700 dark:text-slate-300">{item.split(' — ')[0]}</span>
                        <span className="text-slate-400 text-xs">{item.split(' — ')[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Appearance Section */}
              {activeSection === 'appearance' && (
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6">Appearance</h2>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Color Theme</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Light Mode', icon: Sun, value: 'light' },
                      { label: 'Dark Mode', icon: Moon, value: 'dark' },
                    ].map(({ label, icon: Icon, value }) => (
                      <button
                        key={value}
                        onClick={() => { if (theme !== value) toggleTheme(); }}
                        className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                          theme === value
                            ? 'border-primary-blue bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-slate-200 dark:border-dark-border hover:border-slate-300'
                        }`}
                      >
                        <Icon size={32} className={theme === value ? 'text-primary-blue' : 'text-slate-400'} />
                        <span className={`text-sm font-bold ${theme === value ? 'text-primary-blue' : 'text-slate-600 dark:text-slate-400'}`}>{label}</span>
                        {theme === value && (
                          <span className="text-xs bg-primary-blue text-white px-2 py-0.5 rounded-full font-bold">Active</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
