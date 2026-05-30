'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Phone, 
  User, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  Smile, 
  MessageSquare,
  Globe,
  Sparkles,
  Heart
} from 'lucide-react';
import { registerPhoneUserAction } from '../(login)/actions';

// Languages matching FastAPI configuration
const languagesList = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'od', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

export default function RegisterPage() {
  const router = useRouter();
  
  // Registration steps: 1: Phone Verification, 2: Personal Profile, 3: Region & Language, 4: Success
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Registration Form State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [pincode, setPincode] = useState('');
  const [language, setLanguage] = useState('en');
  
  // Dynamic lookup state
  const [detectedLocation, setDetectedLocation] = useState('');
  const [fetchingLocation, setFetchingLocation] = useState(false);

  // Auto-fetch Indian location when 6-digit pincode is entered
  useEffect(() => {
    const fetchLocation = async () => {
      if (pincode.length === 6) {
        setFetchingLocation(true);
        setDetectedLocation('');
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
          const data = await res.json();
          if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
            const po = data[0].PostOffice[0];
            setDetectedLocation(`${po.Name}, ${po.District}, ${po.State}`);
          } else {
            setDetectedLocation('Pincode valid, but area lookup yielded no results.');
          }
        } catch (err) {
          setDetectedLocation('Location lookup service is currently unavailable.');
        } finally {
          setFetchingLocation(false);
        }
      } else {
        setDetectedLocation('');
      }
    };
    fetchLocation();
  }, [pincode]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (phoneNumber.replace(/\D/g, '').length < 10) {
        setError('Please enter a valid 10-digit mobile number.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      const ageVal = parseInt(age);
      if (!age || isNaN(ageVal) || ageVal < 1 || ageVal > 120) {
        setError('Please enter a valid age between 1 and 120.');
        return;
      }
      if (!gender) {
        setError('Please select your gender.');
        return;
      }
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setError('');
    setStep((prev) => Math.max(1, prev - 1));
  };

  const formatPhoneNumber = (phone: string) => {
    let clean = phone.replace(/\D/g, '');
    if (!clean.startsWith('91') && clean.length === 10) {
      clean = '91' + clean;
    }
    if (!clean.startsWith('+')) {
      clean = '+' + clean;
    }
    return clean;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (pincode.replace(/\D/g, '').length !== 6) {
      setError('Please enter a valid 6-digit Indian pincode.');
      return;
    }

    setLoading(true);
    const payload = {
      phone_number: formatPhoneNumber(phoneNumber),
      name: name.trim(),
      age: parseInt(age),
      gender: gender,
      pincode: pincode,
      language: language
    };

    try {
      const result = await registerPhoneUserAction(payload);
      if (result.success) {
        setStep(4);
      } else {
        setError(result.message || 'Registration failed. This mobile number may already be registered.');
      }
    } catch (err) {
      setError('Connection failed. Please check if your backend FastAPI server is running.');
    } finally {
      setLoading(false);
    }
  };

  const stepsDetails = [
    { title: 'Mobile Number', desc: 'Verify Phone', icon: Phone },
    { title: 'Personal Info', desc: 'About You', icon: User },
    { title: 'Region & Language', desc: 'Localization', icon: MapPin },
    { title: 'Ready!', desc: 'Access Chatbot', icon: CheckCircle2 }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-cyan-50/50 via-slate-50 to-emerald-50/30 p-4 sm:p-6 md:p-8 pt-24 pb-16 relative overflow-hidden">
      
      {/* Premium Ambient Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-400/10 via-teal-300/10 to-transparent blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-300/10 via-teal-200/10 to-transparent blur-3xl" />
      </div>

      <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-[0_24px_70px_rgba(0,0,0,0.06)] border border-white/60 relative z-10">
        
        {/* Responsive Progress Stepper Container */}
        <div className="mb-8">
          {/* Desktop/Tablet Horizontal Flow */}
          <div className="hidden sm:flex justify-between items-center relative">
            <div className="absolute left-6 right-6 top-[20px] h-0.5 bg-slate-100 -z-10" />
            <div 
              className="absolute left-6 top-[20px] h-0.5 bg-gradient-to-r from-cyan-600 to-teal-600 transition-all duration-500 -z-10" 
              style={{ width: `${((step - 1) / (stepsDetails.length - 1)) * 88}%` }}
            />
            {stepsDetails.map((stepDetail, index) => {
              const StepIcon = stepDetail.icon;
              const isCompleted = index + 1 < step;
              const isActive = index + 1 === step;
              return (
                <div key={index} className="flex flex-col items-center w-1/4">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                      isCompleted 
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/10' 
                        : isActive 
                        ? 'bg-gradient-to-br from-cyan-600 to-teal-600 text-white scale-110 shadow-lg shadow-teal-500/20 ring-4 ring-teal-500/10'
                        : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <span className={`text-[11px] font-bold mt-2 text-center transition-colors duration-300 leading-tight ${
                    isActive ? 'text-teal-600 font-extrabold' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                    {stepDetail.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mobile Highly-Refined Stepper View */}
          <div className="block sm:hidden bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Step {step} of 4
              </span>
              <span className="text-sm font-extrabold text-teal-600 flex items-center gap-1">
                {step < 4 && React.createElement(stepsDetails[step - 1].icon, { className: "w-4 h-4 text-teal-500 inline" })}
                {stepsDetails[step - 1].title}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-600 to-teal-600 rounded-full transition-all duration-500" 
                style={{ width: `${(step / stepsDetails.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center mb-8">
          {step === 4 ? (
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20 mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-teal-500/10 mx-auto mb-4 relative">
              <UserPlus className="w-8 h-8 text-white" />
              <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {step === 4 ? 'Registration Completed!' : 'Register for Arogya AI'}
          </h2>
          <p className="text-slate-500 mt-2.5 text-sm max-w-sm mx-auto leading-relaxed">
            {step === 1 && "Start by validating your phone number. This grants you complete access to our WhatsApp and Web chatbot."}
            {step === 2 && "Help the AI know you better to deliver highly accurate health recommendations and translation support."}
            {step === 3 && "Specify your Indian pincode for localized health reports and select your preferred native language."}
            {step === 4 && "Congratulations! Your profile has been created. You can now access your health companion anytime."}
          </p>
        </div>

        {/* Dynamic Error State */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-700 text-sm mb-6 flex items-start space-x-3.5"
            >
              <span className="text-base select-none">⚠️</span>
              <span className="font-semibold">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Steps Forms with high fidelity animations */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="step-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleNextStep}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-bold text-slate-700">
                  Mobile Number
                </label>
                <div className="relative flex items-center rounded-2xl border border-slate-200 bg-white/60 focus-within:ring-4 focus-within:ring-teal-500/10 focus-within:border-teal-600 transition-all duration-300 shadow-sm">
                  {/* Country Code Prefix */}
                  <div className="flex items-center px-4 py-4 border-r border-slate-100 bg-slate-50/50 rounded-l-2xl text-slate-600 font-extrabold select-none">
                    <span className="mr-1">🇮🇳</span> +91
                  </div>
                  {/* Input Element */}
                  <div className="relative flex-1">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').substring(0, 10))}
                      placeholder="Enter 10-digit number"
                      className="w-full h-14 bg-transparent pl-12 pr-4 rounded-r-2xl text-slate-800 text-base font-semibold tracking-wider placeholder:text-slate-400 placeholder:font-normal focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Developer Tip */}
              <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex items-start space-x-3">
                <span className="text-lg select-none">💡</span>
                <p className="text-xs text-amber-800 leading-relaxed font-semibold">
                  <strong>Testing Tip:</strong> Twilio verification runs with a dynamic mock verification. Feel free to use verification code <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-900 font-mono">123456</code> during login stage!
                </p>
              </div>

              <button
                type="submit"
                disabled={phoneNumber.length < 10}
                className="w-full h-14 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-2xl font-bold shadow-lg shadow-teal-600/20 hover:shadow-xl hover:shadow-teal-600/30 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center space-x-2 text-base cursor-pointer"
              >
                <span>Continue to Profile</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form
              key="step-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleNextStep}
              className="space-y-6"
            >
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-bold text-slate-700">
                  Full Name
                </label>
                <div className="relative flex items-center rounded-2xl border border-slate-200 bg-white/60 focus-within:ring-4 focus-within:ring-teal-500/10 focus-within:border-teal-600 transition-all duration-300 shadow-sm">
                  <User className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full h-14 bg-transparent pl-12 pr-4 rounded-2xl text-slate-800 text-base font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Age and Gender Inputs (Responsive layout) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Age Input */}
                <div className="space-y-2 sm:col-span-1">
                  <label htmlFor="age" className="block text-sm font-bold text-slate-700">
                    Age
                  </label>
                  <div className="relative flex items-center rounded-2xl border border-slate-200 bg-white/60 focus-within:ring-4 focus-within:ring-teal-500/10 focus-within:border-teal-600 transition-all duration-300 shadow-sm">
                    <input
                      id="age"
                      type="number"
                      min={1}
                      max={120}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Age"
                      className="w-full h-14 bg-transparent px-4 rounded-2xl text-slate-800 text-base font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Gender Segment Controller */}
                <div className="space-y-2 sm:col-span-2">
                  <span className="block text-sm font-bold text-slate-700">
                    Gender Identity
                  </span>
                  <div className="grid grid-cols-3 gap-2.5">
                    {['male', 'female', 'other'].map((opt) => {
                      const isSelected = gender === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setGender(opt)}
                          className={`h-14 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center border capitalize cursor-pointer select-none ${
                            isSelected
                              ? 'bg-gradient-to-br from-cyan-600 to-teal-600 border-transparent text-white shadow-md shadow-teal-600/10 scale-[1.02]'
                              : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-[0.98]'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 h-14 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || !age || !gender}
                  className="flex-1 h-14 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-2xl font-bold shadow-lg shadow-teal-600/20 hover:shadow-xl disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.form>
          )}

          {step === 3 && (
            <motion.form
              key="step-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleRegister}
              className="space-y-6"
            >
              {/* Pincode with Auto Area Lookup */}
              <div className="space-y-2">
                <label htmlFor="pincode" className="block text-sm font-bold text-slate-700">
                  Indian Pincode (6 Digits)
                </label>
                <div className="relative flex items-center rounded-2xl border border-slate-200 bg-white/60 focus-within:ring-4 focus-within:ring-teal-500/10 focus-within:border-teal-600 transition-all duration-300 shadow-sm">
                  <MapPin className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    id="pincode"
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                    placeholder="Enter pincode (e.g. 110001)"
                    className="w-full h-14 bg-transparent pl-12 pr-12 rounded-2xl text-slate-800 text-base font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none"
                    required
                  />
                  {fetchingLocation && (
                    <Loader2 className="absolute right-4 w-5 h-5 text-teal-600 animate-spin" />
                  )}
                </div>
                {/* Location indicator banner */}
                <AnimatePresence>
                  {detectedLocation && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-teal-50/50 border border-teal-100/50 p-3 rounded-2xl flex items-center gap-2"
                    >
                      <span className="text-teal-600 text-sm">📍</span>
                      <p className="text-xs text-teal-900 font-bold leading-normal">
                        {detectedLocation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Native Language Grid Selection */}
              <div className="space-y-2">
                <span className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <Globe className="w-4.5 h-4.5 text-teal-500" />
                  Preferred Communication Language
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {languagesList.map((lang) => {
                    const isSelected = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setLanguage(lang.code)}
                        className={`p-3 rounded-2xl text-center transition-all duration-300 border flex flex-col items-center justify-center min-h-[75px] cursor-pointer select-none ${
                          isSelected
                            ? 'bg-gradient-to-br from-cyan-600 to-teal-600 border-transparent text-white shadow-md shadow-teal-600/10 scale-[1.02]'
                            : 'bg-white/60 border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-base font-extrabold block leading-tight">{lang.native}</span>
                        <span className={`text-[10px] mt-0.5 block ${isSelected ? 'text-white/80' : 'text-slate-400 font-semibold'}`}>
                          {lang.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 h-14 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={loading || pincode.length !== 6}
                  className="flex-1 h-14 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-2xl font-bold shadow-lg shadow-teal-600/20 hover:shadow-xl disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Details</span>
                      <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}

          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center"
            >
              <div className="p-6 bg-teal-50/50 rounded-3xl border border-teal-100/50 flex flex-col items-center">
                <Smile className="w-12 h-12 text-teal-600 mb-3 animate-bounce" />
                <h3 className="text-xl font-extrabold text-teal-900">Welcome to Arogya AI, {name}!</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-sm">
                  Your mobile number <strong className="text-slate-800 font-semibold">{phoneNumber}</strong> is officially registered. You can immediately access our AI-driven diagnosis system.
                </p>
              </div>

              {/* Navigation Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/chat"
                  className="h-14 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-2xl font-extrabold shadow-md shadow-teal-600/10 hover:shadow-lg hover:shadow-teal-600/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 text-base cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Start Web Chat</span>
                </Link>

                <a
                  href={`https://wa.me/14155238886?text=${encodeURIComponent(`नमस्ते! मैं ${name} हूँ। मुझे स्वास्थ्य मार्गदर्शन चाहिए।`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-14 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-extrabold shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5 text-base cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.306"/>
                  </svg>
                  <span>Go to WhatsApp</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Link Navigation */}
        {step < 4 && (
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Already registered?{' '}
              <Link 
                href="/sign-in" 
                className="text-teal-600 hover:text-teal-800 font-extrabold hover:underline transition-all underline-offset-4"
              >
                Log in with OTP here
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
