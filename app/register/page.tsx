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
import { registerPhoneUserAction, sendPhoneOtpAction, verifyOtpOnlyAction } from '../(login)/actions';

const languagesList = [
  { code: 'en',  name: 'English',   native: 'English'   },
  { code: 'hi',  name: 'Hindi',     native: 'हिन्दी'     },
  { code: 'od',  name: 'Odia',      native: 'ଓଡ଼ିଆ'      },
  { code: 'bn',  name: 'Bengali',   native: 'বাংলা'      },
  { code: 'ta',  name: 'Tamil',     native: 'தமிழ்'      },
  { code: 'te',  name: 'Telugu',    native: 'తెలుగు'     },
  { code: 'mr',  name: 'Marathi',   native: 'मराठी'      },
  { code: 'gu',  name: 'Gujarati',  native: 'ગુજરાતી'    },
  { code: 'kn',  name: 'Kannada',   native: 'ಕನ್ನಡ'      },
  { code: 'ml',  name: 'Malayalam', native: 'മലയാളം'     },
  { code: 'pa',  name: 'Punjabi',   native: 'ਪੰਜਾਬੀ'     },
];

const FIELD =
  'w-full h-11 bg-transparent pl-10 pr-4 rounded-xl text-slate-800 dark:text-slate-100 text-sm font-semibold ' +
  'placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal focus:outline-none';

const WRAPPER =
  'relative flex items-center rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 ' +
  'focus-within:ring-4 focus-within:ring-teal-500/10 focus-within:border-teal-500 ' +
  'transition-all duration-300 shadow-sm';

const BTN_PRIMARY =
  'flex-1 h-11 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-bold ' +
  'shadow-md shadow-teal-600/20 hover:shadow-lg hover:shadow-teal-600/30 active:scale-[0.99] ' +
  'disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 text-sm cursor-pointer';

const BTN_BACK =
  'flex-1 h-11 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold ' +
  'transition-all flex items-center justify-center gap-2 text-sm cursor-pointer';

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

  // OTP and Verification States
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [timer, setTimer] = useState(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const startTimer = (s: number) => {
    setTimer(s);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((p) => {
        if (p <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatPhone = (p: string) => {
    let c = p.replace(/\D/g, '');
    if (!c.startsWith('91') && c.length === 10) c = '91' + c;
    return c.startsWith('+') ? c : '+' + c;
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length < 10) {
      setError(t('invalidPhone', 'Please enter a valid 10-digit mobile number.'));
      return;
    }
    setLoading(true);
    try {
      const result = await sendPhoneOtpAction(formatPhone(phoneNumber), 'register');
      if (result.success) {
        setOtpStep('verify');
        startTimer(60);
      } else {
        setError(result.message || t('otpSendFailed', 'Failed to send verification code.'));
      }
    } catch {
      setError(t('connectionFailed', 'Connection failed. Please check your backend server.'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp.length < 6) {
      setError(t('enterOtp', 'Please enter the 6-digit verification code.'));
      return;
    }
    setLoading(true);
    try {
      const result = await verifyOtpOnlyAction(formatPhone(phoneNumber), otp);
      if (result.success) {
        setStep(2);
      } else {
        setError(result.message || t('invalidOtp', 'Invalid or expired OTP. Please try again.'));
      }
    } catch {
      setError(t('verifyFailed', 'Failed to verify OTP. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (step === 2) {
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
        otp,
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
    { title: t('mobileNumber', 'Mobile'), icon: Phone },
    { title: t('personalInfo', 'Profile'),  icon: User  },
    { title: t('regionLanguage', 'Region'), icon: MapPin },
    { title: t('ready', 'Done!'), icon: CheckCircle2 },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-gradient-to-tr from-slate-50 via-cyan-50/30 to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/20 text-slate-900 dark:text-slate-100 transition-colors duration-300">

      {/* ── Left panel (desktop only) ── */}
      <div className="hidden lg:flex w-[42%] shrink-0 bg-gradient-to-br from-cyan-50 via-teal-50/60 to-emerald-50/40 dark:from-slate-900 dark:via-teal-950/40 dark:to-emerald-950/30 border-r border-slate-200/70 dark:border-slate-800 flex-col justify-between p-10 xl:p-14 relative overflow-hidden select-none">
        <div className="absolute top-1/4 -left-24 w-72 h-72 rounded-full bg-gradient-to-r from-cyan-200/30 to-teal-200/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-24 w-72 h-72 rounded-full bg-gradient-to-r from-emerald-200/20 to-cyan-200/20 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">Arogya AI</span>
        </div>

        <div className="my-auto flex flex-col items-center gap-6 relative z-10">
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            src="/login_banner.png" alt="Arogya AI Health Illustration"
            className="w-full max-w-[300px] xl:max-w-[340px] h-auto object-contain rounded-3xl shadow-xl shadow-teal-500/10 dark:shadow-teal-950/25 bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-850"
          />
          <div className="text-center max-w-xs space-y-2">
            <h3 className="text-xl xl:text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">Create Your Arogya Account</h3>
            <p className="text-sm text-slate-500 dark:text-slate-450 leading-relaxed">
              Verify your mobile number to set up a clinical-grade profile. Enable secure symptom analysis and get personalized local health tips.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 relative z-10 border-t border-slate-200/70 dark:border-slate-800 pt-5 text-xs text-slate-450 dark:text-slate-500 font-semibold flex-wrap">
          <span>🔒 HIPAA Compliant</span><span>•</span><span>🛡️ Data Encrypted</span><span>•</span><span>🇮🇳 Made for India</span>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* Back button */}
        <div className="shrink-0 px-4 sm:px-8 pt-4 sm:pt-5 flex items-center">
          <Link href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-300 dark:hover:border-teal-800 hover:shadow-sm transition-all font-semibold text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>{t('backToHome', 'Back to Home')}</span>
          </Link>
        </div>

        {/* Scrollable form area */}
        <div className="flex-1 overflow-y-auto flex items-start justify-center px-4 sm:px-8 py-4">
          <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden" aria-hidden>
            <div className="absolute top-1/4 -left-24 w-64 h-64 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="absolute bottom-1/4 -right-24 w-64 h-64 rounded-full bg-emerald-300/10 blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-[0_20px_60px_rgba(13,148,136,0.08)] dark:shadow-[0_20px_60px_rgba(13,148,136,0.15)] border border-slate-200/60 dark:border-slate-800 relative z-10 my-auto"
          >
            {/* Mobile logo */}
            <div className="flex flex-col items-center lg:hidden mb-4">
              <div className="w-11 h-11 bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mb-2">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-extrabold bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">Arogya AI</span>
            </div>

            {/* ── Stepper ── */}
            <div className="mb-5">
              {/* Desktop stepper */}
              <div className="hidden sm:block">
                <div className="relative flex items-start justify-between">
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-100 dark:bg-slate-800 rounded-full" />
                  <div
                    className="absolute top-4 left-4 h-0.5 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: step === 1 ? '0%' : `calc(${((step - 1) / (steps.length - 1)) * 100}% - 8px)` }}
                  />
                  {steps.map((s, i) => {
                    const done = i + 1 < step;
                    const active = i + 1 === step;
                    return (
                      <div key={i} className="relative flex flex-col items-center" style={{ width: '25%' }}>
                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          done ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md'
                            : active ? 'bg-gradient-to-br from-cyan-600 to-teal-600 text-white shadow-md ring-4 ring-teal-500/15 scale-110'
                            : 'bg-white dark:bg-slate-900 text-slate-450 dark:text-slate-500 border-2 border-slate-200 dark:border-slate-800'
                        }`}>
                          {done ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : <span>{i + 1}</span>}
                        </div>
                        <span className={`mt-1.5 text-[10px] font-bold text-center leading-tight px-0.5 ${
                          active ? 'text-teal-600 dark:text-teal-400' : done ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-450 dark:text-slate-500'
                        }`}>{s.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile stepper — fixed: dots + single progress bar */}
              <div className="sm:hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {steps.map((_, i) => {
                      const done = i + 1 < step;
                      const active = i + 1 === step;
                      return (
                        <div key={i} className={`rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                          active ? 'w-7 h-7 bg-gradient-to-br from-cyan-600 to-teal-600 text-white text-xs ring-2 ring-teal-500/20 scale-110'
                            : done ? 'w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xs'
                            : 'w-6 h-6 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs'
                        }`}>
                          {done ? (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : i + 1}
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-xs font-extrabold text-teal-600">{steps[step - 1].title}</span>
                </div>
                {/* Single clean progress bar — no overflow issues */}
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <div
                    className="h-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${(step / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* ── Step header ── */}
            <div className="text-center mb-4">
              {step === 4 ? (
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 mx-auto mb-3 animate-bounce">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
              ) : (
                <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-md mx-auto mb-3">
                  <UserPlus className="w-6 h-6 text-white" />
                  <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                </div>
              )}
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {step === 4 ? t('registrationComplete', 'Registration Complete!') : t('registerTitle', 'Register for Arogya AI')}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs max-w-xs mx-auto leading-relaxed">
                {step === 1 && t('step1Hint', 'Validate your phone number to access our WhatsApp and Web chatbot.')}
                {step === 2 && t('step2Hint', 'Help the AI know you better for accurate health recommendations.')}
                {step === 3 && t('step3Hint', 'Enter your pincode for local health alerts and pick your language.')}
                {step === 4 && t('step4Hint', 'Your profile is ready. Access your health companion anytime.')}
              </p>
            </div>

            {/* Error alert */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-3 rounded-xl text-rose-700 dark:text-rose-300 text-xs mb-4 flex items-start gap-2 break-words overflow-hidden">
                  <span className="select-none">⚠️</span>
                  <span className="font-semibold flex-1 min-w-0">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Step forms ── */}
            <AnimatePresence mode="wait">

              {/* STEP 1 — Phone & OTP Verification */}
              {step === 1 && (
                <motion.form 
                  key="s1" 
                  initial={{ opacity: 0, y: 8 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -8 }}
                  onSubmit={otpStep === 'request' ? handleSendOtp : handleVerifyOtp} 
                  className="space-y-4"
                >
                  {otpStep === 'request' ? (
                    <>
                      <div className="space-y-1.5">
                        <label htmlFor="phone" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          {t('mobileNumber', 'Mobile Number')}
                        </label>
                        <div className={WRAPPER}>
                          <div className="flex items-center px-3 border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-l-xl text-slate-600 dark:text-slate-450 font-extrabold select-none shrink-0 text-xs h-11">
                            🇮🇳 +91
                          </div>
                          <div className="relative flex-1">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input id="phone" type="tel" value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').substring(0, 10))}
                              placeholder={t('phonePlaceholder', 'Enter 10-digit number')}
                              className={FIELD} required />
                          </div>
                        </div>
                      </div>
                      <button type="submit" disabled={loading || phoneNumber.length < 10} className={BTN_PRIMARY + ' w-full'}>
                        {loading ? (
                          <><Loader2 className="animate-spin w-4 h-4" /><span>{t('sendingCode', 'Sending code...')}</span></>
                        ) : (
                          <><span>{t('getVerificationCode', 'Get Verification Code')}</span><ArrowRight className="w-4 h-4" /></>
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1.5">
                        <label htmlFor="otp" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          {t('otpCode', '6-Digit OTP Code')}
                        </label>
                        <div className={WRAPPER}>
                          <input id="otp" type="text" inputMode="numeric" pattern="\d*" maxLength={6}
                            value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                            placeholder={t('otpPlaceholder', 'Enter 6-digit code')}
                            className={FIELD + ' tracking-[0.3em] font-bold pl-4'} required />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <button type="button" onClick={() => setOtpStep('request')}
                          className="text-slate-555 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-1 font-medium cursor-pointer">
                          <ArrowLeft className="w-3.5 h-3.5" /><span>{t('changeNumber', 'Change Number')}</span>
                        </button>
                        {timer > 0 ? (
                          <span className="text-slate-400 dark:text-slate-500 font-medium">
                            {t('resendIn', 'Resend in')} <strong className="text-teal-600 dark:text-teal-400 font-bold">{timer}s</strong>
                          </span>
                        ) : (
                          <button type="button" onClick={() => handleSendOtp()} disabled={loading}
                            className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-350 font-semibold underline underline-offset-4 cursor-pointer">
                            {t('resendCode', 'Resend Code')}
                          </button>
                        )}
                      </div>
                      <button type="submit" disabled={loading || otp.length < 6} className={BTN_PRIMARY + ' w-full'}>
                        {loading ? (
                          <><Loader2 className="animate-spin w-4 h-4" /><span>{t('verifying', 'Verifying...')}</span></>
                        ) : (
                          <><span>{t('verifyAndContinue', 'Verify & Continue')}</span><ArrowRight className="w-4 h-4" /></>
                        )}
                      </button>
                    </>
                  )}
                </motion.form>
              )}

              {/* STEP 2 — Personal Info */}
              {step === 2 && (
                <motion.form key="s2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  onSubmit={handleNext} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t('fullName', 'Full Name')}</label>
                    <div className={`${WRAPPER} relative`}>
                      <User className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                        placeholder={t('namePlaceholder', 'Enter your name')} className={FIELD} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <label htmlFor="age" className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t('age', 'Age')}</label>
                      <div className={WRAPPER}>
                        <input id="age" type="number" min={1} max={120} value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="Age"
                          className="w-full h-11 bg-transparent px-3 rounded-xl text-slate-800 dark:text-slate-100 text-sm font-semibold placeholder:text-slate-400 focus:outline-none"
                          required />
                      </div>
                    </div>
                    <div className="col-span-3 space-y-1.5">
                      <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t('gender', 'Gender')}</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(['male', 'female', 'other'] as const).map((opt) => (
                          <button key={opt} type="button" onClick={() => setGender(opt)}
                            className={`h-11 rounded-xl font-bold text-xs transition-all duration-200 flex items-center justify-center border capitalize cursor-pointer select-none ${
                              gender === opt
                                ? 'bg-gradient-to-br from-cyan-600 to-teal-600 border-transparent text-white shadow-sm scale-[1.02]'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                            }`}>
                            {t(opt, opt)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => { setError(''); setStep(1); }} className={BTN_BACK}>
                      <ArrowLeft className="w-4 h-4" /><span>{t('back', 'Back')}</span>
                    </button>
                    <button type="submit" disabled={!name.trim() || !age || !gender} className={BTN_PRIMARY}>
                      <span>{t('continue', 'Continue')}</span><ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.form>
              )}

              {/* STEP 3 — Region & Language */}
              {step === 3 && (
                <motion.form key="s3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="pincode" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {t('pincode', 'Indian Pincode (6 Digits)')}
                    </label>
                    <div className={`${WRAPPER} relative`}>
                      <MapPin className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input id="pincode" type="text" maxLength={6} value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                        placeholder={t('pincodePlaceholder', 'e.g. 110001')}
                        className={FIELD} required />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <Globe className="w-3.5 h-3.5 text-teal-500" />
                      {t('preferredLanguage', 'Preferred Language')}
                    </span>
                    <div className="grid grid-cols-3 gap-2 max-h-[160px] overflow-y-auto pr-0.5">
                      {languagesList.map((lang) => {
                        const sel = language === lang.code;
                        return (
                          <button key={lang.code} type="button" onClick={() => setLanguage(lang.code)}
                            className={`p-2 rounded-xl text-center transition-all duration-200 border flex flex-col items-center justify-center min-h-[56px] cursor-pointer select-none ${
                              sel
                                ? 'bg-gradient-to-br from-cyan-600 to-teal-600 border-transparent text-white shadow-sm scale-[1.02]'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-teal-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                            }`}>
                            <span className="text-sm font-extrabold block leading-tight">{lang.native}</span>
                            <span className={`text-[9px] mt-0.5 block ${sel ? 'text-white/80' : 'text-slate-400 dark:text-slate-500 font-semibold'}`}>
                              {lang.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => { setError(''); setStep(2); }} className={BTN_BACK}>
                      <ArrowLeft className="w-4 h-4" /><span>{t('back', 'Back')}</span>
                    </button>
                    <button type="submit" disabled={loading || pincode.length !== 6} className={BTN_PRIMARY}>
                      {loading ? (
                        <><Loader2 className="animate-spin w-4 h-4" /><span>{t('registering', 'Registering...')}</span></>
                      ) : (
                        <><span>{t('submitDetails', 'Submit Details')}</span><CheckCircle2 className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* STEP 4 — Success */}
              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4 text-center">
                  <div className="p-5 bg-teal-50 dark:bg-teal-950/20 rounded-2xl border border-teal-100 dark:border-teal-900/30 flex flex-col items-center">
                    <Smile className="w-10 h-10 text-teal-600 dark:text-teal-450 mb-2 animate-bounce" />
                    <h3 className="text-lg font-extrabold text-teal-900 dark:text-teal-400">
                      {t('welcomeUser', 'Welcome to Arogya AI')}, {name}!
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-350 mt-1.5 leading-relaxed max-w-xs">
                      {t('successMessage', 'Your number')} <strong className="text-slate-800 dark:text-white">{phoneNumber}</strong>{' '}
                      {t('successMessageSuffix', 'is registered. You can now access AI health guidance.')}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link href="/chat"
                      className="h-11 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-extrabold shadow-md shadow-teal-600/10 hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm cursor-pointer">
                      <MessageSquare className="w-4 h-4" />
                      <span>{t('startWebChat', 'Start Web Chat')}</span>
                    </Link>
                    <a href={`https://wa.me/14155238886?text=${encodeURIComponent(`नमस्ते! मैं ${name} हूँ। मुझे स्वास्थ्य मार्गदर्शन चाहिए।`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="h-11 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-extrabold shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm cursor-pointer">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.306"/>
                      </svg>
                      <span>{t('openWhatsApp', 'Open WhatsApp')}</span>
                    </a>
                  </div>
                  <Link href="/sign-in"
                    className="block text-center text-sm text-teal-600 hover:text-teal-800 font-bold hover:underline underline-offset-4 transition-all">
                    {t('goToSignIn', '→ Sign in to your account')}
                  </Link>
                </motion.div>
              )}

            </AnimatePresence>

            {/* ── Footer: sign-in link (steps 1–3 only) ── */}
            {step < 4 && (
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-sm text-slate-550 dark:text-slate-400">
                  {t('alreadyRegistered', 'Already registered?')}{' '}
                  <Link
                    href="/sign-in"
                    className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-bold hover:underline underline-offset-4 transition-all"
                  >
                    {t('signInHere', 'Sign in here')}
                  </Link>
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
