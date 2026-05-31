'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  SparklesIcon,
  BoltIcon,
  GlobeAltIcon,
  HeartIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { ShieldCheckIcon as ShieldSolid, CheckCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import WhatsAppButton from '@/components/whatsapp-button';

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let val = 0;
        const step = Math.ceil(to / 60);
        const timer = setInterval(() => {
          val += step;
          if (val >= to) { setCount(to); clearInterval(timer); }
          else setCount(val);
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function FloatingCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.6, ease: 'easeOut' }} className={className}>
      {children}
    </motion.div>
  );
}

const LANGUAGES = ['हिन्दी', 'ଓଡ଼ିଆ', 'বাংলা', 'தமிழ்', 'తెలుగు', 'ಕನ್ನಡ', 'മലയാളം', 'English'];
const STATS = [
  { value: 50000, suffix: '+', label: 'Patients Helped' },
  { value: 11, suffix: '+', label: 'Indian Languages' },
  { value: 99, suffix: '%', label: 'Uptime' },
  { value: 2, suffix: 's', label: 'Avg Response' },
];
const MESSAGES = [
  { role: 'user', text: 'मुझे बुखार और सिरदर्द है', time: '2:14 PM' },
  { role: 'ai', text: 'I understand. How long have you had these symptoms? Is your temperature above 101°F?', time: '2:14 PM' },
  { role: 'user', text: 'Since yesterday, 102°F fever', time: '2:15 PM' },
];

export default function HeroSection() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLElement>(null);

  // Use window scroll instead of element target — avoids the non-static position warning
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], ['0%', '20%']);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section
      ref={heroRef}
      style={{ position: 'relative' }}
      className="relative min-h-screen flex items-center overflow-hidden
        bg-gradient-to-br from-cyan-50 via-white to-teal-50
        dark:from-slate-950 dark:via-slate-900 dark:to-teal-950"
    >
      {/* ── Light mode background: soft radial mesh ── */}
      <div className="absolute inset-0 pointer-events-none dark:hidden"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 50% at 20% 40%, rgba(6,182,212,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 70%, rgba(20,184,166,0.10) 0%, transparent 60%)`,
        }}
      />
      {/* Light mode dot pattern */}
      <div className="absolute inset-0 pointer-events-none dark:hidden opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(20,184,166,0.15) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Dark mode background: deep aurora ── */}
      <div className="absolute inset-0 pointer-events-none hidden dark:block"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 50% at 20% 40%, rgba(6,182,212,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 70%, rgba(20,184,166,0.10) 0%, transparent 60%)`,
        }}
      />
      {/* Dark mode dot pattern */}
      <div className="absolute inset-0 pointer-events-none hidden dark:block opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(20,184,166,0.25) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />
      {/* Dark mode diagonal lines */}
      <div className="absolute inset-0 pointer-events-none hidden dark:block opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(-45deg, rgba(34,211,238,0.8) 0px, rgba(34,211,238,0.8) 1px, transparent 1px, transparent 60px)`,
        }}
      />

      {/* ── Glow orbs — both modes ── */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none
        bg-cyan-400/10 dark:bg-cyan-500/10" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none
        bg-teal-400/10 dark:bg-teal-500/10" />

      {/* ── Floating particles ── */}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${3 + (i % 4) * 2}px`,
            height: `${3 + (i % 4) * 2}px`,
            left: `${5 + (i * 6.3) % 90}%`,
            top: `${10 + (i * 7.1) % 80}%`,
            background: i % 3 === 0
              ? 'rgba(6,182,212,0.5)'
              : i % 3 === 1
              ? 'rgba(20,184,166,0.45)'
              : 'rgba(52,211,153,0.4)',
          }}
          animate={{ y: [0, -18 - (i % 3) * 8, 0], opacity: [0.3, 0.7, 0.3], scale: [1, 1.3, 1] }}
          transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Parallax content ── */}
      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

            {/* ════ LEFT ════ */}
            <div className="space-y-7">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
                  bg-teal-100 border border-teal-200 text-teal-700
                  dark:bg-teal-500/10 dark:border-teal-500/20 dark:text-teal-300"
              >
                <SparklesIcon className="w-4 h-4" />
                AI-Powered Healthcare for India
                <span className="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-400 animate-pulse" />
              </motion.div>

              {/* Headline */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
                <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.08] tracking-tight
                  text-slate-900 dark:text-white">
                  Your Personal{' '}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-500 dark:from-cyan-400 dark:via-teal-300 dark:to-emerald-400 bg-clip-text text-transparent animate-gradient">
                      Health AI
                    </span>
                    <motion.span
                      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                      transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full origin-left
                        bg-gradient-to-r from-cyan-500 to-teal-500 dark:from-cyan-400 dark:to-teal-400"
                    />
                  </span>
                  <br />
                  <span className="text-slate-600 dark:text-slate-300">in Your Language</span>
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
                className="text-lg leading-relaxed max-w-lg text-slate-600 dark:text-slate-400"
              >
                Get instant symptom analysis, health guidance, and medical information through
                WhatsApp or web — in Hindi, Odia, Bengali, Tamil, and 7 more Indian languages.
              </motion.p>

              {/* Language pills */}
              <motion.div
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
                className="flex flex-wrap gap-2"
              >
                {LANGUAGES.map((lang, i) => (
                  <motion.span
                    key={lang}
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="px-3 py-1 rounded-full text-xs font-semibold cursor-default transition-all
                      bg-white border border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50
                      dark:bg-white/5 dark:border-white/10 dark:text-slate-300 dark:hover:bg-teal-500/10 dark:hover:border-teal-500/30 dark:hover:text-teal-300"
                  >
                    {lang}
                  </motion.span>
                ))}
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <WhatsAppButton variant="hero" message="नमस्ते! मुझे Arogya AI स्वास्थ्य सेवाओं के बारे में जानना है।">
                  {t('startChat')}
                </WhatsAppButton>
                <Link
                  href="/chat"
                  className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full font-semibold text-base transition-all duration-300
                    border border-slate-300 bg-white text-slate-700 hover:border-teal-400 hover:text-teal-700 hover:bg-teal-50 shadow-sm
                    dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:backdrop-blur-sm"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                  <span>{t('tryWebChat')}</span>
                  <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {/* Trust row */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center gap-6 pt-1"
              >
                {[
                  { Icon: ShieldSolid, text: 'HIPAA Compliant', color: 'text-emerald-600 dark:text-emerald-400' },
                  { Icon: BoltIcon, text: '24/7 Available', color: 'text-cyan-600 dark:text-cyan-400' },
                  { Icon: GlobeAltIcon, text: '11 Languages', color: 'text-teal-600 dark:text-teal-400' },
                ].map(({ Icon, text, color }) => (
                  <div key={text} className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span>{text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ════ RIGHT: chat mockup ════ */}
            <motion.div
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              {/* Main card */}
              <div className="relative rounded-3xl p-6 shadow-2xl backdrop-blur-xl
                bg-white/80 border border-slate-200/80
                dark:bg-slate-800/60 dark:border-white/10 dark:shadow-black/40">

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg">
                      <HeartIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">Arogya AI</p>
                      <p className="text-teal-600 dark:text-teal-400 text-xs font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400 animate-pulse inline-block" />
                        Active Session
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                    <div className="w-3 h-3 rounded-full bg-green-400/70" />
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-3 mb-5">
                  {MESSAGES.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.2 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'ai' && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center mr-2 mt-1 shrink-0">
                          <span className="text-white text-[8px] font-bold">AI</span>
                        </div>
                      )}
                      <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-teal-600 text-white rounded-br-sm'
                          : 'bg-slate-100 text-slate-700 rounded-bl-sm border border-slate-200 dark:bg-slate-700/80 dark:text-slate-200 dark:border-white/5'
                      }`}>
                        {msg.text}
                        <div className={`text-[9px] mt-1 ${msg.role === 'user' ? 'text-teal-200' : 'text-slate-400 dark:text-slate-500'}`}>
                          {msg.time}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shrink-0">
                      <span className="text-white text-[8px] font-bold">AI</span>
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center
                      bg-slate-100 border border-slate-200 dark:bg-slate-700/80 dark:border-white/5">
                      {[0, 1, 2].map((j) => (
                        <motion.div key={j} className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400"
                          animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: j * 0.15 }} />
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Input bar */}
                <div className="flex items-center gap-2 rounded-2xl px-4 py-3
                  bg-slate-100 border border-slate-200 dark:bg-slate-700/50 dark:border-white/10">
                  <span className="text-xs flex-1 text-slate-400 dark:text-slate-500">Type your health question...</span>
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                    <ArrowRightIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>

              {/* Floating stat cards */}
              <FloatingCard delay={0.8}
                className="absolute -top-6 -right-6 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3
                  bg-white border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/40">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Response Time</p>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">~2 seconds</p>
                </div>
              </FloatingCard>

              <FloatingCard delay={1.0}
                className="absolute -bottom-6 -left-6 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3
                  bg-white border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-cyan-100 dark:bg-cyan-900/40">
                  <GlobeAltIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Languages</p>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">11 Indian</p>
                </div>
              </FloatingCard>

              <FloatingCard delay={1.2}
                className="absolute top-1/2 -right-10 -translate-y-1/2 rounded-2xl px-4 py-3 shadow-xl
                  bg-white border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                <div className="flex items-center gap-0.5 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">50,000+ users</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">trust Arogya AI</p>
              </FloatingCard>
            </motion.div>
          </div>

          {/* ── Stats bar ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden border
              bg-white/60 border-slate-200/80 shadow-lg
              dark:bg-slate-900/60 dark:border-white/10"
          >
            {STATS.map(({ value, suffix, label }, i) => (
              <div key={label} className={`px-6 py-5 text-center transition-colors
                hover:bg-teal-50 dark:hover:bg-slate-800/60
                ${i < 3 ? 'border-r border-slate-200/60 dark:border-white/5' : ''}`}>
                <p className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-white">
                  <Counter to={value} suffix={suffix} />
                </p>
                <p className="text-xs font-medium mt-1 text-slate-500 dark:text-slate-400">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
