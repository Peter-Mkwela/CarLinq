/* eslint-disable react/no-unescaped-entities */
'use client'
export const dynamic = 'force-dynamic';;

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Cookie, Shield, FileText, UserCheck } from 'lucide-react';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/background/footer2.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-transparent to-secondary-900/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>

            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFA500] to-[#FF8C00] rounded-lg flex items-center justify-center shadow-lg">
                <Cookie className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">Cookie Policy</h1>
            </div>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Last updated:{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
              })}
            </p>
          </motion.div>

          {/* Cookie Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl"
          >
            <div className="prose prose-lg max-w-none prose-invert">
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="text-[#FFA500]" />
                  1. Introduction
                </h2>
                <p className="text-white/90 leading-relaxed">
                  This Cookie Policy explains how CarLinq uses cookies and similar technologies to recognize you when you visit our website and platform. It explains what these technologies are and why we use them.
                </p>
              </section>

              {/* What are Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="text-[#FFA500]" />
                  2. What Are Cookies
                </h2>
                <p className="text-white/90 leading-relaxed">
                  Cookies are small data files placed on your device to help the website function properly, enhance your experience, and analyze usage.
                </p>
              </section>

              {/* Types of Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Cookie className="text-[#FFA500]" />
                  3. Types of Cookies We Use
                </h2>
                <ul className="text-white/90 space-y-2 list-disc list-inside">
                  <li>
                    <strong>Essential Cookies:</strong> Necessary for the website to function properly.
                  </li>
                  <li>
                    <strong>Performance Cookies:</strong> Help us understand user interactions to improve performance.
                  </li>
                  <li>
                    <strong>Functional Cookies:</strong> Remember your preferences and settings.
                  </li>
                  <li>
                    <strong>Targeting Cookies:</strong> Used for marketing and tracking interests.
                  </li>
                </ul>
              </section>

              {/* How We Use Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <UserCheck className="text-[#FFA500]" />
                  4. How We Use Cookies
                </h2>
                <p className="text-white/90 leading-relaxed">
                  Cookies help us improve website functionality, personalize content, provide social media features, and analyze traffic.
                </p>
              </section>

              {/* Managing Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="text-[#FFA500]" />
                  5. Managing Cookies
                </h2>
                <p className="text-white/90 leading-relaxed">
                  You can set your browser to refuse cookies or alert you when cookies are being sent. However, some features of the platform may not function properly if cookies are disabled.
                </p>
              </section>

              {/* Changes to Cookie Policy */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="text-[#FFA500]" />
                  6. Changes to This Cookie Policy
                </h2>
                <p className="text-white/90 leading-relaxed">
                  We may update this Cookie Policy from time to time. Continued use of CarLinq constitutes acceptance of any changes.
                </p>
              </section>

              {/* Contact Us */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Cookie className="text-[#FFA500]" />
                  7. Contact Us
                </h2>
                <div className="text-white/90 space-y-2">
                  <p>If you have questions about our use of cookies, contact us:</p>
                  <p>Email: legal@carlinq.com</p>
                  <p>Phone: +263 782 379 164</p>
                  <p>Address: Harare, Zimbabwe</p>
                </div>
              </section>

              {/* Acceptance Box */}
              <div className="mt-12 p-6 bg-white/5 rounded-lg border border-white/10">
                <p className="text-white text-center font-semibold">
                  By using CarLinq, you acknowledge that you have read, understood, and agree to this Cookie Policy.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

