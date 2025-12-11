/* eslint-disable react/no-unescaped-entities */
'use client'
export const dynamic = 'force-dynamic';;

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Shield, FileText, Cookie, UserCheck } from 'lucide-react';

export default function PrivacyPolicy() {
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
              <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
            </div>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Last updated:{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
              })}
            </p>
          </motion.div>

          {/* Privacy Content */}
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
                  At CarLinq, your privacy is important. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.
                </p>
              </section>

              {/* Information We Collect */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="text-[#FFA500]" />
                  2. Information We Collect
                </h2>
                <ul className="text-white/90 space-y-2 list-disc list-inside">
                  <li>Personal details such as name, email, and phone number</li>
                  <li>Account information and login credentials</li>
                  <li>Usage data and interactions on our platform</li>
                  <li>Information provided during transactions with dealers</li>
                </ul>
              </section>

              {/* How We Use Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <UserCheck className="text-[#FFA500]" />
                  3. How We Use Information
                </h2>
                <p className="text-white/90 leading-relaxed">
                  We use the collected information to provide, maintain, and improve our services, communicate with users, process transactions, and ensure platform security.
                </p>
              </section>

              {/* Sharing of Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="text-[#FFA500]" />
                  4. Sharing of Information
                </h2>
                <p className="text-white/90 leading-relaxed">
                  CarLinq does not sell your personal information. We may share information with trusted partners, legal authorities, or service providers necessary for platform operations.
                </p>
              </section>

              {/* Security of Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="text-[#FFA500]" />
                  5. Security of Information
                </h2>
                <p className="text-white/90 leading-relaxed">
                  We implement appropriate security measures to protect your data from unauthorized access, disclosure, or alteration.
                </p>
              </section>

              {/* Your Rights */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <UserCheck className="text-[#FFA500]" />
                  6. Your Rights
                </h2>
                <p className="text-white/90 leading-relaxed">
                  You have the right to access, correct, or delete your personal information, and to withdraw consent for processing where applicable.
                </p>
              </section>

              {/* Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Cookie className="text-[#FFA500]" />
                  7. Cookies
                </h2>
                <p className="text-white/90 leading-relaxed">
                  We use cookies to improve user experience, analyze usage, and personalize content. You can manage cookie preferences via your browser settings.
                </p>
              </section>

              {/* Changes to Privacy Policy */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="text-[#FFA500]" />
                  8. Changes to Privacy Policy
                </h2>
                <p className="text-white/90 leading-relaxed">
                  We may update this Privacy Policy periodically. Continued use of the platform constitutes acceptance of any changes.
                </p>
              </section>

              {/* Contact Us */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="text-[#FFA500]" />
                  9. Contact Us
                </h2>
                <div className="text-white/90 space-y-2">
                  <p>If you have any questions regarding this Privacy Policy, contact us:</p>
                  <p>Email: legal@carlinq.com</p>
                  <p>Phone: +263 782 379 164</p>
                  <p>Address: Harare, Zimbabwe</p>
                </div>
              </section>

              {/* Acceptance Box */}
              <div className="mt-12 p-6 bg-white/5 rounded-lg border border-white/10">
                <p className="text-white text-center font-semibold">
                  By using CarLinq, you acknowledge that you have read, understood, and agree to this Privacy Policy.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

