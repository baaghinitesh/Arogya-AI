'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  HeartIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import WhatsAppButton from '@/components/whatsapp-button';
import Image from 'next/image';

const AboutPage = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: HeartIcon,
      title: 'Healthcare Focused',
      description: 'Specialized AI trained specifically for healthcare assistance and symptom guidance',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: GlobeAltIcon,
      title: 'Multilingual Support',
      description: 'Available in English, Hindi, and Odia to serve the diverse population of Odisha',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Privacy & Security',
      description: 'HIPAA-compliant platform ensuring your health information remains secure',
      color: 'from-green-500 to-blue-500'
    },
    {
      icon: UserGroupIcon,
      title: 'Community Driven',
      description: 'Built specifically for the people of Odisha with local health insights',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Users Helped' },
    { number: '24/7', label: 'Available' },
    { number: '3', label: 'Languages' },
    { number: '99%', label: 'Uptime' }
  ];

  const team = [
    {
      name: 'Dr. Priya Mishra',
      role: 'Medical Advisor',
      bio: 'MBBS, MD - General Medicine. 15+ years experience in rural healthcare.',
      avatar: 'https://placehold.co/300x300/e3f2fd/1976d2?text=PM'
    },
    {
      name: 'Rohit Patel',
      role: 'AI Engineer',
      bio: 'PhD in AI/ML. Former researcher at IIT Bhubaneswar.',
      avatar: 'https://placehold.co/300x300/f3e5f5/7b1fa2?text=RP'
    },
    {
      name: 'Anita Sharma',
      role: 'Product Manager',
      bio: 'MBA, 10+ years in healthcare technology and product development.',
      avatar: 'https://placehold.co/300x300/e8f5e8/388e3c?text=AS'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      {/* Hero Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                About Arogya AI
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to make healthcare accessible to everyone in Odisha through 
              AI-powered assistance that speaks your language and understands your needs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Healthcare accessibility remains a challenge in many parts of Odisha. 
                  Arogya AI bridges this gap by providing instant, reliable health guidance 
                  through platforms everyone already uses - WhatsApp and the web.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Our AI is trained to understand local health patterns, communicate in 
                  regional languages, and provide culturally sensitive healthcare guidance 
                  that respects traditional practices while promoting modern medical knowledge.
                </p>
                <WhatsAppButton 
                  message="Hi! I'd like to learn more about Arogya AI's mission and services."
                  className="inline-flex"
                >
                  Connect with Us
                </WhatsAppButton>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 flex items-center justify-center">
                  <Image
                    src="https://placehold.co/400x400/e3f2fd/1976d2?text=Healthcare+AI"
                    alt="Healthcare AI Illustration"
                    className="rounded-xl shadow-lg"
                    width={400}
                    height={400}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Makes Us Different
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're not just another health app. We're your trusted healthcare companion 
              built specifically for Odisha.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Impact by Numbers
              </h2>
              <p className="text-blue-100 text-lg">
                See how we're making a difference in Odisha's healthcare landscape
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-blue-100 text-sm md:text-base">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Healthcare professionals and technologists working together to serve Odisha
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:scale-105"
              >
                <div className="relative mb-6">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto shadow-lg"
                    width={96}
                    height={96}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          >
            <AcademicCapIcon className="w-16 h-16 text-blue-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Vision for Healthcare
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              We envision a future where every person in Odisha has access to immediate, 
              reliable healthcare guidance regardless of their location, language, or 
              economic background. Through AI technology, we're making this vision a reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <WhatsAppButton 
                message="I'm interested in joining the Arogya AI mission. How can I help?"
                className="justify-center"
              >
                Join Our Mission
              </WhatsAppButton>
              <a 
                href="/contact" 
                className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Learn More</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;