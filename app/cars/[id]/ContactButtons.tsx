// app/cars/[id]/ContactButtons.tsx
'use client';

import { Phone, MessageCircle, Mail, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface ContactButtonsProps {
  car: {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    transmission: string;
    fuelType: string;
    location: string;
    images: string[];
    dealer: {
      companyName: string;
      name: string;
      phone: string;
      email: string;
    };
  };
  formattedPhone: string;
}

export default function ContactButtons({ car, formattedPhone }: ContactButtonsProps) {
  const [copied, setCopied] = useState(false);

  const createWhatsAppDealerMessage = () => {
    const carImageUrl = car.images && car.images.length > 0 
      ? car.images[0] 
      : 'https://via.placeholder.com/600x400/1e3a8a/ffffff?text=Car+Image';
    
    const currentUrl = window.location.href;
    
    return `Hello ${car.dealer.name || car.dealer.companyName},\n\n` +
      `I am interested in your *${car.make} ${car.model} (${car.year})* listed for *$${car.price.toLocaleString()}*.\n\n` +
      `*Vehicle Details:*\n` +
      `• Make & Model: ${car.make} ${car.model}\n` +
      `• Year: ${car.year}\n` +
      `• Price: $${car.price.toLocaleString()}\n` +
      `• Mileage: ${car.mileage.toLocaleString()} km\n` +
      `• Transmission: ${car.transmission}\n` +
      `• Fuel Type: ${car.fuelType}\n` +
      `• Location: ${car.location}\n\n` +
      `*Car Image:* ${carImageUrl}\n` +
      `*View Full Listing:* ${currentUrl}\n\n` +
      `Could you please provide me with:\n` +
      `1. Vehicle history report/service records\n` +
      `2. Additional high-quality photos\n` +
      `3. Available test drive dates & location\n` +
      `4. Any financing or payment options\n` +
      `5. Current condition and any issues\n\n` +
      `Thank you!\n\n` +
      `Best regards,\n` +
      `[Your Name/Contact Info]`;
  };

  const handleWhatsApp = () => {
    const message = createWhatsAppDealerMessage();
    const whatsappUrl = `https://wa.me/${car.dealer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShare = () => {
    const carImageUrl = car.images && car.images.length > 0 
      ? car.images[0] 
      : 'https://via.placeholder.com/600x400/1e3a8a/ffffff?text=Car+Image';
    
    const currentUrl = window.location.href;
    
    const message = `🚗 *${car.make} ${car.model} (${car.year})*\n\n` +
      `💰 *Price:* $${car.price.toLocaleString()}\n` +
      `📏 *Mileage:* ${car.mileage.toLocaleString()} km\n` +
      `⚙️ *Transmission:* ${car.transmission}\n` +
      `⛽ *Fuel Type:* ${car.fuelType}\n` +
      `📍 *Location:* ${car.location}\n\n` +
      `🏢 *Dealer:* ${car.dealer.companyName}\n\n` +
      `📸 *Car Image:* ${carImageUrl}\n` +
      `🔗 *View Full Details:* ${currentUrl}\n\n` +
      `_Check out this amazing vehicle!_\n` +
      `_Shared via Premium CarDealer App_`;
    
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(shareUrl, '_blank');
  };

  const copyPhoneNumber = () => {
    navigator.clipboard.writeText(formattedPhone).then(() => {
      setCopied(true);
      toast.success('Phone number copied!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(car.dealer.email).then(() => {
      toast.success('Email copied!');
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Options</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* WhatsApp */}
        <button
          onClick={handleWhatsApp}
          className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-lg"
        >
          <MessageCircle className="w-5 h-5" />
          <span>WhatsApp Dealer</span>
        </button>
        
        {/* Phone Call */}
        <a
          href={`tel:${car.dealer.phone}`}
          className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-lg"
        >
          <Phone className="w-5 h-5" />
          <span>Call Now</span>
        </a>
        
        {/* Email */}
        <a
          href={`mailto:${car.dealer.email}`}
          className="flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-lg"
        >
          <Mail className="w-5 h-5" />
          <span>Send Email</span>
        </a>
        
        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-lg"
        >
          <Share2 className="w-5 h-5" />
          <span>Share Car</span>
        </button>
      </div>
      
      {/* Copy Contact Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Copy Contact Info</h4>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={copyPhoneNumber}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="font-medium">{formattedPhone}</span>
            {copied && <span className="text-green-600 text-sm">✓ Copied</span>}
          </button>
          
          <button
            onClick={copyEmail}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span className="truncate">{car.dealer.email}</span>
          </button>
        </div>
      </div>
    </div>
  );
}