/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
'use client'
export const dynamic = 'force-dynamic';;

import { motion } from 'framer-motion';
import { useTheme } from '@/app/providers/theme-provider';
import { 
  Users, 
  Target, 
  Award, 
  Shield, 
  Heart,
  Globe,
  Car,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { useState } from 'react';

export default function AboutUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { theme } = useTheme();

  const stats = [
    { number: '500+', label: 'Verified Dealers', icon: ShieldCheck },
    { number: '10,000+', label: 'Successful Transactions', icon: CheckCircle },
    { number: '15+', label: 'African Countries', icon: Globe },
    { number: '4.8/5', label: 'Trust Rating', icon: Star }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'Verified listings and secure transactions built on transparency and honesty.'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your satisfaction and security are our top priorities in every interaction.'
    },
    {
      icon: Globe,
      title: 'African Innovation',
      description: 'Built for Africa, solving unique automotive marketplace challenges.'
    },
    {
      icon: TrendingUp,
      title: 'Data-Driven',
      description: 'Leveraging analytics to improve dealer performance and buyer experience.'
    }
  ];

  const problems = [
    'Lack of trust and transparency between buyers and sellers',
    'Difficulty in tracking sales and verifying listing authenticity',
    'No structured follow-up mechanism or sales analytics for dealers',
    'Scams and misrepresentation of vehicle conditions',
    'Poor buyer experience with scattered, unorganized listings'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } else {
      throw new Error(result.error || 'Failed to send message');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Failed to send message. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Hero Background - Only covers content area */}
      <div className="flex-1 flex flex-col relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: "url('/background/about.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Hero Section */}
          <section className="relative">
            <div className="container mx-auto px-3 sm:px-4 py-12 sm:py-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-4xl mx-auto"
              >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2">
  <span className="text-white">About </span>
  
  {/* CarLinq - using second style but in first style's structure with reduced spacing */}
  <span className="inline-block italic">
    {/* Car - using alpha a */}
    <span
      style={{
        color: theme === 'light' ? '#FF8C00' : '#CC6600',
        textShadow: `
          0 2px 0 #000,  /* black vertical shadow slightly downward */
          1px 1px 0 rgba(0,0,0,0.3), 
          2px 2px 0 rgba(0,0,0,0.2)
        `,
      }}
    >
      Cɑr
    </span>
    
    {/* Linq - with reduced spacing */}
    <span
      style={{
        color: theme === 'light' ? '#0277BD' : '#01579B',
        textShadow: `
          0 2px 0 #000,  /* black vertical shadow slightly downward */
          1px 1px 0 rgba(0,0,0,0.3), 
          2px 2px 0 rgba(0,0,0,0.2)
        `,
        marginLeft: '-1.4px', // Reduced spacing between Car and Linq
      }}
    >
      Linq
    </span>
  </span>
</h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 drop-shadow max-w-3xl mx-auto">
                  Linking You to the Perfect Ride
                </p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-20 h-1 bg-primary-400 mx-auto rounded-full"
                ></motion.div>
              </motion.div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-8 sm:py-12">
            <div className="container mx-auto px-3 sm:px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
              >
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300"
                    >
                      <div className="flex justify-center mb-3">
                        <div className="p-3 bg-primary-500/20 rounded-xl">
                          <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-400" />
                        </div>
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-white mb-1 drop-shadow">
                        {stat.number}
                      </div>
                      <div className="text-white/80 text-sm sm:text-base drop-shadow-sm">
                        {stat.label}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>

          {/* Introduction Section */}
          <section className="py-12 sm:py-16">
  <div className="container mx-auto px-3 sm:px-4">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden"
    >
      <div className="p-6 sm:p-8 lg:p-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white dark:text-white mb-3 sm:mb-4">
              What is 
              <span className="inline-block italic ml-1">
                <span
                  style={{
                    color: theme === 'light' ? '#FF8C00' : '#CC6600',
                    textShadow: `
                      0 2px 0 #000,
                      1px 1px 0 rgba(0,0,0,0.3), 
                      2px 2px 0 rgba(0,0,0,0.2)
                    `,
                  }}
                >
                  Cɑr
                </span>
                <span
                  style={{
                    color: theme === 'light' ? '#0277BD' : '#01579B',
                    textShadow: `
                      0 2px 0 #000,
                      1px 1px 0 rgba(0,0,0,0.3), 
                      2px 2px 0 rgba(0,0,0,0.2)
                    `,
                    marginLeft: '-2px',
                  }}
                >
                  Linq ?
                </span>
              </span>
            </h2>

            <div className="space-y-4 text-white/95">
              <p className="text-base sm:text-lg leading-relaxed">
                <span className="text-orange-400 font-bold">CarLinq</span>
                {' '}is a premium online car trading platform connecting trusted car dealers with serious buyers.
                Unlike informal spaces such as Facebook Marketplace or WhatsApp groups—where listings are scattered and trust is never guaranteed. CarLinq offers a professional, secure marketplace designed exclusively for vehicle sales.
              </p>
            </div>
          </motion.div>

          {/* IMAGE / CARD */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-sm sm:max-w-md">

              {/* Card height reduced */}
              <div className="w-full h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 
                              rounded-2xl flex items-center justify-center">
                <Car className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-primary-400" />
              </div>

              {/* Positioned inside bottom-right, not too far down */}
              <div className="absolute bottom-3 right-3 bg-primary-500 text-white px-3 py-1.5 rounded-lg shadow-lg text-sm sm:text-base">
                Professional Platform
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  </div>
</section>


          {/* Problem Statement Section */}
          <section className="py-12 sm:py-16">
            <div className="container mx-auto px-3 sm:px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl p-6 sm:p-8 lg:p-12"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 text-center drop-shadow">
                  The Problem We Solve
                </h2>
                <div className="max-w-4xl mx-auto">
                  <p className="text-white/80 text-lg sm:text-xl mb-8 text-center">
                    Currently, most car transactions in Africa occur through informal channels with several critical issues:
                  </p>
                  <div className="grid gap-4">
                    {problems.map((problem, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="p-2 bg-red-500/20 rounded-lg mt-1">
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        <p className="text-white/90 text-base sm:text-lg flex-1">{problem}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Solution Section */}
          <section className="py-12 sm:py-16">
            <div className="container mx-auto px-3 sm:px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl p-6 sm:p-8 lg:p-12"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 text-center drop-shadow">
                  Our Solution
                </h2>
                <div className="max-w-4xl mx-auto">
                  <p className="text-white/80 text-lg sm:text-xl mb-8 text-center">
                    CarLinq provides an organized, dealer-focused digital platform that transforms car trading in Africa:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gradient-to-br from-primary-500/10 to-primary-600/10 p-6 rounded-xl border border-primary-400/20"
                    >
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <Users className="w-6 h-6 text-primary-400" />
                        For Car Dealers
                      </h3>
                      <ul className="space-y-3 text-white/90">
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Post verified listings with credibility
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Manage inquiries efficiently
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Gain visibility among serious buyers
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Access sales analytics and tracking
                        </li>
                      </ul>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-br from-secondary-500/10 to-secondary-600/10 p-6 rounded-xl border border-secondary-400/20"
                    >
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-secondary-400" />
                        For Buyers
                      </h3>
                      <ul className="space-y-3 text-white/90">
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Browse verified vehicles with confidence
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Contact dealers securely
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Receive incentives on verified purchases
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Smart follow-up for transaction verification
                        </li>
                      </ul>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Our Values Section */}
          <section className="py-12 sm:py-16">
            <div className="container mx-auto px-3 sm:px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8 sm:mb-12"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 drop-shadow">
                  Our Values
                </h2>
                <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto drop-shadow-sm">
                  The principles that drive our platform
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <motion.div
                      key={value.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
                    >
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-400" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white text-center mb-3 drop-shadow">
                        {value.title}
                      </h3>
                      <p className="text-white/80 text-center text-sm sm:text-base leading-relaxed">
                        {value.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Contact Form Section */}
          <section className="py-12 sm:py-16">
            <div className="container mx-auto px-3 sm:px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden"
              >
                <div className="p-6 sm:p-8 lg:p-12">
                  <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Contact Information */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 drop-shadow">
                        Get In Touch
                      </h2>
                      <p className="text-white/80 text-lg sm:text-xl mb-8 leading-relaxed">
                        Have questions about CarLinq? Want to learn more about how we can help your dealership or find your perfect vehicle? We'd love to hear from you.
                      </p>

                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-primary-500/20 rounded-xl">
                            <Phone className="w-6 h-6 text-primary-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">Call Us</h3>
                            <p className="text-white/80">+263 782 379 164</p>
                            <p className="text-white/80">+263 710 312 818</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-primary-500/20 rounded-xl">
                            <Mail className="w-6 h-6 text-primary-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">Email Us</h3>
                            <p className="text-white/80">info@carlinq.com</p>
                            <p className="text-white/80">support@carlinq.com</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-primary-500/20 rounded-xl">
                            <Clock className="w-6 h-6 text-primary-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">Business Hours</h3>
                            <p className="text-white/80">Mon - Fri: 8:00 AM - 6:00 PM</p>
                            <p className="text-white/80"></p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-white/90 mb-2">
                              Your Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                              placeholder="Enter your name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white/90 mb-2">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                              placeholder="Enter your email"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-2">
                            Subject *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.subject}
                            onChange={(e) => handleInputChange('subject', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                            placeholder="What is this regarding?"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-2">
                            Message *
                          </label>
                          <textarea
                            required
                            rows={5}
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 resize-none"
                            placeholder="Tell us how we can help you..."
                          />
                        </div>

                        {isSubmitted && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-green-500/20 border border-green-400/30 rounded-xl"
                          >
                            <p className="text-green-400 text-center font-medium">
                              Thank you for your message! We&rsquo;ll get back to you soon.
                            </p>
                          </motion.div>
                        )}

                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed shadow-lg"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Sending...
                            </div>
                          ) : (
                            'Send Message'
                          )}
                        </motion.button>
                      </form>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
