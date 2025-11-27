/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useTheme } from '@/app/providers/theme-provider';
import {
  Mail,
  Phone,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Shield,
  FileText,
  Cookie,
  Car,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();

  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: <Facebook size={20} className="text-white" />, 
      url: 'https://facebook.com',
      gradient: "from-blue-600 to-blue-800",
      hover: "hover:from-blue-500 hover:to-blue-700"
    },
    { 
      name: 'Twitter', 
      icon: <Twitter size={20} className="text-white" />, 
      url: 'https://twitter.com',
      gradient: "from-sky-500 to-blue-600",
      hover: "hover:from-sky-400 hover:to-blue-500"
    },
    { 
      name: 'Instagram', 
      icon: <Instagram size={20} className="text-white" />, 
      url: 'https://instagram.com',
      gradient: "from-pink-600 to-purple-700",
      hover: "hover:from-pink-500 hover:to-purple-600"
    },
    { 
      name: 'LinkedIn', 
      icon: <Linkedin size={20} className="text-white" />, 
      url: 'https://linkedin.com',
      gradient: "from-blue-700 to-blue-900",
      hover: "hover:from-blue-600 hover:to-blue-800"
    },
  ];

  const contactInfo = [
    {
      icon: <Phone size={18} className="text-white" />,
      content: <a href="tel:+263782379164" className="hover:text-orange-300 transition-colors text-sm font-medium">+263 782 379 164</a>,
      label: 'Phone',
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: <Globe size={18} className="text-white" />,
      content: <span className="text-sm font-medium">Across Africa</span>,
      label: 'Location',
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      icon: <Mail size={18} className="text-white" />,
      content: <a href="mailto:support@carlinq.com" className="hover:text-orange-300 transition-colors text-sm font-medium">support@carlinq.com</a>,
      label: 'Email',
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const legalLinks = [
    { 
      name: 'Terms of Service', 
      icon: <FileText size={16} className="text-white" />, 
      url: '/terms',
      gradient: "from-gray-600 to-gray-700"
    },
    { 
      name: 'Privacy Policy', 
      icon: <Shield size={16} className="text-white" />, 
      url: '/privacy',
      gradient: "from-blue-600 to-indigo-700"
    },
    { 
      name: 'Cookie Policy', 
      icon: <Cookie size={16} className="text-white" />, 
      url: '/cookie-policy',
      gradient: "from-amber-600 to-orange-600"
    },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/background/footer.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000033]/90 via-[#1a1a4a]/95 to-[#000033]/90 z-[1]" />
      
      {/* Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10 z-[1]"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #FFA500 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #0277BD 2px, transparent 2px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        {/* Top Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 mb-8"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
  <motion.div
    whileHover={{ scale: 1.1, rotate: 5 }}
    whileTap={{ scale: 0.95 }}
    className="relative"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl blur-md opacity-50 group-hover:opacity-70 transition-opacity" />
    <div className="relative w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-lg border border-orange-400/30 overflow-visible">
      <Car className="w-6 h-6 text-white" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-1 -right-1"
      >
        <Sparkles size={12} className="text-yellow-300" />
      </motion.div>
    </div>
  </motion.div>

  <div className="text-left overflow-visible">
    <motion.p
      className="text-xl font-bold tracking-tight overflow-visible"
      whileHover={{ x: 3 }}
    >
      <span className="inline-flex italic">
        <span
          style={{
            background: 'linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: `0 2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)`,
          }}
        >
          Cɑr
        </span>
        <span
          style={{
            background: 'linear-gradient(135deg, #0277BD 0%, #029BE5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: `0 2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)`,
          }}
        >
          Linq
        </span>
      </span>
    </motion.p>

    <motion.p className="text-sm text-orange-200/80 -mt-1 font-light tracking-wide">
      Linking You to the Perfect Ride
    </motion.p>
  </div>
</Link>


          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 sm:gap-3"
          >
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`bg-gradient-to-br ${social.gradient} ${social.hover} p-2.5 sm:p-3 rounded-xl shadow-lg backdrop-blur-sm border border-white/10`}
                aria-label={social.name}
                whileHover={{ scale: 1.15, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-sm"
          >
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.label}
                className="flex items-center gap-2.5 sm:gap-3 group"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <div className={`bg-gradient-to-br ${item.gradient} p-2 rounded-lg shadow-lg`}>
                  {item.icon}
                </div>
                <div className="text-white/90 group-hover:text-white whitespace-nowrap font-medium">
                  {item.content}
                </div>
                {index < contactInfo.length - 1 && (
                  <div className="hidden sm:block w-px h-5 bg-gradient-to-b from-transparent via-orange-400/50 to-transparent mx-2" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Legal Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 sm:gap-4 pt-6 border-t border-orange-400/30"
        >
          {legalLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.url}
              className={`flex items-center gap-2 text-white/80 hover:text-white bg-gradient-to-br ${link.gradient} px-3.5 sm:px-4 py-2 rounded-xl backdrop-blur-sm hover:shadow-lg border border-white/10`}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              {link.icon}
              <span className="font-medium">{link.name}</span>
            </motion.a>
          ))}
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center text-white/70 text-sm tracking-wide mt-6 pt-6 border-t border-orange-400/20"
        >
          <p className="font-light">© {currentYear} CarLinq (PVT) LTD. All rights reserved.</p>
  <a
  href="https://mkwelatech.vercel.app"
  target="_blank"
  rel="noopener noreferrer"
  className="group inline-flex items-center gap-1 mt-2 hover:text-orange-300 transition-colors font-medium"
>
  Developed by{' '}
  <span className="inline-flex">
    <span className="text-white group-hover:text-blue-300">Mkwela</span>
    <span className="text-orange-400 group-hover:text-orange-300">Tech</span>
  </span>
  <span className="text-white/60 group-hover:text-white ml-1">Solutions</span>
  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="ml-1">
    <Sparkles size={12} className="text-yellow-300" />
  </motion.div>
</a>

        </motion.div>
      </div>
    </footer>
  );
}
