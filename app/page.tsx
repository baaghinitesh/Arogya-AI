'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ChatBubbleLeftRightIcon, 
  ClockIcon, 
  HeartIcon,
  DevicePhoneMobileIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  StarIcon,
  ArrowRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import WhatsAppButton from '@/components/whatsapp-button';
import SplashScreen from '@/components/splash-screen';
import Link from 'next/link';
import Image from 'next/image';

const HomePage = () => {
  const { t } = useTranslation();
  const [showSplash, setShowSplash] = useState(true);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('action') === 'whatsapp') {
        const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "14155238886";
        const cleanNumber = waNumber.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent("नमस्ते! मुझे Arogya AI स्वास्थ्य सेवाओं के बारे में जानना है।")}`, '_blank');
      }
    }
  }, []);

  // Check auth after splash — show popup if not registered
  useEffect(() => {
    if (showSplash) return;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    fetch('/api/user', { signal: controller.signal })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        clearTimeout(timeoutId);
        if (!data?.phone_number) setShowRegisterPopup(true);
      })
      .catch(() => {
        clearTimeout(timeoutId);
        setShowRegisterPopup(true);
      });

    return () => controller.abort();
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/70 via-slate-50 to-emerald-50/70 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/20 text-gray-900 dark:text-gray-100 transition-colors duration-300">

      {/* ── Registration popup ── */}
      <AnimatePresence>
        {showRegisterPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-7 max-w-md w-full shadow-2xl relative"
            >
              {/* Dismiss */}
              <button
                onClick={() => setShowRegisterPopup(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                aria-label="Dismiss"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20 mb-5">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>

              {/* Copy */}
              <div className="text-center space-y-2 mb-6">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Welcome to Arogya AI
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  To access personalized health guidance, secure medical records, and WhatsApp sync — register your mobile number. It only takes 30 seconds.
                </p>
                <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                  Already registered? Sign in to continue.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <Link
                  href="/register"
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/20 hover:shadow-xl transition-all text-center text-sm"
                >
                  🚀 Register Free — Get Started
                </Link>
                <Link
                  href="/sign-in"
                  className="w-full py-3.5 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/20 text-slate-700 dark:text-slate-250 hover:text-teal-700 dark:hover:text-teal-450 font-bold rounded-2xl transition-all text-center text-sm"
                >
                  Sign In to My Account
                </Link>
                <button
                  onClick={() => setShowRegisterPopup(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors pt-1"
                >
                  Continue browsing as guest
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hero Section */}
      <section className="relative px-4 pt-24 pb-16 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent animate-gradient">
                  {t('heroTitle')}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {t('heroSubtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <WhatsAppButton 
                  variant="hero" 
                  message="नमस्ते! मुझे Arogya AI स्वास्थ्य सेवाओं के बारे में जानना है।"
                >
                  {t('startChat')}
                </WhatsAppButton>
                
                <Link 
                  href="/chat"
                  className="px-8 py-4 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 border border-gray-200 dark:border-slate-700 group"
                >
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-teal-650 dark:text-teal-400" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {t('tryWebChat')}
                  </span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                  <span>{t('hipaaCompliant')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-5 h-5 text-blue-500" />
                  <span>{t('available24_7')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <HeartIcon className="w-5 h-5 text-red-500" />
                  <span>{t('healthcareFocused')}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm border-y border-gray-100/50 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('featuresTitle')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('featuresSubtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ChatBubbleLeftRightIcon,
                title: t('multilingualTitle'),
                description: t('multilingualDesc'),
                color: 'from-cyan-500 to-teal-500'
              },
              {
                icon: ClockIcon,
                title: t('instant24Title'),
                description: t('instant24Desc'),
                color: 'from-emerald-500 to-teal-500'
              },
              {
                icon: HeartIcon,
                title: t('personalizedTitle'),
                description: t('personalizedDesc'),
                color: 'from-teal-500 to-cyan-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800/50 border border-transparent dark:border-slate-700/50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('howItWorksTitle')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get health assistance in just three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-cyan-300/50 to-teal-300/50 dark:from-cyan-900/50 dark:to-teal-900/50 -translate-y-1/2"></div>
            <div className="hidden md:block absolute top-1/2 right-1/3 w-1/3 h-0.5 bg-gradient-to-r from-teal-300/50 to-emerald-300/50 dark:from-teal-900/50 dark:to-emerald-900/50 -translate-y-1/2"></div>

            {[
              {
                step: '1',
                title: t('step1Title'),
                description: t('step1Desc'),
                icon: DevicePhoneMobileIcon
              },
              {
                step: '2',
                title: t('step2Title'),
                description: t('step2Desc'),
                icon: DocumentTextIcon
              },
              {
                step: '3',
                title: t('step3Title'),
                description: t('step3Desc'),
                icon: CheckCircleIcon
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm border-y border-gray-100/50 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Multiple Ways to Connect
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Access Arogya AI through your preferred platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-green-50/50 dark:bg-green-950/10 border border-green-100/30 dark:border-green-900/20 rounded-2xl p-8 text-center group hover:bg-green-100/50 dark:hover:bg-green-950/20 transition-colors duration-300"
            >
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.306"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                WhatsApp (Primary)
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Chat directly through WhatsApp for instant health guidance in your language
              </p>
              <WhatsAppButton 
                message="Hello! I need health assistance from Arogya AI."
                className="w-full justify-center"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100/30 dark:border-blue-900/20 rounded-2xl p-8 text-center group hover:bg-blue-100/50 dark:hover:bg-blue-950/20 transition-colors duration-300"
            >
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Web Chat (Fallback)
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Use our web interface when WhatsApp is not available
              </p>
              <Link 
                href="/chat"
                className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 border border-blue-600"
              >
                <span>Try Web Chat</span>
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Real experiences from people who trust Arogya AI for their health needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                location: "Bhubaneswar, Odisha, India",
                text: "Arogya AI helped me understand my symptoms quickly. The multilingual support in Odia was really helpful!",
                rating: 5,
                avatar: "https://placehold.co/60x60/e0f2fe/1565c0?text=PS"
              },
              {
                name: "Rajesh Kumar",
                location: "New Delhi, Delhi, India", 
                text: "24/7 availability is amazing. Got health guidance in Hindi at 2 AM when my child had fever. Very grateful!",
                rating: 5,
                avatar: "https://placehold.co/60x60/e0f7fa/006064?text=RK"
              },
              {
                name: "Sunita Patel",
                location: "Mumbai, Maharashtra, India",
                text: "The WhatsApp integration is so convenient. No need to download separate apps, and the dynamic translation works perfectly!",
                rating: 5,
                avatar: "https://placehold.co/60x60/e8f5e8/2e7d32?text=SP"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800/60 border border-transparent dark:border-slate-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 border border-teal-100/50 dark:border-teal-900/30"
                    width={48}
                    height={48}
                    priority={index === 0}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-cyan-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Health Assistance?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust Arogya AI for their healthcare needs. 
              Start your conversation today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <WhatsAppButton 
                variant="hero"
                message="Hi! I'm ready to start using Arogya AI for health assistance."
              >
                Start WhatsApp Chat
              </WhatsAppButton>
              <Link 
                href="/chat"
                className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-full font-semibold text-lg transition-all duration-300 flex items-center space-x-3"
              >
                <ChatBubbleLeftRightIcon className="w-6 h-6" />
                <span>Try Web Chat</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <WhatsAppButton 
        variant="floating" 
        message="Hello! I need immediate health assistance from Arogya AI."
      />
    </div>
  );
};

export default HomePage;