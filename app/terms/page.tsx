/* eslint-disable react/no-unescaped-entities */
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Shield, FileText, Cookie, UserCheck } from 'lucide-react';

export default function TermsOfService() {
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
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
            </div>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Last updated:{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
              })}
            </p>
          </motion.div>

          {/* Terms Content */}
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
                  Welcome to CarLinq. These Terms of Service govern your use of our
                  platform and services. By accessing or using CarLinq, you agree to be
                  bound by these terms and our Privacy Policy.
                </p>
              </section>

              {/* Definitions */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="text-[#FFA500]" />
                  2. Definitions
                </h2>
                <ul className="text-white/90 space-y-2 list-disc list-inside">
                  <li>
                    <strong>"Platform"</strong> refers to the CarLinq website, mobile
                    applications, and services
                  </li>
                  <li>
                    <strong>"User"</strong> refers to any individual or entity accessing
                    our platform
                  </li>
                  <li>
                    <strong>"Dealer"</strong> refers to verified car dealerships using our
                    platform
                  </li>
                  <li>
                    <strong>"Buyer"</strong> refers to individuals browsing or purchasing
                    vehicles
                  </li>
                  <li>
                    <strong>"Content"</strong> includes all information, data, text, and
                    images on our platform
                  </li>
                </ul>
              </section>

              {/* User Accounts */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <UserCheck className="text-[#FFA500]" />
                  3. User Accounts
                </h2>
                <div className="space-y-4 text-white/90">
                  <p>
                    To access certain features, you must create an account. You are
                    responsible for:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Providing accurate and complete information</li>
                    <li>Maintaining the security of your account credentials</li>
                    <li>All activities that occur under your account</li>
                    <li>Promptly updating any changes to your information</li>
                  </ul>
                  <p>
                    CarLinq reserves the right to suspend or terminate accounts that
                    violate these terms.
                  </p>
                </div>
              </section>

              {/* Dealer Responsibilities */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="text-[#FFA500]" />
                  4. Dealer Responsibilities
                </h2>
                <div className="space-y-4 text-white/90">
                  <p>Dealers using our platform agree to:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Provide accurate vehicle information and pricing</li>
                    <li>Maintain valid business licenses and certifications</li>
                    <li>Respond promptly to buyer inquiries</li>
                    <li>Honor advertised prices and vehicle conditions</li>
                    <li>Comply with all applicable laws and regulations</li>
                  </ul>
                </div>
              </section>

              {/* Buyer Responsibilities */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <UserCheck className="text-[#FFA500]" />
                  5. Buyer Responsibilities
                </h2>
                <div className="space-y-4 text-white/90">
                  <p>Buyers using our platform agree to:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Provide accurate personal information when required</li>
                    <li>Conduct due diligence before purchasing vehicles</li>
                    <li>Communicate respectfully with dealers</li>
                    <li>Honor agreed-upon purchase terms</li>
                  </ul>
                </div>
              </section>

              {/* Payments and Fees */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="text-[#FFA500]" />
                  6. Payments and Fees
                </h2>
                <div className="space-y-4 text-white/90">
                  <p>
                    CarLinq may charge fees for certain services. All fees are clearly
                    displayed before transaction completion. You agree to pay all
                    applicable fees and taxes.
                  </p>
                </div>
              </section>

              {/* Intellectual Property */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="text-[#FFA500]" />
                  7. Intellectual Property
                </h2>
                <div className="space-y-4 text-white/90">
                  <p>
                    All content on the CarLinq platform, including logos, text, graphics,
                    and software, is owned by CarLinq or our licensors and is protected by
                    intellectual property laws.
                  </p>
                </div>
              </section>

              {/* Privacy */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Cookie className="text-[#FFA500]" />
                  8. Privacy
                </h2>
                <p className="text-white/90">
                  Your privacy is important to us. Please review our{' '}
                  <Link href="/privacy" className="text-[#FFA500] hover:underline">
                    Privacy Policy
                  </Link>{' '}
                  to understand how we collect, use, and protect your information.
                </p>
              </section>

              {/* Remaining sections styled similarly */}
              {/* ... 9. Limitation, 10. Termination, 11. Changes, 12. Governing Law, 13. Contact Us */}
              {/* Use <Shield>, <UserCheck>, or <Cookie> icons for consistency */}
              {/* Acceptance Box */}
              <div className="mt-12 p-6 bg-white/5 rounded-lg border border-white/10">
                <p className="text-white text-center font-semibold">
                  By using CarLinq, you acknowledge that you have read, understood, and
                  agree to be bound by these Terms of Service.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
