import React, { useState, useRef } from 'react';
import { Upload, Check, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// ── Constants ─────────────────────────────────────────────────────────────
const SPORTS_LIST = [
  'Basketball', 'Football', 'Tennis', 'Swimming', 'Running', 'Cycling',
  'Yoga', 'Gym / Fitness', 'Soccer', 'Baseball', 'Volleyball',
  'Martial Arts', 'Golf', 'Boxing', 'Athletics', 'CrossFit', 'Pilates',
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
const DAYS   = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// ── Shared UI ─────────────────────────────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
    {children}{required && <span className="text-orange-500 ml-0.5">*</span>}
  </label>
);

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all';

const SectionTitle = ({ children }) => (
  <h2 className="text-lg font-black text-slate-900 dark:text-white mt-8 mb-5 pb-3 border-b border-slate-100 dark:border-slate-700">
    {children}
  </h2>
);

// File upload button
const FileUploadField = ({ label, hint, accept, fileName, onChange }) => {
  const ref = useRef();
  return (
    <div>
      <FieldLabel required>{label}</FieldLabel>
      {hint && <p className="text-xs text-slate-400 mb-2">{hint}</p>}
      <button
        type="button"
        onClick={() => ref.current.click()}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30 text-slate-500 dark:text-slate-400 hover:border-orange-400 hover:text-orange-500 transition-all text-sm font-semibold"
      >
        <Upload size={16} />
        {fileName ? <span className="text-orange-500 truncate max-w-[200px]">{fileName}</span> : label.replace('*', '').trim()}
      </button>
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={onChange} />
    </div>
  );
};

// Checkbox with orange active style
const CheckItem = ({ label, checked, onChange }) => (
  <label className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all border text-sm ${
    checked
      ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 font-semibold'
      : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/30'
  }`}>
    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
      checked ? 'border-orange-500 bg-orange-500' : 'border-slate-300 dark:border-slate-500'
    }`}>
      {checked && <Check size={10} className="text-white" strokeWidth={3} />}
    </div>
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    {label}
  </label>
);

// Sport specialization multi-tag
const SportSelect = ({ value, onChange }) => {
  const [input, setInput]           = useState('');
  const [suggestions, setSugg]      = useState([]);
  const [open, setOpen]             = useState(false);

  const handleInput = (v) => {
    setInput(v);
    setSugg(
      v.length > 0
        ? SPORTS_LIST.filter(s => s.toLowerCase().includes(v.toLowerCase()) && !value.includes(s))
        : SPORTS_LIST.filter(s => !value.includes(s))
    );
    setOpen(true);
  };

  const add = (s) => {
    if (!value.includes(s)) onChange([...value, s]);
    setInput(''); setSugg([]); setOpen(false);
  };
  const remove = (s) => onChange(value.filter(x => x !== s));

  return (
    <div className="relative">
      <div className="min-h-[48px] w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 flex flex-wrap gap-2 items-center cursor-text"
        onClick={() => { setOpen(true); setSugg(SPORTS_LIST.filter(s => !value.includes(s))); }}>
        {value.map(s => (
          <span key={s} className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-bold px-2.5 py-1 rounded-lg">
            {s}
            <button type="button" onClick={e => { e.stopPropagation(); remove(s); }} className="text-orange-400 hover:text-orange-700 ml-0.5">×</button>
          </span>
        ))}
        <input
          type="text"
          placeholder={value.length === 0 ? 'Start typing or choose from suggestions...' : 'Add more...'}
          value={input}
          onChange={e => handleInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && input) { e.preventDefault(); add(input); } }}
          className="flex-1 min-w-[160px] text-sm text-slate-900 dark:text-white placeholder-slate-400 bg-transparent outline-none py-1"
        />
        <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
      </div>
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 shadow-xl z-10 overflow-hidden max-h-48 overflow-y-auto">
          {suggestions.slice(0, 8).map(s => (
            <button
              key={s} type="button" onClick={() => add(s)}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:text-orange-600 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      {open && (
        <div className="fixed inset-0 z-0" onClick={() => setOpen(false)} />
      )}
      <p className="text-xs text-slate-400 mt-1">Select at least one sport specialization</p>
    </div>
  );
};

// ── Main Form ─────────────────────────────────────────────────────────────
const INITIAL = {
  name: '', email: '', password: '', sports: [], location: '',
  certifications: '', idDoc: null, certDocs: null, experience: '', achievements: '',
  philosophy: '', levels: [],
  price: '75', availability: [],
};

const TrainerSignUp = () => {
  const [form, setForm]     = useState(INITIAL);
  const [loading, setLoad]  = useState(false);
  const navigate            = useNavigate();

  const set     = (key, val) => setForm(p => ({ ...p, [key]: val }));
  const isValid = form.name && form.email && form.password && form.sports.length > 0 && form.location && form.idDoc && form.certDocs;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    setLoad(true);
    setTimeout(() => { setLoad(false); navigate('/login/trainer'); }, 1500);
  };

  const toggleLevel = (l) =>
    set('levels', form.levels.includes(l) ? form.levels.filter(x => x !== l) : [...form.levels, l]);
  const toggleDay = (d) =>
    set('availability', form.availability.includes(d) ? form.availability.filter(x => x !== d) : [...form.availability, d]);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#eef0f8] dark:bg-[#0A0A16]">
      <div className="max-w-2xl mx-auto px-4">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Create Your Trainer Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">Share your expertise and connect with athletes</p>
        </div>

        {/* Main card */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 px-8 pt-6 pb-8">

            {/* ── Basic Information ─────────────────────────────────── */}
            <SectionTitle>Basic Information</SectionTitle>
            <div className="space-y-5">
              <div>
                <FieldLabel required>Full Name</FieldLabel>
                <input
                  type="text"
                  placeholder="Coach Sarah"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  required
                  className={inputCls}
                />
              </div>

              <div>
                <FieldLabel required>Email</FieldLabel>
                <input
                  type="email"
                  placeholder="trainer@example.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  required
                  className={inputCls}
                />
              </div>

              <div>
                <FieldLabel required>Create Password</FieldLabel>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  required
                  className={inputCls}
                />
              </div>

              <div>
                <FieldLabel required>Sport Specialization</FieldLabel>
                <SportSelect value={form.sports} onChange={v => set('sports', v)} />
              </div>

              <div>
                <FieldLabel required>Location</FieldLabel>
                <input
                  type="text"
                  placeholder="City, State (or 'Online' for remote training)"
                  value={form.location}
                  onChange={e => set('location', e.target.value)}
                  required
                  className={inputCls}
                />
              </div>
            </div>

            {/* ── Credentials ───────────────────────────────────────── */}
            <SectionTitle>Credentials</SectionTitle>
            <div className="space-y-5">
              <div>
                <FieldLabel required>Certifications</FieldLabel>
                <input
                  type="text"
                  placeholder="NASM-CPT, USA Basketball Coach..."
                  value={form.certifications}
                  onChange={e => set('certifications', e.target.value)}
                  className={inputCls}
                />
              </div>

              <FileUploadField
                label="ID Verification Document"
                hint="Upload a government-issued ID (driver's license, passport, etc.)"
                accept="image/*,.pdf"
                fileName={form.idDoc?.name}
                onChange={e => set('idDoc', e.target.files[0] || null)}
              />

              <FileUploadField
                label="Certificate Documents"
                hint="Upload your coaching certifications and credentials"
                accept=".jpg,.jpeg,.png,.pdf"
                fileName={form.certDocs?.name}
                onChange={e => set('certDocs', e.target.files[0] || null)}
              />
              <p className="text-xs text-slate-400 -mt-3">Accepted formats: JPG, PNG, PDF (max 5MB each)</p>

              <div>
                <FieldLabel required>Years of Experience</FieldLabel>
                <input
                  type="number"
                  min="0" max="50"
                  placeholder="e.g. 5"
                  value={form.experience}
                  onChange={e => set('experience', e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <FieldLabel required>Achievements</FieldLabel>
                <textarea
                  rows={3}
                  placeholder="E.g., Coached 15+ athletes to college scholarships, Former professional player..."
                  value={form.achievements}
                  onChange={e => set('achievements', e.target.value)}
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>

            {/* ── Training Approach ─────────────────────────────────── */}
            <SectionTitle>Training Approach</SectionTitle>
            <div className="space-y-5">
              <div>
                <FieldLabel required>Training Philosophy</FieldLabel>
                <textarea
                  rows={3}
                  placeholder="Describe your coaching style and approach..."
                  value={form.philosophy}
                  onChange={e => set('philosophy', e.target.value)}
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div>
                <FieldLabel required>Levels Accepted</FieldLabel>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  {LEVELS.map(l => (
                    <CheckItem
                      key={l} label={l}
                      checked={form.levels.includes(l)}
                      onChange={() => toggleLevel(l)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Availability & Pricing ────────────────────────────── */}
            <SectionTitle>Availability &amp; Pricing</SectionTitle>
            <div className="space-y-5">
              <div>
                <FieldLabel required>Price per Session ($)</FieldLabel>
                <input
                  type="number"
                  min="0"
                  placeholder="75"
                  value={form.price}
                  onChange={e => set('price', e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <FieldLabel required>Weekly Availability</FieldLabel>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  {DAYS.map(d => (
                    <CheckItem
                      key={d} label={d}
                      checked={form.availability.includes(d)}
                      onChange={() => toggleDay(d)}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Submit button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={!isValid || loading}
              className={`w-full py-4 rounded-2xl text-white font-bold text-base transition-all shadow-lg ${
                isValid && !loading
                  ? 'bg-orange-500 hover:opacity-90 shadow-orange-500/20 cursor-pointer'
                  : 'bg-orange-200 dark:bg-orange-900/30 cursor-not-allowed opacity-70'
              }`}
            >
              {loading
                ? <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving Profile...
                  </span>
                : 'Complete Profile'
              }
            </button>
            <p className="text-center text-xs text-slate-400 mt-3">
              Please complete all required fields including document uploads
            </p>
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login/trainer" className="text-orange-500 font-bold hover:underline">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default TrainerSignUp;
