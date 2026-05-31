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
import HeroSection from '@/components/home/hero-section';
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
        const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '14155238886';
        window.open(`https://wa.me/${waNumber.replace(/\D/g, '')}?text=${encodeURIComponent('नमस्ते! मुझे Arogya AI स्वास्थ्य सेवाओं के बारे में जानना है।')}`, '_blank');
      }
    }
  }, []);

  useEffect(() => {
    if (showSplash) return;
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 3000);
    fetch('/api/user', { signal: controller.signal })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { clearTimeout(tid); if (!data?.phone_number) setShowRegisterPopup(true); })
      .catch(() => { clearTimeout(tid); setShowRegisterPopup(true); });
    return () => controller.abort();
  }, [showSplash]);

  if (showSplash) return <SplashScreen onComplete={() => setShowSplash(false)} />;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">

      {/* ── Register popup ── */}
      <AnimatePresence>
        {showRegisterPopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-7 max-w-md w-full shadow-2xl relative"
            >
              <button onClick={() => setShowRegisterPopup(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <XMarkIcon className="w-5 h-5" />
              </button>
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20 mb-5">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
              <div className="text-center space-y-2 mb-6">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Welcome to Arogya AI</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Register your mobile number to access personalized health guidance, secure records, and WhatsApp sync — takes 30 seconds.
                </p>
                <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">Already registered? Sign in to continue.</p>
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/register" className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/20 hover:shadow-xl transition-all text-center text-sm">
                  🚀 Register Free — Get Started
                </Link>
                <Link href="/sign-in" className="w-full py-3.5 border border-slate-200 dark:border-slate-700 hover:border-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/20 text-slate-700 dark:text-slate-300 hover:text-teal-700 font-bold rounded-2xl transition-all text-center text-sm">
                  Sign In to My Account
                </Link>
                <button onClick={() => setShowRegisterPopup(false)} className="text-xs text-slate-400 hover:text-slate-600 transition-colors pt-1">
                  Continue browsing as guest
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Features ── */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
              Why Arogya AI
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">{t('featuresTitle')}</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">{t('featuresSubtitle')}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ChatBubbleLeftRightIcon, title: t('multilingualTitle'), description: t('multilingualDesc'), gradient: 'from-cyan-500 to-teal-500', cls: 'bg-cyan-50 border-cyan-100 dark:bg-cyan-950/20 dark:border-cyan-900/30' },
              { icon: ClockIcon, title: t('instant24Title'), description: t('instant24Desc'), gradient: 'from-emerald-500 to-teal-500', cls: 'bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30' },
              { icon: HeartIcon, title: t('personalizedTitle'), description: t('personalizedDesc'), gradient: 'from-teal-500 to-cyan-500', cls: 'bg-teal-50 border-teal-100 dark:bg-teal-950/20 dark:border-teal-900/30' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.12 }} viewport={{ once: true }}
                className={`${f.cls} border rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group`}>
                <div className={`w-14 h-14 bg-gradient-to-br ${f.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">{t('howItWorksTitle')}</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Get health assistance in just three simple steps</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[calc(33%+2.5rem)] right-[calc(33%+2.5rem)] h-px bg-gradient-to-r from-cyan-300 to-teal-300 dark:from-cyan-800 dark:to-teal-800" />
            {[
              { step: '1', title: t('step1Title'), description: t('step1Desc'), icon: DevicePhoneMobileIcon, color: 'from-cyan-500 to-teal-600' },
              { step: '2', title: t('step2Title'), description: t('step2Desc'), icon: DocumentTextIcon, color: 'from-teal-500 to-emerald-600' },
              { step: '3', title: t('step3Title'), description: t('step3Desc'), icon: CheckCircleIcon, color: 'from-emerald-500 to-teal-600' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.12 }} viewport={{ once: true }} className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/20 group-hover:scale-105 transition-transform`}>
                    <s.icon className="w-9 h-9 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-extrabold shadow-md">{s.step}</div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{s.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Connect channels ── */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              Platforms
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Multiple Ways to Connect</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Access Arogya AI through your preferred platform</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="bg-white dark:bg-slate-800/50 border border-green-100 dark:border-green-900/30 rounded-3xl p-8 text-center group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/20">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.306"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">WhatsApp (Primary)</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Chat directly through WhatsApp for instant health guidance in your language</p>
              <WhatsAppButton message="Hello! I need health assistance from Arogya AI." className="w-full justify-center" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="bg-white dark:bg-slate-800/50 border border-blue-100 dark:border-blue-900/30 rounded-3xl p-8 text-center group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Web Chat</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Use our web interface when WhatsApp is not available</p>
              <Link href="/chat" className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2">
                <span>Try Web Chat</span><ArrowRightIcon className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">What Users Say</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Real experiences from people who trust Arogya AI</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Priya Sharma', location: 'Bhubaneswar, Odisha', text: 'Arogya AI helped me understand my symptoms quickly. The multilingual support in Odia was really helpful!', rating: 5, avatar: 'https://placehold.co/60x60/e0f2fe/1565c0?text=PS' },
              { name: 'Rajesh Kumar', location: 'New Delhi, Delhi', text: '24/7 availability is amazing. Got health guidance in Hindi at 2 AM when my child had fever. Very grateful!', rating: 5, avatar: 'https://placehold.co/60x60/e0f7fa/006064?text=RK' },
              { name: 'Sunita Patel', location: 'Mumbai, Maharashtra', text: 'The WhatsApp integration is so convenient. No need to download separate apps, and the translation works perfectly!', rating: 5, avatar: 'https://placehold.co/60x60/e8f5e8/2e7d32?text=SP' },
            ].map((testimonial, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.12 }} viewport={{ once: true }}
                className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-3xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-5 leading-relaxed text-sm">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <Image src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full" width={40} height={40} priority={index === 0} />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{testimonial.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950">
        <div className="absolute inset-0 pointer-events-none hidden dark:block opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(20,184,166,0.25) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[100px] pointer-events-none bg-white/10 dark:bg-teal-500/10" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-5 text-white">Ready to Get Health Assistance?</h2>
            <p className="text-lg mb-10 max-w-xl mx-auto text-cyan-100 dark:text-slate-400">
              Join thousands of users who trust Arogya AI for their healthcare needs. Start your conversation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <WhatsAppButton variant="hero" message="Hi! I'm ready to start using Arogya AI for health assistance.">
                Start WhatsApp Chat
              </WhatsAppButton>
              <Link href="/chat" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all border-2 border-white/30 text-white hover:bg-white/10 dark:border-white/10 dark:hover:bg-white/5">
                <ChatBubbleLeftRightIcon className="w-5 h-5" /><span>Try Web Chat</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <WhatsAppButton variant="floating" message="Hello! I need immediate health assistance from Arogya AI." />
    </div>
  );
};

export default HomePage;
