'use client';
export const dynamic = 'force-dynamic';

import { motion } from 'framer-motion';
import { Car, Shield, TrendingUp, Users, CheckCircle, Star } from 'lucide-react';
import { useTheme } from '@/app/providers/theme-provider';
import Link from 'next/link';


export default function Home() {
  const { theme } = useTheme();
  const features = [
    {
      icon: Shield,
      title: 'Verified Listings',
      description: 'Every vehicle is thoroughly verified for authenticity, condition, and ownership history.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: TrendingUp,
      title: 'Sales Analytics',
      description: 'Comprehensive dashboard with real-time sales performance insights and market trends.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Trusted Community',
      description: 'Connect with verified dealers and serious buyers in a secure trading environment.',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const stats = [
    { number: '500+', label: 'Verified Dealers' },
    { number: '10,000+', label: 'Cars Listed' },
    { number: '95%', label: 'Customer Satisfaction' },
    { number: '24/7', label: 'Support' }
  ];

  const testimonials = [
  {
    name: 'Thomas Chigwida',
    role: 'Vehicle Buyer',
    content: 'Found my perfect family SUV in just 3 days. The verified listings gave me confidence in the purchase.',
    rating: 5
  },
  {
    name: 'Sarah Makoni',
    role: 'Car Dealer',
    content: 'My sales have increased by 60% since joining. The platform connects me with serious buyers daily.',
    rating: 5
  },
  {
    name: 'David Moyo',
    role: 'Dealership Owner',
    content: 'Managing multiple locations is now effortless. The analytics help us stock what customers actually want.',
    rating: 5
  }
];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center py-20 lg:py-28 overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/background/carbackground.jpg)',
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-transparent to-secondary-900/30"></div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-primary-500 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-1/2 right-10 w-32 h-32 bg-secondary-500 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-primary-400 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg border border-white/20"
            >
              <Car className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2">
      <span className="text-white">Welcome to </span>

      {/* Car - skewed forward, alpha a */}
      <span className="inline-block italic transform skew-x-[10deg]" style={{ fontWeight: 800 }}>
  <span style={{
    color: theme === 'light' ? '#FF8C00' : '#CC6600',
    textShadow: '0 2px 0 #000, 1px 1px 0 rgba(0,0,0,0.3), 2px 2px 0 rgba(0,0,0,0.2)'
  }}>
    Car
  </span>
  <span style={{
    color: theme === 'light' ? '#0277BD' : '#01579B',
    textShadow: '0 2px 0 #000, 1px 1px 0 rgba(0,0,0,0.3), 2px 2px 0 rgba(0,0,0,0.2)'
  }}>
    Linq
  </span>
</span>
    </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              Linking You to the Perfect Ride
            </p>

            <p className="text-base sm:text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              The professional platform connecting verified car dealers with trusted buyers across Africa. 
              Experience transparency, security, and convenience in every vehicle transaction.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12">
  <Link href="/cars" className="w-full sm:w-auto">
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full sm:w-auto bg-white text-primary-600 hover:bg-gray-100 font-semibold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white"
    >
      Browse Cars
    </motion.button>
  </Link>

  <Link href="/dealers/login" className="w-full sm:w-auto">
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full sm:w-auto bg-transparent text-white hover:bg-white/10 font-semibold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white"
    >
      Become a Dealer
    </motion.button>
  </Link>
</div>

            {/* Stats Preview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20"
                >
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-200">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Problem Solution Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                Tired of Informal Car Trading?
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p className="text-base sm:text-lg">
                  Facebook Marketplace and WhatsApp groups are full of risks:
                </p>
                <ul className="space-y-3">
                  {[
                    'Scams and misrepresentation',
                    'No vehicle verification',
                    'Unreliable buyers/sellers',
                    'No sales tracking',
                    'Poor customer experience'
                  ].map((problem, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>{problem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                CarLinq Provides:
              </h3>
              <div className="space-y-4">
                {[
                  'Verified vehicle listings',
                  'Professional dealer network',
                  'Secure communication platform',
                  'Sales analytics dashboard',
                  'Transaction verification system'
                ].map((solution, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{solution}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Why Choose CarLinq?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The professional SaaS platform built for African car trading
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
{/* How It Works Section */}
<section
  className="py-12 sm:py-16 lg:py-24 relative overflow-hidden bg-gray-50 dark:bg-gray-900"
  style={{
    backgroundImage: "url('/background/background.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>

  {/* Dark Overlay for readability */}
  <div className="absolute inset-0 bg-black/30 dark:bg-black/40 pointer-events-none"></div>

  {/* Main Content */}
  <div className="relative container mx-auto px-4 sm:px-6 z-10">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center mb-12 sm:mb-16"
    >
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
        How It Works
      </h2>
      <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto">
        Simple, secure, and efficient car trading in three easy steps
      </p>
    </motion.div>

    <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto relative z-10">
      {[
        { step: '01', title: 'List or Browse', description: 'Dealers list verified vehicles. Buyers browse with confidence.' },
        { step: '02', title: 'Connect Securely', description: 'Use our platform to communicate and verify details safely.' },
        { step: '03', title: 'Complete Transaction', description: 'Finalize the deal and get incentives for verified purchases.' }
      ].map((step, index) => (
        <motion.div
          key={step.step}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          viewport={{ once: true }}
          className="text-center relative bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white text-xl sm:text-2xl font-bold shadow-lg">
            {step.step}
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
            {step.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            {step.description}
          </p>

          {/* Connector line */}
          {index < 2 && (
            <div className="hidden md:block absolute top-1/2 left-3/4 w-1/2 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform -translate-y-1/2 -z-10"></div>
          )}
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of satisfied dealers and buyers across Africa
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic text-sm sm:text-base">
                  {testimonial.content}
                </p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-primary-600 dark:text-primary-400">
                    {testimonial.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
              Ready to Transform Your Car Trading?
            </h2>
            <p className="text-lg sm:text-xl text-primary-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join CarLinq today and experience professional car trading with trust and transparency
            </p>
           <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => window.location.href = '/dealers/dealer-register'}
    className="w-full sm:w-auto bg-white text-primary-600 hover:bg-gray-100 font-semibold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
  >
    Get Started Free
  </motion.button>
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => window.location.href = '/demo'}
    className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300"
  >
    Schedule a Demo
  </motion.button>
</div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

