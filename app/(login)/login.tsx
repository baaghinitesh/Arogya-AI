'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  PhoneIcon, 
  KeyIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon,
  ShieldCheckIcon,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { sendPhoneOtpAction, verifyPhoneOtpAction } from './actions';

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  
  // State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Focus management
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Start timer countdown
  const startTimer = (seconds: number) => {
    setTimer(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Format phone number to clean string
  const getFormattedPhone = () => {
    let clean = phoneNumber.replace(/\D/g, '');
    if (!clean.startsWith('91') && clean.length === 10) {
      clean = '91' + clean;
    }
    if (!clean.startsWith('+')) {
      clean = '+' + clean;
    }
    return clean;
  };

  // Handle Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    const formattedPhone = getFormattedPhone();

    try {
      const result = await sendPhoneOtpAction(formattedPhone);
      if (result.success) {
        setSuccess(result.message || 'OTP sent successfully!');
        setStep('otp');
        startTimer(60);
      } else {
        setError(result.message || 'Phone number is not registered. Please sign up first.');
      }
    } catch (err) {
      setError('Connection failed. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (otp.length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    const formattedPhone = getFormattedPhone();

    try {
      const result = await verifyPhoneOtpAction(formattedPhone, otp);
      if (result.success) {
        setSuccess('Successfully authenticated!');
        setTimeout(() => {
          router.push(redirect);
          router.refresh();
        }, 1000);
      } else {
        setError(result.message || 'Invalid or expired OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResend = async () => {
    if (timer > 0 || loading) return;
    setError('');
    setSuccess('');
    setLoading(true);
    const formattedPhone = getFormattedPhone();

    try {
      const result = await sendPhoneOtpAction(formattedPhone);
      if (result.success) {
        setSuccess('A new OTP has been sent to your mobile.');
        startTimer(60);
        setOtp('');
      } else {
        setError(result.message || 'Failed to resend OTP.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#f3f4ff] via-white to-[#fdf2ff] p-4 sm:p-6 md:p-8">
      {/* Background Decorative Rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-blue-300/20 to-purple-300/20 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-gradient-to-r from-purple-300/20 to-pink-300/20 blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/80 relative z-10"
      >
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 mb-4">
            <ShieldCheckIcon className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Arogya AI
          </h2>
          <p className="text-gray-500 mt-2 text-sm text-center">
            {step === 'phone' 
              ? "Verify your identity to access India's health assistant" 
              : `Enter the 6-digit code sent to ${phoneNumber}`
            }
          </p>
        </div>

        {/* Messaging States */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl text-red-700 text-sm mb-6 flex items-start space-x-2"
            >
              <span className="font-semibold">⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-green-50 border-l-4 border-green-500 p-4 rounded-xl text-green-700 text-sm mb-6 flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transition Form Steps */}
        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.form
              key="phone-step"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleSendOtp}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile Number
                </Label>
                <div className="relative flex rounded-2xl border border-gray-200 bg-white/50 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all duration-300">
                  <div className="flex items-center px-4 border-r border-gray-100 bg-gray-50/50 rounded-l-2xl text-gray-500 text-sm font-semibold">
                    🇮🇳 +91
                  </div>
                  <div className="relative flex-1">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').substring(0, 10))}
                      placeholder="Enter 10-digit number"
                      className="border-0 bg-transparent py-6 pl-10 pr-4 rounded-r-2xl focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-800 text-lg tracking-wide placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || phoneNumber.length < 10}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 rounded-2xl font-bold shadow-lg shadow-purple-500/10 hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 text-lg cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    <span>Sending code...</span>
                  </>
                ) : (
                  <>
                    <span>Get Verification Code</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </Button>
            </motion.form>
          ) : (
            <motion.form
              key="otp-step"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleVerifyOtp}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
                  6-Digit OTP Code
                </Label>
                <div className="relative rounded-2xl border border-gray-200 bg-white/50 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all duration-300">
                  <KeyIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="otp"
                    type="text"
                    pattern="\d*"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                    placeholder="Enter 6-digit code"
                    className="border-0 bg-transparent py-6 pl-12 pr-4 rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-800 text-lg tracking-widest font-semibold placeholder:text-gray-400 placeholder:tracking-normal placeholder:font-normal"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-gray-500 hover:text-purple-600 transition-colors flex items-center space-x-1 font-medium cursor-pointer"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  <span>Change Number</span>
                </button>
                
                {timer > 0 ? (
                  <span className="text-gray-400 font-medium">
                    Resend code in <strong className="text-purple-600 font-bold">{timer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    className="text-purple-600 hover:text-purple-800 font-semibold underline underline-offset-4 cursor-pointer"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 rounded-2xl font-bold shadow-lg shadow-purple-500/10 hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 text-lg cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    <span>Verifying code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Login</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            {step === 'phone' ? (
              <>
                New to Arogya AI?{' '}
                <Link 
                  href="/register" 
                  className="text-purple-600 hover:text-purple-800 font-bold hover:underline transition-all underline-offset-4"
                >
                  Register mobile here
                </Link>
              </>
            ) : (
              <>
                Having trouble? Contact{' '}
                <Link href="/contact" className="text-purple-600 font-bold hover:underline transition-all">
                  Support Team
                </Link>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
