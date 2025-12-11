// app/cars/[id]/ContactButtons.tsx
'use client';

import { MessageCircle, PhoneCall } from 'lucide-react';

interface ContactButtonsProps {
  car: {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
  };
  formattedPhone: string;
}

export default function ContactButtons({ car, formattedPhone }: ContactButtonsProps) {
  // Create WhatsApp link
  const createWhatsAppLink = () => {
    const phone = formattedPhone;
    if (!phone || phone === 'Not provided') return '#';
    
    const cleanedPhone = phone.replace(/\D/g, '');
    let whatsappNumber = cleanedPhone;
    
    if (cleanedPhone.startsWith('0') && cleanedPhone.length === 10) {
      whatsappNumber = '263' + cleanedPhone.slice(1);
    } else if (cleanedPhone.length === 9) {
      whatsappNumber = '263' + cleanedPhone;
    } else if (cleanedPhone.startsWith('263') && cleanedPhone.length === 12) {
      whatsappNumber = cleanedPhone;
    } else if (cleanedPhone.startsWith('+263') && cleanedPhone.length === 13) {
      whatsappNumber = cleanedPhone.slice(1);
    }
    
    const carPageUrl = window.location.href;
    const message = `Hi, I'm interested in your ${car.make} ${car.model} (${car.year}) listed for $${car.price.toLocaleString()} on CarLinq.

View details: ${carPageUrl}

Could you provide more information?`;
    
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  // Track inquiry
  const trackInquiry = async () => {
    try {
      const sessionId = localStorage.getItem('car_session_id') || 'unknown';
      await fetch(`/api/listings/${car.id}/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
    } catch (error) {
      console.error('Error tracking inquiry:', error);
    }
  };

  // Handle phone call
  const handlePhoneCall = () => {
    if (formattedPhone && formattedPhone !== 'Not provided') {
      window.location.href = `tel:${formattedPhone}`;
    }
  };

  const whatsappLink = createWhatsAppLink();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={trackInquiry}
        className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        
      >
        <MessageCircle className="w-6 h-6" />
        {formattedPhone === 'Not provided' ? 'Phone Not Available' : 'Contact on WhatsApp'}
      </a>
      <button
        onClick={handlePhoneCall}
        className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={formattedPhone === 'Not provided'}
      >
        <PhoneCall className="w-6 h-6" />
        {formattedPhone === 'Not provided' ? 'Call Not Available' : 'Call Dealer'}
      </button>
    </div>
  );
}