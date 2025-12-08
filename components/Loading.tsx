// app/components/Loading.tsx
'use client';

import React from 'react';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/background/carbackground.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
      </div>

      {/* Loading Content */}
      <div className="relative z-10 text-center">
        {/* Spinning Gear Icon */}
        <div className="relative mb-6">
          <svg 
            className="w-16 h-16 text-orange-500 animate-spin"
            fill="none" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        {/* CarLinq Logo with your exact style */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight select-none italic">
            {/* Car - Dark Bold Orange */}
            <span
              className="ml-0"
              style={{
                color: '#FF8C00',
                textShadow: `
                  0 2px 0 #000,
                  1px 1px 0 rgba(0,0,0,0.3), 
                  2px 2px 0 rgba(0,0,0,0.2)
                `,
              }}
            >
              Cɑr
            </span>

            {/* Linq - Dark Bold Blue */}
            <span
              className="ml-1"
              style={{
                color: '#0277BD',
                textShadow: `
                  0 2px 0 #000,
                  1px 1px 0 rgba(0,0,0,0.3), 
                  2px 2px 0 rgba(0,0,0,0.2)
                `,
              }}
            >
              Linq
            </span>
          </h1>
          <p className="text-sm text-white/80 mt-2 tracking-wide">
            Professional Car Trading Platform
          </p>
        </div>

        {/* Loading Text */}
        <div className="text-white/90">
          <p className="text-lg font-medium mb-2">Loading...</p>
          <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-orange-500 to-blue-500 animate-[shimmer_1.5s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;