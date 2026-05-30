'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n';
import {
  UserPlus, Phone, User, MapPin, CheckCircle2,
  ArrowRight, ArrowLeft, Loader2, Smile, MessageSquare,
  Globe, Sparkles,
} from 'lucide-react';
import { registerPhoneUserAction } from '../(login)/actions';

const languagesList = [
  { code: 'en',  name: 'English',   native: 'English'    },
  { code: 'hi',  name: 'Hindi',     native: 'हिन्दी'      },
  { code: 'od',  name: 'Odia',      native: 'ଓଡ଼ିଆ'       },
  { code: 'bn',  name: 'Bengali',   native: 'বাংলা'       },
  { code: 'ta',  name: 'Tamil',     native: 'தமிழ்'       },
  { code: 'te',  name: 'Telugu',    native: 'తెలుగు'      },
  { code: 'mr',  name: 'Marathi',   native: 'मराठी'       },
  { code: 'gu',  name: 'Gujarati',  native: 'ગુજરાતી'     },
  { code: 'kn',  name: 'Kannada',   native: 'ಕನ್ನಡ'       },
  { code: 'ml',  name: 'Malayalam', native: 'മലയാളം'      },
  { code: 'pa',  name: 'Punjabi',   native: 'ਪੰਜਾਬੀ'      },
];

const FIELD =
  'w-full h-14 bg-transparent pl-12 pr-4 rounded-2xl text-slate-800 text-base font-semibold ' +
  'placeholder:text-slate-400 placeholder:font-normal focus:outline-none';

const WRAPPER =
  'relative flex items-center rounded-2xl border border-slate-200 bg-white/70 ' +
  'focus-within:ring-4 focus-within:ring-teal-500/10 focus-within:border-teal-600 ' +
  'transition-all duration-300 shadow-sm';

const BTN_PRIMARY =
  'flex-1 h-14 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-2xl font-bold ' +
  'shadow-lg shadow-teal-600/20 hover:shadow-xl hover:shadow-teal-600/30 active:scale-[0.99] ' +
  'disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer';

const BTN_BACK =
  'flex-1 h-14 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold ' +
  'transition-all flex items-center justify-center gap-2 cursor-pointer';

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [pincode, setPincode] = useState('');
  const [language, setLanguage] = useState('en');
  const [detectedLocation, setDetectedLocation] = useState('');
  const [fetchingLocation, setFetchingLocation] = useState(false);

  useEffect(() => {
    if (pincode.length !== 6) { setDetectedLocation(''); return; }
    setFetchingLocation(true);
    setDetectedLocation('');
    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      .then((r) => r.json())
      .then((data) => {
        if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          setDetectedLocation(`${po.Name}, ${po.District}, ${po.State}`);
        } else {
          setDetectedLocation(t('pincodeNotFound', 'Pincode valid, area not found.'));
        }
      })
      .catch(() => setDetectedLocation(t('locationUnavailable', 'Location lookup unavailable.')))
      .finally(() => setFetchingLocation(false));
  }, [pincode]);

  const formatPhone = (p: string) => {
    let c = p.replace(/\D/g, '');
    if (!c.startsWith('91') && c.length === 10) c = '91' + c;
    return c.startsWith('+') ? c : '+' + c;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (step === 1) {
      if (phoneNumber.replace(/\D/g, '').length < 10) {
        setError(t('invalidPhone', 'Please enter a valid 10-digit mobile number.')); return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!name.trim()) { setError(t('nameRequired', 'Please enter your full name.')); return; }
      const a = parseInt(age);
      if (!age || isNaN(a) || a < 1 || a > 120) { setError(t('invalidAge', 'Please enter a valid age (1–120).')); return; }
      if (!gender) { setError(t('genderRequired', 'Please select your gender.')); return; }
      setStep(3);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (pincode.replace(/\D/g, '').length !== 6) {
      setError(t('invalidPincode', 'Please enter a valid 6-digit Indian pincode.')); return;
    }
    setLoading(true);
    try {
      const result = await registerPhoneUserAction({
        phone_number: formatPhone(phoneNumber),
        name: name.trim(),
        age: parseInt(age),
        gender,
        pincode,
        language,
      });
      if (result.success) setStep(4);
      else setError(result.message || t('registrationFailed', 'Registration failed. Number may already be registered.'));
    } catch {
      setError(t('connectionFailed', 'Connection failed. Please check your backend server.'));
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: t('mobileNumber', 'Mobile Number'), icon: Phone },
    { title: t('personalInfo', 'Personal Info'),  icon: User  },
    { title: t('regionLanguage', 'Region & Language'), icon: MapPin },
    { title: t('ready', 'Ready!'), icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-gradient-to-tr from-slate-50 via-cyan-50/20 to-teal-50/20 dark:from-gray-950 dark:via-cyan-950/20 dark:to-teal-950/30 relative overflow-hidden">

      {/* Left Column: Premium Illustration & Features (Hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-cyan-50/40 via-teal-50/30 to-emerald-50/20 border-r border-slate-200/60 dark:border-gray-800/40 flex-col justify-between p-12 relative overflow-hidden select-none">
        {/* Decorative blobs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-cyan-200/20 to-teal-200/20 blur-3xl" />
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
            Arogya AI
          </span>
        </div>

        {/* Feature Image & Marketing Text */}
        <div className="my-auto space-y-8 relative z-10 flex flex-col items-center">
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            src="/login_banner.png"
            alt="Arogya AI Health Illustration"
            className="w-full max-w-[340px] h-auto object-contain rounded-3xl shadow-xl shadow-teal-500/5 bg-white p-4 border border-slate-100"
          />
          <div className="text-center max-w-sm space-y-3">
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
              Create Your Arogya Account
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Verify your mobile number to set up a clinical-grade profile. Enable secure symptom analysis and get personalized local health tips.
            </p>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-6 relative z-10 border-t border-slate-200/60 dark:border-gray-800 pt-6 text-xs text-slate-400 dark:text-slate-500 font-semibold">
          <span>🔒 HIPAA Compliant</span>
          <span>•</span>
          <span>🛡️ Data Encrypted</span>
          <span>•</span>
          <span>🇮🇳 Made for India</span>
        </div>
      </div>

      {/* Right Column: Forms Panel / Wizard Panel */}
      <div className="col-span-1 lg:col-span-7 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10 overflow-y-auto min-h-screen">
        
        {/* Top Left Navigation Back Button (Inside Right Column to prevent left overlaps) */}
        <div className="absolute top-6 left-6 z-20">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-slate-200/60 dark:border-gray-700/60 text-slate-600 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:shadow-md hover:scale-[1.02] transition-all font-semibold text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('backToHome', 'Back to Home')}</span>
          </Link>
        </div>
        
        {/* Ambient background blur blobs on mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden" aria-hidden>
          <div className="absolute top-1/4 -left-32 w-80 h-80 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-emerald-300/10 blur-3xl" />
        </div>

        <div className="w-full max-w-xl bg-white/80 dark:bg-gray-900/85 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-[0_32px_80px_rgba(13,148,136,0.06)] border border-slate-200/50 dark:border-gray-800/60">
          {/* Logo only on mobile */}
          <div className="flex flex-col items-center lg:hidden mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Arogya AI
            </h2>
          </div>

          {/* ── Stepper ── */}
          <div className="px-0 sm:px-6 pt-2 pb-0">
            {/* Desktop stepper */}
            <div className="hidden sm:block">
              <div className="relative flex items-start justify-between">
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-slate-100 rounded-full" />
                <div
                  className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: step === 1 ? '0%' : `calc(${((step - 1) / (steps.length - 1)) * 100}% - 10px)` }}
                />
                {steps.map((s, i) => {
                  const done = i + 1 < step;
                  const active = i + 1 === step;
                  return (
                    <div key={i} className="relative flex flex-col items-center" style={{ width: '25%' }}>
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-400 ${
                        done
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                          : active
                          ? 'bg-gradient-to-br from-cyan-600 to-teal-600 text-white shadow-lg shadow-teal-500/30 ring-4 ring-teal-500/15 scale-110'
                          : 'bg-white text-slate-400 border-2 border-slate-200'
                      }`}>
                        {done ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span>{i + 1}</span>
                        )}
                      </div>
                      <span className={`mt-2.5 text-[11px] font-bold text-center leading-tight px-1 ${
                        active ? 'text-teal-600' : done ? 'text-emerald-600' : 'text-slate-400'
                      }`}>
                        {s.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile stepper */}
            <div className="sm:hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {steps.map((s, i) => {
                    const done = i + 1 < step;
                    const active = i + 1 === step;
                    return (
                      <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        done
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white'
                          : active
                          ? 'bg-gradient-to-br from-cyan-600 to-teal-600 text-white ring-2 ring-teal-500/20 scale-110'
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {done ? (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          i + 1
                        )}
                      </div>
                    );
                  })}
                </div>
                <span className="text-sm font-extrabold text-teal-600">{steps[step - 1].title}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-600 to-teal-600 rounded-full transition-all duration-500"
                  style={{ width: `${(step / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* ── Card body ── */}
          <div className="px-0 sm:px-6 pt-8 pb-4">
            
            {/* Header */}
            <div className="text-center mb-8">
              {step === 4 ? (
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20 mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
              ) : (
                <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-teal-500/10 mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-white" />
                  <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                </div>
              )}
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {step === 4 ? t('registrationComplete', 'Registration Complete!') : t('registerTitle', 'Register for Arogya AI')}
              </h2>
              <p className="text-slate-500 mt-2 text-sm max-w-sm mx-auto leading-relaxed">
                {step === 1 && t('step1Hint', 'Validate your phone number to access our WhatsApp and Web chatbot.')}
                {step === 2 && t('step2Hint', 'Help the AI know you better for accurate health recommendations.')}
                {step === 3 && t('step3Hint', 'Enter your pincode for local health alerts and pick your language.')}
                {step === 4 && t('step4Hint', 'Your profile is ready. Access your health companion anytime.')}
              </p>
            </div>

            {/* Error alerts */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-700 text-sm mb-6 flex items-start gap-3">
                  <span className="text-base select-none">⚠️</span>
                  <span className="font-semibold">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Steps Forms */}
            <AnimatePresence mode="wait">
              
              {/* STEP 1 — Phone */}
              {step === 1 && (
                <motion.form key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleNext} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-bold text-slate-700">
                      {t('mobileNumber', 'Mobile Number')}
                    </label>
                    <div className={WRAPPER}>
                      <div className="flex items-center px-4 py-4 border-r border-slate-100 bg-slate-50/60 rounded-l-2xl text-slate-600 font-extrabold select-none shrink-0">
                        🇮🇳 +91
                      </div>
                      <div className="relative flex-1">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input id="phone" type="tel" value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').substring(0, 10))}
                          placeholder={t('phonePlaceholder', 'Enter 10-digit number')}
                          className={FIELD} required />
                      </div>
                    </div>
                  </div>
                  <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
                    <span className="text-lg select-none">💡</span>
                    <p className="text-xs text-amber-800 leading-relaxed font-semibold">
                      {t('devTip', 'Testing? Use verification code')} <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900">123456</code> {t('devTipSuffix', 'at login.')}
                    </p>
                  </div>
                  <button type="submit" disabled={phoneNumber.length < 10} className={BTN_PRIMARY + ' w-full'}>
                    <span>{t('continueToProfile', 'Continue to Profile')}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.form>
              )}

              {/* STEP 2 — Personal Info */}
              {step === 2 && (
                <motion.form key="s2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleNext} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-bold text-slate-700">{t('fullName', 'Full Name')}</label>
                    <div className={`${WRAPPER} relative`}>
                      <User className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                      <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                        placeholder={t('namePlaceholder', 'Enter your name')} className={FIELD} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <label htmlFor="age" className="block text-sm font-bold text-slate-700">{t('age', 'Age')}</label>
                      <div className={WRAPPER}>
                        <input id="age" type="number" min={1} max={120} value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder={t('agePlaceholder', 'Age')}
                          className="w-full h-14 bg-transparent px-4 rounded-2xl text-slate-800 text-base font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none"
                          required />
                      </div>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <span className="block text-sm font-bold text-slate-700">{t('gender', 'Gender')}</span>
                      <div className="grid grid-cols-3 gap-2.5">
                        {(['male', 'female', 'other'] as const).map((opt) => (
                          <button key={opt} type="button" onClick={() => setGender(opt)}
                            className={`h-14 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center border capitalize cursor-pointer select-none ${
                              gender === opt
                                ? 'bg-gradient-to-br from-cyan-600 to-teal-600 border-transparent text-white shadow-md shadow-teal-600/10 scale-[1.02]'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-[0.98]'
                            }`}>
                            {t(opt, opt)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-1">
                    <button type="button" onClick={() => { setError(''); setStep(1); }} className={BTN_BACK}>
                      <ArrowLeft className="w-5 h-5" /><span>{t('back', 'Back')}</span>
                    </button>
                    <button type="submit" disabled={!name.trim() || !age || !gender} className={BTN_PRIMARY}>
                      <span>{t('continue', 'Continue')}</span><ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.form>
              )}

              {/* STEP 3 — Region & Language */}
              {step === 3 && (
                <motion.form key="s3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="pincode" className="block text-sm font-bold text-slate-700">
                      {t('pincode', 'Indian Pincode (6 Digits)')}
                    </label>
                    <div className={`${WRAPPER} relative`}>
                      <MapPin className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                      <input id="pincode" type="text" maxLength={6} value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                        placeholder={t('pincodePlaceholder', 'e.g. 110001')}
                        className={FIELD + ' pr-12'} required />
                      {fetchingLocation && (
                        <Loader2 className="absolute right-4 w-5 h-5 text-teal-600 animate-spin" />
                      )}
                    </div>
                    <AnimatePresence>
                      {detectedLocation && (
                        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                          className="bg-teal-50/60 border border-teal-100 p-3 rounded-2xl flex items-center gap-2">
                          <span className="text-teal-600 text-sm">📍</span>
                          <p className="text-xs text-teal-900 font-bold">{detectedLocation}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                      <Globe className="w-4 h-4 text-teal-500" />
                      {t('preferredLanguage', 'Preferred Language')}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {languagesList.map((lang) => {
                        const sel = language === lang.code;
                        return (
                          <button key={lang.code} type="button" onClick={() => setLanguage(lang.code)}
                            className={`p-3 rounded-2xl text-center transition-all duration-300 border flex flex-col items-center justify-center min-h-[72px] cursor-pointer select-none ${
                              sel
                                ? 'bg-gradient-to-br from-cyan-600 to-teal-600 border-transparent text-white shadow-md shadow-teal-600/10 scale-[1.02]'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-slate-50'
                            }`}>
                            <span className="text-base font-extrabold block leading-tight">{lang.native}</span>
                            <span className={`text-[10px] mt-0.5 block ${sel ? 'text-white/80' : 'text-slate-400 font-semibold'}`}>
                              {lang.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-1">
                    <button type="button" onClick={() => { setError(''); setStep(2); }} className={BTN_BACK}>
                      <ArrowLeft className="w-5 h-5" /><span>{t('back', 'Back')}</span>
                    </button>
                    <button type="submit" disabled={loading || pincode.length !== 6} className={BTN_PRIMARY}>
                      {loading ? (
                        <><Loader2 className="animate-spin w-5 h-5" /><span>{t('registering', 'Registering...')}</span></>
                      ) : (
                        <><span>{t('submitDetails', 'Submit Details')}</span><CheckCircle2 className="w-5 h-5" /></>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* STEP 4 — Success */}
              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center">
                  <div className="p-6 bg-teal-50/60 rounded-3xl border border-teal-100 flex flex-col items-center">
                    <Smile className="w-12 h-12 text-teal-600 mb-3 animate-bounce" />
                    <h3 className="text-xl font-extrabold text-teal-900">
                      {t('welcomeUser', 'Welcome to Arogya AI')}, {name}!
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-sm">
                      {t('successMessage', 'Your number')} <strong className="text-slate-800">{phoneNumber}</strong>{' '}
                      {t('successMessageSuffix', 'is registered. You can now access AI health guidance.')}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/chat"
                      className="h-14 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-2xl font-extrabold shadow-md shadow-teal-600/10 hover:shadow-lg hover:shadow-teal-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-base cursor-pointer">
                      <MessageSquare className="w-5 h-5" />
                      <span>{t('startWebChat', 'Start Web Chat')}</span>
                    </Link>
                    <a href={`https://wa.me/14155238886?text=${encodeURIComponent(`नमस्ते! मैं ${name} हूँ। मुझे स्वास्थ्य मार्गदर्शन चाहिए।`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="h-14 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-extrabold shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 text-base cursor-pointer">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.306"/>
                      </svg>
                      <span>{t('goToWhatsApp', 'Go to WhatsApp')}</span>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            {step < 4 && (
              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500 font-medium">
                  {t('alreadyRegistered', 'Already registered?')}{' '}
                  <Link href="/sign-in" className="text-teal-600 hover:text-teal-800 font-extrabold hover:underline transition-all underline-offset-4">
                    {t('loginHere', 'Log in with OTP here')}
                  </Link>
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}


