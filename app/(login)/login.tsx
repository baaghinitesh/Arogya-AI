'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n';
import {
  Phone, Key, ArrowRight, ArrowLeft,
  ShieldCheck, Loader2, CheckCircle2,
} from 'lucide-react';
import { sendPhoneOtpAction, verifyPhoneOtpAction } from './actions';

const WRAPPER =
  'relative flex items-center rounded-2xl border border-slate-200 bg-white ' +
  'focus-within:ring-4 focus-within:ring-teal-500/10 focus-within:border-teal-500 ' +
  'transition-all duration-300 shadow-sm';

const FIELD =
  'w-full h-12 bg-transparent pl-12 pr-4 rounded-2xl text-slate-800 text-base font-semibold ' +
  'placeholder:text-slate-400 placeholder:font-normal focus:outline-none';

const BTN =
  'w-full h-12 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-2xl font-bold ' +
  'shadow-lg shadow-teal-600/20 hover:shadow-xl hover:shadow-teal-600/30 active:scale-[0.99] ' +
  'disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 text-base cursor-pointer';

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = (s: number) => {
    setTimer(s);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((p) => { if (p <= 1) { clearInterval(timerRef.current!); return 0; } return p - 1; });
    }, 1000);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const getFormattedPhone = () => {
    let c = phoneNumber.replace(/\D/g, '');
    if (!c.startsWith('91') && c.length === 10) c = '91' + c;
    return c.startsWith('+') ? c : '+' + c;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (phoneNumber.replace(/\D/g, '').length < 10) {
      setError(t('invalidPhone', 'Please enter a valid 10-digit mobile number.')); return;
    }
    setLoading(true);
    try {
      const result = await sendPhoneOtpAction(getFormattedPhone());
      if (result.success) {
        setSuccess(result.message || t('otpSent', 'OTP sent successfully!'));
        setStep('otp');
        startTimer(60);
      } else {
        setError(result.message || t('notRegistered', 'Phone number is not registered. Please sign up first.'));
      }
    } catch {
      setError(t('connectionFailed', 'Connection failed. Please check your internet connection.'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp.length < 6) { setError(t('enterOtp', 'Please enter the 6-digit verification code.')); return; }
    setLoading(true);
    try {
      const result = await verifyPhoneOtpAction(getFormattedPhone(), otp);
      if (result.success) {
        setSuccess(t('authSuccess', 'Successfully authenticated!'));
        setTimeout(() => { router.push(redirect); router.refresh(); }, 900);
      } else {
        setError(result.message || t('invalidOtp', 'Invalid or expired OTP. Please try again.'));
      }
    } catch {
      setError(t('verifyFailed', 'Failed to verify OTP. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || loading) return;
    setError(''); setSuccess(''); setLoading(true);
    try {
      const result = await sendPhoneOtpAction(getFormattedPhone());
      if (result.success) { setSuccess(t('otpResent', 'A new OTP has been sent.')); startTimer(60); setOtp(''); }
      else setError(result.message || t('resendFailed', 'Failed to resend OTP.'));
    } catch {
      setError(t('connectionFailed', 'Connection error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-gradient-to-tr from-slate-50 via-cyan-50/30 to-teal-50/30">

      {/* ── Left panel: illustration (desktop only) ── */}
      <div className="hidden lg:flex w-[42%] shrink-0 bg-gradient-to-br from-cyan-50 via-teal-50/60 to-emerald-50/40 border-r border-slate-200/70 flex-col justify-between p-10 xl:p-14 relative overflow-hidden select-none">
        {/* Decorative blobs */}
        <div className="absolute top-1/4 -left-24 w-72 h-72 rounded-full bg-gradient-to-r from-cyan-200/30 to-teal-200/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-24 w-72 h-72 rounded-full bg-gradient-to-r from-emerald-200/20 to-cyan-200/20 blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
            Arogya AI
          </span>
        </div>

        {/* Illustration + copy */}
        <div className="my-auto flex flex-col items-center gap-6 relative z-10">
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            src="/login_banner.png"
            alt="Arogya AI Health Illustration"
            className="w-full max-w-[300px] xl:max-w-[340px] h-auto object-contain rounded-3xl shadow-xl shadow-teal-500/10 bg-white p-4 border border-slate-100"
          />
          <div className="text-center max-w-xs space-y-2">
            <h3 className="text-xl xl:text-2xl font-extrabold text-slate-800 leading-tight">
              Secure Medical Records &amp; 24/7 Support
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Verify your mobile number to access personalized symptom analysis, diagnostic guidance, and instant WhatsApp syncing.
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 relative z-10 border-t border-slate-200/70 pt-5 text-xs text-slate-400 font-semibold flex-wrap">
          <span>🔒 HIPAA Compliant</span>
          <span>•</span>
          <span>🛡️ Data Encrypted</span>
          <span>•</span>
          <span>🇮🇳 Made for India</span>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* Back button — top-left, always visible */}
        <div className="shrink-0 px-4 sm:px-8 pt-4 sm:pt-6 flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-300 hover:shadow-sm transition-all font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('backToHome', 'Back to Home')}</span>
          </Link>
        </div>

        {/* Centered form area */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-4 overflow-hidden">
          {/* Ambient blobs (mobile) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden" aria-hidden>
            <div className="absolute top-1/4 -left-24 w-64 h-64 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="absolute bottom-1/4 -right-24 w-64 h-64 rounded-full bg-emerald-300/10 blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(13,148,136,0.08)] border border-slate-200/60 relative z-10"
          >
            {/* Mobile logo */}
            <div className="flex flex-col items-center lg:hidden mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mb-3">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Arogya AI
              </span>
            </div>

            {/* Heading */}
            <div className="mb-5 space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight">
                {step === 'phone' ? t('welcomeBack', 'Welcome Back') : t('enterCode', 'Verification Code')}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                {step === 'phone'
                  ? t('signInSubtitle', 'Verify your mobile number to sign in safely.')
                  : `${t('otpSentTo', 'Enter the 6-digit code sent to')} ${phoneNumber}`}
              </p>
            </div>

            {/* Alerts */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div key="err" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="bg-rose-50 border border-rose-100 p-3 rounded-2xl text-rose-700 text-sm mb-4 flex items-start gap-2">
                  <span className="font-bold select-none">⚠️</span><span>{error}</span>
                </motion.div>
              )}
              {success && (
                <motion.div key="ok" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl text-emerald-700 text-sm mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forms */}
            <AnimatePresence mode="wait">
              {step === 'phone' ? (
                <motion.form key="phone" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleSendOtp} className="space-y-5">
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="block text-sm font-bold text-slate-700">
                      {t('mobileNumber', 'Mobile Number')}
                    </label>
                    <div className={WRAPPER}>
                      <div className="flex items-center px-3 py-3 border-r border-slate-100 bg-slate-50 rounded-l-2xl text-slate-600 font-extrabold select-none shrink-0 text-sm">
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
                  <button type="submit" disabled={loading || phoneNumber.length < 10} className={BTN}>
                    {loading
                      ? <><Loader2 className="animate-spin w-4 h-4" /><span>{t('sendingCode', 'Sending code...')}</span></>
                      : <><span>{t('getVerificationCode', 'Get Verification Code')}</span><ArrowRight className="w-4 h-4" /></>}
                  </button>
                </motion.form>
              ) : (
                <motion.form key="otp" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="space-y-1.5">
                    <label htmlFor="otp" className="block text-sm font-bold text-slate-700">
                      {t('otpCode', '6-Digit OTP Code')}
                    </label>
                    <div className={WRAPPER}>
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input id="otp" type="text" inputMode="numeric" pattern="\d*" maxLength={6}
                        value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                        placeholder={t('otpPlaceholder', 'Enter 6-digit code')}
                        className={FIELD + ' tracking-[0.3em] font-bold'} required />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <button type="button" onClick={() => setStep('phone')}
                      className="text-slate-500 hover:text-teal-600 transition-colors flex items-center gap-1 font-medium cursor-pointer">
                      <ArrowLeft className="w-4 h-4" /><span>{t('changeNumber', 'Change Number')}</span>
                    </button>
                    {timer > 0 ? (
                      <span className="text-slate-400 font-medium">
                        {t('resendIn', 'Resend in')} <strong className="text-teal-600 font-bold">{timer}s</strong>
                      </span>
                    ) : (
                      <button type="button" onClick={handleResend} disabled={loading}
                        className="text-teal-600 hover:text-teal-800 font-semibold underline underline-offset-4 cursor-pointer">
                        {t('resendCode', 'Resend Code')}
                      </button>
                    )}
                  </div>
                  <button type="submit" disabled={loading || otp.length < 6} className={BTN}>
                    {loading
                      ? <><Loader2 className="animate-spin w-4 h-4" /><span>{t('verifying', 'Verifying...')}</span></>
                      : <><span>{t('verifyLogin', 'Verify & Login')}</span><ArrowRight className="w-4 h-4" /></>}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                {step === 'phone' ? (
                  <>
                    {t('newToArogya', 'New to Arogya AI?')}{' '}
                    <Link href="/register" className="text-teal-600 hover:text-teal-800 font-bold hover:underline transition-all underline-offset-4">
                      {t('registerMobile', 'Register mobile here')}
                    </Link>
                  </>
                ) : (
                  <>
                    {t('havingTrouble', 'Having trouble? Contact')}{' '}
                    <Link href="/contact" className="text-teal-600 font-bold hover:underline transition-all">
                      {t('supportTeam', 'Support Team')}
                    </Link>
                  </>
                )}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
