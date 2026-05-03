import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../api/authService';

// ── Constants ─────────────────────────────────────────────────────────────
const TOTAL_STEPS = 5;

const SPORTS_LIST = [
  'Football', 'Basketball', 'Tennis', 'Swimming', 'Running', 'Cycling', 'Yoga', 'Gym', 
  'Soccer', 'Baseball', 'Volleyball', 'Martial Arts', 'Golf', 'Boxing', 'Athletics',
  'Handball', 'Judo', 'Karate', 'Taekwondo', 'Wrestling', 'Bodybuilding', 'CrossFit',
  'Rugby', 'Table Tennis', 'Badminton', 'Kickboxing', 'Fencing', 'Archery', 'Rowing',
  'Climbing', 'Skiing', 'Hockey', 'Cricket', 'Squash', 'Paddle', 'Pilates', 'Zumba',
  'Powerlifting', 'Calisthenics', 'MMA', 'Muay Thai', 'BJJ', 'Gymnastics'
];

const LEVELS = [
  { value: 'beginner',     label: 'Beginner',     desc: 'Just starting out' },
  { value: 'passion',      label: 'Passion-based', desc: 'Play for fun and fitness' },
  { value: 'competitive',  label: 'Competitive',   desc: 'Participate in competitions' },
  { value: 'professional', label: 'Professional',  desc: 'Elite/professional level' },
];

const GOALS = [
  { value: 'fitness',     label: 'Fitness',               desc: 'General health and conditioning' },
  { value: 'skill',       label: 'Skill Improvement',     desc: 'Enhance technique and abilities' },
  { value: 'competition', label: 'Competition Preparation',desc: 'Get ready for events' },
  { value: 'recovery',    label: 'Recovery',              desc: 'Rehabilitate from injury' },
];

const STYLES = [
  { value: 'strict',       label: 'Strict Discipline',    desc: 'Structured and demanding approach' },
  { value: 'motivational', label: 'Motivational Coaching',desc: 'Encouraging and supportive' },
  { value: 'technical',    label: 'Technical Focus',      desc: 'Emphasis on mechanics and precision' },
  { value: 'flexible',     label: 'Flexible Approach',    desc: 'Adaptive and personalized' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ALGERIAN_WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Djelfa", "Jijel", "Sétif", "Saïda",
  "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
  "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "El M'Ghair", "El Meniaa",
  "Ouled Djellal", "Bordj Baji Mokhtar", "Béni Abbès", "Timimoun", "Touggourt", "Djanet", "In Salah", "In Guezzam"
];

// ── Shared UI ─────────────────────────────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
    {children}{required && <span className="text-indigo-600 ml-0.5">*</span>}
  </label>
);

const TextInput = ({ label, required, ...props }) => (
  <div>
    {label && <FieldLabel required={required}>{label}</FieldLabel>}
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
    />
  </div>
);

const RadioOption = ({ name, value, checked, onChange, label, desc }) => (
  <label className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
    checked
      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700'
      : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/30'
  }`}>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
      checked ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 dark:border-slate-500'
    }`}>
      {checked && <div className="w-2 h-2 rounded-full bg-white" />}
    </div>
    <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
    <span className="text-sm text-slate-700 dark:text-slate-300">
      <strong className="font-semibold">{label}</strong>
      {desc && <span className="text-slate-500 dark:text-slate-400"> – {desc}</span>}
    </span>
  </label>
);

const CheckboxOption = ({ checked, onChange, label }) => (
  <label className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
    checked
      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700'
      : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/30'
  }`}>
    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
      checked ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 dark:border-slate-500'
    }`}>
      {checked && <Check size={11} className="text-white" strokeWidth={3} />}
    </div>
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
  </label>
);

// ── Steps ─────────────────────────────────────────────────────────────────

// Step 1: Basic Information
const Step1 = ({ data, set }) => {
  const [sportInput, setSportInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleSportInput = (val) => {
    setSportInput(val);
    setSuggestions(
      val.length > 0
        ? SPORTS_LIST.filter(s => s.toLowerCase().includes(val.toLowerCase()) && !data.sports.includes(s))
        : []
    );
  };

  const addSport = (s) => {
    if (!data.sports.includes(s)) set({ ...data, sports: [...data.sports, s] });
    setSportInput('');
    setSuggestions([]);
  };

  const removeSport = (s) => set({ ...data, sports: data.sports.filter(x => x !== s) });

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-5">Basic Information</h2>

      <TextInput
        label="Full Name" required
        placeholder="John Doe"
        value={data.name}
        onChange={e => set({ ...data, name: e.target.value })}
      />

      <TextInput
        label="Email" required type="email"
        placeholder="athlete@example.com"
        value={data.email}
        onChange={e => set({ ...data, email: e.target.value })}
      />

      <TextInput
        label="Create Password" required type="password"
        placeholder="••••••••"
        value={data.password}
        onChange={e => set({ ...data, password: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-4">
        <TextInput
          label="Age" required type="number"
          placeholder="25"
          value={data.age}
          onChange={e => set({ ...data, age: e.target.value })}
        />
        <div>
          <FieldLabel required>Gender</FieldLabel>
          <select
            value={data.gender}
            onChange={e => set({ ...data, gender: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
          >
            <option value="">Choose your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other / Prefer not to say</option>
          </select>
        </div>
      </div>

      <div>
        <FieldLabel required>Location (Wilaya)</FieldLabel>
        <select
          value={data.location}
          onChange={e => set({ ...data, location: e.target.value })}
          required
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
        >
          <option value="">Select Wilaya</option>
          {ALGERIAN_WILAYAS.map(w => (
            <option key={w} value={w}>{w}</option>
          ))}
          <option value="Online">Online / Remote</option>
        </select>
      </div>

      {/* Sports multi-select */}
      <div>
        <FieldLabel required>Sports</FieldLabel>
        <div className="min-h-[48px] w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 flex flex-wrap gap-2 mb-2">
          {data.sports.map(s => (
            <span key={s} className="flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-2.5 py-1 rounded-lg">
              {s}
              <button type="button" onClick={() => removeSport(s)} className="text-indigo-400 hover:text-indigo-700 ml-0.5 leading-none">×</button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Add another sport..."
            value={sportInput}
            onChange={e => handleSportInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && sportInput) { e.preventDefault(); addSport(sportInput); } }}
            className="flex-1 min-w-[140px] text-sm text-slate-900 dark:text-white placeholder-slate-400 bg-transparent outline-none py-1"
          />
        </div>
        {suggestions.length > 0 && (
          <div className="border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 shadow-lg overflow-hidden">
            {suggestions.slice(0, 5).map(s => (
              <button
                key={s} type="button" onClick={() => addSport(s)}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Step 2: Athletic Profile
const Step2 = ({ data, set }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-5">Your Athletic Profile</h2>

    <div>
      <FieldLabel required>Current Level</FieldLabel>
      <div className="space-y-1 mt-1">
        {LEVELS.map(l => (
          <RadioOption
            key={l.value} name="level" value={l.value}
            checked={data.level === l.value}
            onChange={() => set({ ...data, level: l.value })}
            label={l.label} desc={l.desc}
          />
        ))}
      </div>
    </div>

    <div>
      <FieldLabel required>Main Goal</FieldLabel>
      <div className="space-y-1 mt-1">
        {GOALS.map(g => (
          <RadioOption
            key={g.value} name="goal" value={g.value}
            checked={data.goal === g.value}
            onChange={() => set({ ...data, goal: g.value })}
            label={g.label} desc={g.desc}
          />
        ))}
      </div>
    </div>
  </div>
);

// Step 3: Training Preferences
const Step3 = ({ data, set }) => {
  const toggleDay = (day) => {
    const days = data.availability.includes(day)
      ? data.availability.filter(d => d !== day)
      : [...data.availability, day];
    set({ ...data, availability: days });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-5">Training Preferences</h2>

      <div>
        <FieldLabel required>Training Style Preference</FieldLabel>
        <div className="space-y-1 mt-1">
          {STYLES.map(s => (
            <RadioOption
              key={s.value} name="style" value={s.value}
              checked={data.style === s.value}
              onChange={() => set({ ...data, style: s.value })}
              label={s.label} desc={s.desc}
            />
          ))}
        </div>
      </div>

      <div>
        <FieldLabel required>Weekly Availability</FieldLabel>
        <div className="grid grid-cols-2 gap-1 mt-1">
          {DAYS.map(day => (
            <CheckboxOption
              key={day}
              label={day}
              checked={data.availability.includes(day)}
              onChange={() => toggleDay(day)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Step 4: Verification
const Step4 = ({ data, set, next }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOtp = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await authService.sendOtp(data.email);
      setOtpSent(true);
      setSuccess('Verification code sent to your email!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await authService.verifyOtp(data.email, otp);
      set({ ...data, isVerified: true });
      setSuccess('Email verified successfully!');
      setTimeout(() => next(), 1000); // Auto-advance to next step
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-5">Email Verification</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Before completing your profile, we need to verify your email address.
      </p>

      {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-semibold">{error}</div>}
      {success && <div className="p-3 bg-green-50 text-green-600 rounded-xl text-sm font-semibold">{success}</div>}

      {!data.isVerified && !otpSent && (
        <button
          type="button"
          onClick={handleSendOtp}
          disabled={loading || !data.email}
          className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Verification Code'}
        </button>
      )}

      {!data.isVerified && otpSent && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Verification Code</label>
            <input
              type="text"
              placeholder="123456"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="button"
            onClick={handleVerify}
            disabled={loading || otp.length < 5}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </div>
      )}

      {data.isVerified && (
        <div className="p-4 bg-green-50 rounded-xl flex items-center justify-center gap-2 text-green-700 font-bold">
          <Check size={20} /> Email Verified
        </div>
      )}
    </div>
  );
};

// Step 5: Additional Information + Summary
const Step5 = ({ data, set }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-5">Additional Information</h2>

    <div>
      <FieldLabel>Reason for Joining (Optional)</FieldLabel>
      <textarea
        rows={4}
        placeholder="E.g., New to sport, Previous coach conflict, Performance plateau, Preparing for championships..."
        value={data.reason}
        onChange={e => set({ ...data, reason: e.target.value })}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all resize-none"
      />
      <p className="text-xs text-slate-400 mt-1.5">Help trainers understand your background and motivation</p>
    </div>

    {/* Profile Summary */}
    <div className="bg-slate-50 dark:bg-slate-700/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-600">
      <h3 className="font-bold text-slate-800 dark:text-white mb-4">Profile Summary</h3>
      <div className="space-y-2 text-sm">
        {[
          { label: 'Name',     value: data.name },
          { label: 'Sports',   value: data.sports.join(', ') },
          { label: 'Level',    value: data.level },
          { label: 'Goal',     value: data.goal },
          { label: 'Location', value: data.location },
        ].map(({ label, value }) => (
          <div key={label} className="flex gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300 w-20 flex-shrink-0">{label}:</span>
            <span className="text-slate-500 dark:text-slate-400">{value || <span className="text-slate-300 dark:text-slate-600 italic">—</span>}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Main Wizard ───────────────────────────────────────────────────────────
const STEP_LABELS = [
  'Basic Info', 'Athletic Profile', 'Preferences', 'Verification', 'Additional',
];

const INITIAL = {
  // Step 1
  name: '', email: '', password: '', age: '', gender: '', location: '', sports: [],
  // Step 2
  level: 'beginner', goal: 'fitness',
  // Step 3
  style: 'flexible', availability: [],
  // Step 4
  reason: '', isVerified: false,
};

const AthleteSignUp = () => {
  const [step, setStep]     = useState(1);
  const [data, setData]     = useState(INITIAL);
  const [loading, setLoad]  = useState(false);
  const [error, setError]   = useState('');
  const navigate            = useNavigate();

  const progress = (step / TOTAL_STEPS) * 100;

  const next = () => { 
    if (step === 1) {
      if (!data.name || !data.email || !data.password || !data.age || !data.gender || !data.location) {
        setError('Please fill in all required fields to continue.');
        return;
      }
    }
    if (step === 4 && !data.isVerified) {
      setError('Please verify your email to continue.');
      return;
    }
    if (step < TOTAL_STEPS) {
      setStep(s => s + 1); 
      setError('');
    }
  };
  const back = () => { if (step > 1) setStep(s => s - 1); };

  const handleComplete = async () => {
    setLoad(true);
    setError('');
    try {
      // Map wizard fields → backend expected fields
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        location: data.location || '',
        level: data.level || 'beginner',
        fitnessGoals: data.goal ? [data.goal] : [],
        sports: data.sports || [],
        age: data.age || '',
        gender: data.gender || '',
        goal: data.goal || '',
        style: data.style || '',
        availability: data.availability || [],
        reason: data.reason || '',
        isVerified: data.isVerified,
      };
      await authService.athleteSignup(payload);
      navigate('/login/athlete', { state: { success: 'Account created successfully! Please log in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef0f8] dark:bg-[#0A0A16] pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Create Your Athlete Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">Step {step} of {TOTAL_STEPS}</p>
        </div>

        {/* Progress bar */}
        <div className="relative h-2.5 bg-indigo-100 dark:bg-indigo-900/20 rounded-full mb-6 overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step dots (optional visual) */}
        <div className="flex gap-2 mb-8">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                i + 1 < step
                  ? 'bg-indigo-600 text-white'
                  : i + 1 === step
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-900/40'
                  : 'bg-white dark:bg-slate-700 text-slate-400 border border-slate-200 dark:border-slate-600'
              }`}>
                {i + 1 < step ? <Check size={11} strokeWidth={3} /> : i + 1}
              </div>
              <span className={`text-xs font-semibold ${i + 1 === step ? 'text-indigo-600' : 'text-slate-400'} hidden sm:block`}>
                {label}
              </span>
              {i < STEP_LABELS.length - 1 && (
                <div className={`h-px flex-1 w-6 mx-1 ${i + 1 < step ? 'bg-indigo-400' : 'bg-slate-200 dark:bg-slate-600'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">

          {/* Step content */}
          {step === 1 && <Step1 data={data} set={setData} />}
          {step === 2 && <Step2 data={data} set={setData} />}
          {step === 3 && <Step3 data={data} set={setData} />}
          {step === 4 && <Step4 data={data} set={setData} next={next} />}
          {step === 5 && <Step5 data={data} set={setData} />}

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold text-center">
              ❌ {error}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={back}
              disabled={step === 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} /> Back
            </button>

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={next}
                disabled={step === 4 && !data.isVerified}
                className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                disabled={loading}
                className="flex items-center gap-2 bg-orange-500 text-white text-sm font-bold px-7 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20 disabled:opacity-50"
              >
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                  : 'Complete Profile'
                }
              </button>
            )}
          </div>
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login/athlete" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default AthleteSignUp;
