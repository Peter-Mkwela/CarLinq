/* eslint-disable @typescript-eslint/no-unused-vars */
// app/cars/[id]/CarGallery.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Car, ChevronLeft, ChevronRight, X, Share2, Heart } from 'lucide-react';

interface CarGalleryProps {
  car: {
    id: string;
    images: string[];
    make: string;
    model: string;
    status: string;
  };
}

export default function CarGallery({ car }: CarGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if car is in favorites
  const checkFavorite = () => {
    if (typeof window !== 'undefined') {
      const favorites = localStorage.getItem('clientFavorites');
      if (favorites) {
        const favoriteIds = JSON.parse(favorites);
        setIsFavorite(favoriteIds.includes(car.id));
      }
    }
  };

  // Toggle favorite
  const toggleFavorite = () => {
    if (typeof window !== 'undefined') {
      const favorites = localStorage.getItem('clientFavorites');
      let currentFavorites = favorites ? JSON.parse(favorites) : [];
      
      if (isFavorite) {
        currentFavorites = currentFavorites.filter((id: string) => id !== car.id);
      } else {
        currentFavorites.push(car.id);
      }
      
      localStorage.setItem('clientFavorites', JSON.stringify(currentFavorites));
      setIsFavorite(!isFavorite);
      
      // Sync with API (optional)
      const sessionId = localStorage.getItem('car_session_id');
      if (sessionId) {
        fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listingId: car.id,
            sessionId,
            action: isFavorite ? 'remove' : 'add'
          }),
        });
      }
    }
  };

  // Share car
  const shareCar = () => {
    const carPageUrl = window.location.href;
    const message = `Check out this ${car.make} ${car.model} on CarLinq!`;
    
    if (navigator.share) {
      navigator.share({
        title: `${car.make} ${car.model}`,
        text: message,
        url: carPageUrl,
      });
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message + '\n\n' + carPageUrl)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl">
        {car.images.length > 0 ? (
          <div 
            className="w-full h-[400px] relative cursor-pointer"
            onClick={() => setIsGalleryOpen(true)}
          >
            <Image
              src={car.images[selectedImage]}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        ) : (
          <div className="w-full h-[400px] bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center">
            <Car className="w-24 h-24 text-orange-400" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${
            car.status === 'AVAILABLE'
              ? 'bg-green-500 text-white'
              : car.status === 'SOLD'
              ? 'bg-red-500 text-white'
              : 'bg-amber-400 text-gray-900'
          }`}>
            {car.status.charAt(0) + car.status.slice(1).toLowerCase()}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={shareCar}
            className="p-2.5 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-colors shadow-lg"
          >
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={toggleFavorite}
            className={`p-2.5 backdrop-blur-sm rounded-xl shadow-lg transition-colors ${
              isFavorite
                ? 'bg-red-500/90 text-white hover:bg-red-600'
                : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
        
        {/* Gallery Indicator */}
        {car.images.length > 1 && (
          <div className="absolute bottom-4 left-4 right-4 flex justify-center">
            <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 inline-flex gap-2">
              {car.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === selectedImage
                      ? 'bg-white scale-125'
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {car.images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {car.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative rounded-lg overflow-hidden border-2 transition-all aspect-square ${
                selectedImage === idx
                  ? 'border-orange-500'
                  : 'border-transparent hover:border-orange-300'
              }`}
            >
              <Image
                src={img}
                alt={`View ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 12.5vw"
              />
              {selectedImage === idx && (
                <div className="absolute inset-0 bg-orange-500/20" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Gallery Modal */}
      {isGalleryOpen && car.images.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-4 right-4 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          {car.images.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImage((prev) => (prev - 1 + car.images.length) % car.images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setSelectedImage((prev) => (prev + 1) % car.images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
          
          <div className="relative w-full h-full max-w-4xl">
            <Image
              src={car.images[selectedImage]}
              alt={`${car.make} ${car.model} - Full view`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 p-4 overflow-x-auto">
            {car.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                  idx === selectedImage
                    ? 'border-orange-500 scale-105'
                    : 'border-transparent hover:border-white/50'
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
          
          <div className="absolute bottom-4 right-4 z-10 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
            {selectedImage + 1} / {car.images.length}
          </div>
        </div>
      )}
    </div>
  );
}