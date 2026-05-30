'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  UserPlusIcon, 
  PhoneIcon, 
  UserIcon, 
  MapPinIcon, 
  CheckCircle2, 
  ArrowRightIcon, 
  ArrowLeftIcon,
  Loader2,
  SmileIcon,
  MessageSquareShare
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
  
  // Registration steps: 1: Phone, 2: Profile, 3: Region/Language, 4: Success
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
            setDetectedLocation('Location not found. Will register as Unknown.');
          }
        } catch (err) {
          setDetectedLocation('Location lookup service unavailable.');
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
      if (!age || parseInt(age) < 1 || parseInt(age) > 120) {
        setError('Please enter a valid age (1-120).');
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
        setError(result.message || 'Registration failed. The number may already be registered.');
      }
    } catch (err) {
      setError('Connection failed. Please verify your backend server connection.');
    } finally {
      setLoading(false);
    }
  };

  const stepsDetails = [
    { title: 'Mobile Number', icon: PhoneIcon },
    { title: 'Personal Info', icon: UserIcon },
    { title: 'Region & Language', icon: MapPinIcon },
    { title: 'Ready!', icon: CheckCircle2 }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#f3f4ff] via-white to-[#fdf2ff] p-4 sm:p-6 md:p-8 pt-24 pb-16">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-gradient-to-r from-blue-300/10 to-purple-300/10 blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-purple-300/10 to-pink-300/10 blur-3xl" />
      </div>

      <div className="w-full max-w-lg bg-white/75 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/80 relative z-10">
        
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full z-0 pointer-events-none" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500 z-0 pointer-events-none" 
              style={{ width: `${((step - 1) / (stepsDetails.length - 1)) * 100}%` }}
            />
            {stepsDetails.map((stepDetail, index) => {
              const StepIcon = stepDetail.icon;
              const isCompleted = index + 1 < step;
              const isActive = index + 1 === step;
              return (
                <div key={index} className="flex flex-col items-center relative z-10">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                        : isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-110 shadow-lg'
                        : 'bg-white text-gray-400 border border-gray-200'
                    }`}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-semibold mt-2 hidden sm:block ${
                    isActive ? 'text-purple-600 font-bold' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {stepDetail.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Brand/Heading */}
        <div className="text-center mb-8">
          {step === 4 ? (
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-9 h-9 text-white" />
            </div>
          ) : (
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/10 mx-auto mb-4">
              <UserPlusIcon className="w-8 h-8 text-white" />
            </div>
          )}
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {step === 4 ? 'Registration Successful!' : 'Register for Arogya AI'}
          </h2>
          <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
            {step === 1 && "Start by validating your phone number. This enables direct access to our WhatsApp chatbot."}
            {step === 2 && "Help the AI know you better to deliver accurate health recommendations and disease analysis."}
            {step === 3 && "Specify your Indian pincode for local outbreak alerts, and pick your preferred native language."}
            {step === 4 && "Your profile is saved! You are now fully authorized to chat on both WhatsApp and Web."}
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl text-red-700 text-sm mb-6 flex items-start space-x-2 animate-pulse">
            <span className="font-semibold">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Steps Forms with transitions */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="step-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleNextStep}
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
                disabled={phoneNumber.length < 10}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 rounded-2xl font-bold shadow-lg shadow-purple-500/10 hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 text-lg cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRightIcon className="w-5 h-5" />
              </Button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form
              key="step-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleNextStep}
              className="space-y-5"
            >
              <div>
                <Label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </Label>
                <div className="relative rounded-2xl border border-gray-200 bg-white/50 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all duration-300">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="border-0 bg-transparent py-6 pl-12 pr-4 rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-800 text-base"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                    Age
                  </Label>
                  <div className="relative rounded-2xl border border-gray-200 bg-white/50 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all duration-300">
                    <Input
                      id="age"
                      type="number"
                      min={1}
                      max={120}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Age"
                      className="border-0 bg-transparent py-6 px-4 rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-800 text-base"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender
                  </Label>
                  <Select onValueChange={setGender} value={gender}>
                    <SelectTrigger className="rounded-2xl border-gray-200 bg-white/50 py-6 text-base text-gray-800 focus:ring-purple-500 focus:ring-offset-0">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl bg-white border border-gray-200">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <Button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-6 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 text-base cursor-pointer"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span>Back</span>
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 rounded-2xl font-bold shadow-lg shadow-purple-500/10 hover:shadow-xl transition-all flex items-center justify-center space-x-2 text-base cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </Button>
              </div>
            </motion.form>
          )}

          {step === 3 && (
            <motion.form
              key="step-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleRegister}
              className="space-y-5"
            >
              <div>
                <Label htmlFor="pincode" className="block text-sm font-semibold text-gray-700 mb-2">
                  Indian Pincode (6 Digits)
                </Label>
                <div className="relative rounded-2xl border border-gray-200 bg-white/50 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all duration-300">
                  <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="pincode"
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                    placeholder="Enter pincode (e.g. 110001)"
                    className="border-0 bg-transparent py-6 pl-12 pr-4 rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-800 text-base"
                    required
                  />
                  {fetchingLocation && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-600 animate-spin" />
                  )}
                </div>
                {detectedLocation && (
                  <p className="mt-2 text-sm text-purple-600 font-semibold flex items-center gap-1 pl-1">
                    📍 {detectedLocation}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Native Language
                </Label>
                <Select onValueChange={setLanguage} value={language}>
                  <SelectTrigger className="rounded-2xl border-gray-200 bg-white/50 py-6 text-base text-gray-800 focus:ring-purple-500 focus:ring-offset-0">
                    <SelectValue placeholder="Pick language" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl bg-white border border-gray-200 max-h-60 overflow-y-auto">
                    {languagesList.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.native} ({lang.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-2">
                <Button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-6 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 text-base cursor-pointer"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span>Back</span>
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 rounded-2xl font-bold shadow-lg shadow-purple-500/10 hover:shadow-xl transition-all flex items-center justify-center space-x-2 text-base cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
          )}

          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center"
            >
              <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100 flex flex-col items-center">
                <SmileIcon className="w-12 h-12 text-purple-600 mb-2 animate-bounce" />
                <h3 className="text-lg font-bold text-purple-800">Welcome to Arogya AI, {name}!</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Your number <strong className="text-gray-800">{phoneNumber}</strong> is officially registered. You can immediately access AI diagnosis and support using your native language.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/chat"
                  className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-base"
                >
                  <MessageSquareShare className="w-5 h-5" />
                  <span>Try Web Chat</span>
                </Link>

                <a
                  href={`https://wa.me/14155238886?text=${encodeURIComponent(`नमस्ते! मैं ${name} हूँ। मुझे स्वास्थ्य मार्गदर्शन चाहिए।`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-base"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.306"/>
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Navigation (only visible in steps 1, 2, 3) */}
        {step < 4 && (
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already registered?{' '}
              <Link 
                href="/sign-in" 
                className="text-purple-600 hover:text-purple-800 font-bold hover:underline transition-all underline-offset-4"
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
