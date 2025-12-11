// components/WhatsAppShareButton.tsx
'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface WhatsAppShareButtonProps {
  message: string;
  className?: string;
  children?: React.ReactNode;
  title?: string;
}

export default function WhatsAppShareButton({ 
  message, 
  className = '', 
  children,
  title = "Share on WhatsApp" 
}: WhatsAppShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      toast.success('Message copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleShare}
        className={className}
        title={title}
      >
        {children || (
          <>
            <Share2 className="w-4 h-4" />
            Share on WhatsApp
          </>
        )}
      </button>
      
      <button
        onClick={handleCopyLink}
        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        title="Copy message to clipboard"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Share2 className="w-4 h-4 text-gray-600" />
        )}
      </button>
    </div>
  );
}