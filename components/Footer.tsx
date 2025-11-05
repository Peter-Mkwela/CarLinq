'use client';

import { useTheme } from '@/app/providers/theme-provider';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Shield,
  FileText,
  Cookie,
  Car
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();

  const socialLinks = [
    { name: 'Facebook', icon: <Facebook size={18} className="text-blue-400" />, url: 'https://facebook.com' },
    { name: 'Twitter', icon: <Twitter size={18} className="text-sky-400" />, url: 'https://twitter.com' },
    { name: 'Instagram', icon: <Instagram size={18} className="text-pink-400" />, url: 'https://instagram.com' },
    { name: 'LinkedIn', icon: <Linkedin size={18} className="text-blue-300" />, url: 'https://linkedin.com' },
  ];

  const contactInfo = [
    {
      icon: <Phone size={16} className="text-[#FFA500]" />,
      content: <a href="tel:+263782379164" className="hover:text-white transition-colors text-sm">+263 782 379 164</a>,
      label: 'Phone'
    },
    {
      icon: <MapPin size={16} className="text-[#FFA500]" />,
      content: <span className="text-sm">Across Africa</span>,
      label: 'Location'
    },
    {
      icon: <Mail size={16} className="text-[#FFA500]" />,
      content: <a href="mailto:support@carlinq.com" className="hover:text-white transition-colors text-sm">support@carlinq.com</a>,
      label: 'Email'
    }
  ];

  const legalLinks = [
    { name: 'Terms of Service', icon: <FileText size={14} />, url: '/terms' },
    { name: 'Privacy Policy', icon: <Shield size={14} />, url: '/privacy' },
    { name: 'Cookie Policy', icon: <Cookie size={14} />, url: '/cookie-policy' },
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
      ></div>

      {/* Dark Blue Overlay */}
      <div className="absolute inset-0 bg-[#000033]/85 z-[1]" />

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-6">
        {/* Top Row: Logo + Social Links + Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-6"
        >
          {/* Logo and Company Name */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-10 h-10 bg-gradient-to-br from-[#FFA500] to-yellow-600 rounded-lg flex items-center justify-center shadow-md"
            >
              <Car className="w-6 h-6 text-white" />
            </motion.div>
            <div className="text-left">
              <motion.p
  className="text-lg font-semibold"
  whileHover={{ x: 3 }}
  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
>
  {/* Car - Dark Bold Orange with black vertical line */}
  {/* Car - skewed forward, using alpha a */}
<span
  className="inline-block italic transform skew-x-[10deg]"
  style={{
    color: theme === 'light' ? '#FF8C00' : '#CC6600', // bold dark orange
    textShadow: `
      0 2px 0 #000,   /* black vertical shadow slightly downward */
      1px 1px 0 rgba(0,0,0,0.3),
      2px 2px 0 rgba(0,0,0,0.2)
    `,
  }}
>
  Cɑr
</span>

{/* Linq - Dark Bold Blue with black vertical shadow, reduced spacing */}
<span
  className="inline-block italic transform skew-x-[10deg]"
  style={{
    color: theme === 'light' ? '#0277BD' : '#01579B', // dark blue
    textShadow: `
      0 2px 0 #000,  
      1px 1px 0 rgba(0,0,0,0.3),
      2px 2px 0 rgba(0,0,0,0.2)
    `,
    marginLeft: '0.1rem', // tighter spacing
  }}
>
  Linq
</span>

</motion.p>

              <motion.p
                className="text-xs text-[#FFA500]/80 -mt-0.5"
                whileHover={{ x: 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 10 }}
              >
                Linking You to the Perfect Ride
              </motion.p>
            </div>
          </Link>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFE5B4]/70 hover:text-white transition-all bg-white/5 p-2 rounded-lg backdrop-blur-sm shadow-sm"
                aria-label={social.name}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center gap-4 text-sm"
          >
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.label}
                className="flex items-center gap-2 text-[#FFE5B4]/80 group"
                whileHover={{ scale: 1.05 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-white/10 p-1.5 rounded-md shadow-sm group-hover:bg-white/20 transition-colors">
                  {item.icon}
                </div>
                <div className="group-hover:text-white transition-colors whitespace-nowrap">
                  {item.content}
                </div>
                {index < contactInfo.length - 1 && (
                  <div className="hidden sm:block w-px h-4 bg-[#FFA500]/30 mx-1" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Legal Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 md:gap-6 text-xs border-t border-[#FFA500]/20 pt-4"
        >
          {legalLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.url}
              className="flex items-center gap-2 text-[#FFE5B4]/70 hover:text-[#FFA500] transition-all bg-white/5 px-3 py-2 rounded-lg backdrop-blur-sm hover:bg-white/10"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {link.icon}
              {link.name}
            </motion.a>
          ))}
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center text-[#FFE5B4]/80 text-xs tracking-wide mt-4 pt-4 border-t border-[#FFA500]/20"
        >
          <p>© {currentYear} CarLinq (PVT) LTD. All rights reserved.</p>
          <a
  href="https://mkwelatech.vercel.app"
  target="_blank"
  rel="noopener noreferrer"
  className="text-xs mt-2 hover:text-blue-400 transition-colors inline-block"
>
  Developed by{' '}
  <span className="text-white">Mkwela</span>
  <span className="text-[#FFA500]">Tech</span> Solutions
</a>

        </motion.div>
      </div>
    </footer>
  );
}
