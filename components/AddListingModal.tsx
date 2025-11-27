/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useState } from 'react';
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { motion } from 'framer-motion';
import { 
  Car, 
  X,
  Sparkles,
  Settings,
  Badge,
  FileText,
  Calendar,
  Gauge,
  Image as ImageIcon,
  Shield,
  MousePointer,
  ArrowLeft,
  MapPin,
  DollarSign,
  CheckCircle,
  Trash2,
  Plus,
  Cog
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface Listing {
  transmission: string;
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  status: string;
  views: number;
  inquiries: number;
  datePosted: string;
  fuelType: string;
  images: string[];
}

export interface NewListingForm {
  make: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  location: string;
  status: string;
  fuelType: string;
  transmission: string;
}

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (listing: any) => void;
}

export default function AddListingModal({ isOpen, onClose, onAddListing }: AddListingModalProps) {
  const [newListing, setNewListing] = useState<NewListingForm>({
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    location: '',
    status: 'available',
    fuelType: 'Petrol',
    transmission: 'Automatic',
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [filesSelected, setFilesSelected] = useState(false);

  const handleInputChange = (field: keyof NewListingForm, value: string) => {
    setNewListing(prev => ({ ...prev, [field]: value }));
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (imageUrls.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          make: newListing.make,
          model: newListing.model,
          year: newListing.year,
          price: newListing.price,
          mileage: newListing.mileage,
          location: newListing.location,
          transmission: newListing.transmission,
          fuelType: newListing.fuelType,
          description: 'Premium vehicle listing',
          imageUrls: imageUrls,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create listing');
      }

      const result = await response.json();
      
      // Call the parent's onAddListing callback with the created listing
      onAddListing(result.listing);
      
      // Reset form
      setNewListing({ 
        make: '', 
        model: '', 
        year: '', 
        price: '', 
        mileage: '', 
        location: '', 
        fuelType: 'Petrol',
        transmission: 'Automatic',
        status: 'available' 
      });
      setImageUrls([]);
      setFilesSelected(false);
      
      // Show success message
      toast.success('Vehicle listing created successfully!');
      
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create listing');
    }
  };

  const handleClose = () => {
    setFilesSelected(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-orange-500/20 rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl"
      >
        {/* Premium Header */}
        <div className="bg-gradient-to-r from-orange-500/10 via-orange-600/10 to-amber-600/10 border-b border-orange-500/30 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-gray-900 flex items-center justify-center">
                  <Plus className="w-3 h-3 text-gray-900" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                  Add New Vehicle
                </h3>
                <p className="text-orange-200/70 text-sm flex items-center gap-2 mt-1">
                  <Sparkles className="w-4 h-4" />
                  Create your premium vehicle listing
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-400/30 flex items-center justify-center transition-all duration-300 group"
            >
              <X className="w-5 h-5 text-white/70 group-hover:text-red-300 transition-colors duration-300" />
            </button>
          </div>
        </div>

        {/* Modern Form Content */}
        <div className="p-8 max-h-[calc(95vh-140px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Vehicle Details - Modern Grid Layout */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-orange-400 to-amber-500 rounded-full"></div>
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6 text-orange-400" />
                  <h4 className="text-xl font-semibold text-white">Vehicle Information</h4>
                </div>
              </div>
              
              {/* Modern Grid with Better Spacing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {([
                  { field: 'make', label: 'Vehicle Make', placeholder: 'e.g., Mercedes-Benz', icon: Badge },
                  { field: 'model', label: 'Model Series', placeholder: 'e.g., C-Class', icon: FileText },
                  { field: 'year', label: 'Manufacture Year', placeholder: 'e.g., 2023', icon: Calendar },
                  { field: 'price', label: 'Asking Price ($)', placeholder: 'e.g., 45,000', icon: DollarSign },
                ] as const).map(({ field, label, placeholder, icon: Icon }) => (
                  <div key={field} className="group">
                    <label className="block text-white/80 text-sm font-medium mb-3 flex items-center gap-2">
                      <Icon className="w-4 h-4 text-orange-400" />
                      {label}
                    </label>
                    <div className="relative">
                      <input
                        type={field === 'year' || field === 'price' ? 'number' : 'text'}
                        required
                        value={newListing[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="w-full px-4 pl-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 group-hover:border-white/20 backdrop-blur-sm"
                        placeholder={placeholder}
                        min={field === 'year' ? '1990' : field === 'price' ? '0' : undefined}
                        max={field === 'year' ? '2025' : undefined}
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-hover:text-orange-400 transition-colors duration-300">
                        {field === 'make' && <Car className="w-5 h-5" />}
                        {field === 'model' && <FileText className="w-5 h-5" />}
                        {field === 'year' && <Calendar className="w-5 h-5" />}
                        {field === 'price' && <DollarSign className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mileage & Location - Modern Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-white/80 text-sm font-medium mb-3 flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-orange-400" />
                    Vehicle Mileage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      value={newListing.mileage}
                      onChange={(e) => handleInputChange('mileage', e.target.value)}
                      className="w-full px-4 pl-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 group-hover:border-white/20 backdrop-blur-sm"
                      placeholder="e.g., 15,000"
                      min="0"
                    />
                    <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-hover:text-orange-400 transition-colors duration-300" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">km</span>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-white/80 text-sm font-medium mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    Vehicle Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={newListing.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-4 pl-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 group-hover:border-white/20 backdrop-blur-sm"
                      placeholder="e.g., Harare, Zimbabwe"
                    />
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-hover:text-orange-400 transition-colors duration-300" />
                  </div>
                </div>
              </div>

              {/* Fuel Type & Transmission - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fuel Type Dropdown */}
                <div className="group">
                  <label className="block text-white/80 text-sm font-medium mb-3 flex items-center gap-2">
                    <Car className="w-4 h-4 text-orange-400" />
                    Fuel Type
                  </label>
                  <div className="relative">
                    <select
                      value={newListing.fuelType}
                      onChange={(e) => handleInputChange('fuelType', e.target.value)}
                      className="w-full px-4 pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 group-hover:border-white/20 backdrop-blur-sm appearance-none cursor-pointer"
                    >
                      <option value="Petrol" className="bg-gray-900 text-white">Petrol</option>
                      <option value="Diesel" className="bg-gray-900 text-white">Diesel</option>
                      <option value="Electric" className="bg-gray-900 text-white">Electric</option>
                      <option value="Hybrid" className="bg-gray-900 text-white">Hybrid</option>
                    </select>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-hover:text-orange-400 transition-colors duration-300">
                      <Car className="w-5 h-5" />
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 group-hover:text-orange-400 transition-colors duration-300 pointer-events-none">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Transmission Dropdown */}
                <div className="group">
                  <label className="block text-white/80 text-sm font-medium mb-3 flex items-center gap-2">
                    <Cog className="w-4 h-4 text-orange-400" />
                    Transmission
                  </label>
                  <div className="relative">
                    <select
                      value={newListing.transmission}
                      onChange={(e) => handleInputChange('transmission', e.target.value)}
                      className="w-full px-4 pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 group-hover:border-white/20 backdrop-blur-sm appearance-none cursor-pointer"
                    >
                      <option value="Automatic" className="bg-gray-900 text-white">Automatic</option>
                      <option value="Manual" className="bg-gray-900 text-white">Manual</option>
                      <option value="Semi-Automatic" className="bg-gray-900 text-white">Semi-Automatic</option>
                      <option value="CVT" className="bg-gray-900 text-white">CVT</option>
                      <option value="Dual-Clutch" className="bg-gray-900 text-white">Dual-Clutch</option>
                    </select>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-hover:text-orange-400 transition-colors duration-300">
                      <Cog className="w-5 h-5" />
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 group-hover:text-orange-400 transition-colors duration-300 pointer-events-none">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modern Image Upload Section with UploadThing */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-orange-400 to-amber-500 rounded-full"></div>
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-6 h-6 text-orange-400" />
                  <h4 className="text-xl font-semibold text-white">Vehicle Gallery</h4>
                </div>
              </div>

              {/* UploadThing Dropzone */}
              <UploadDropzone<OurFileRouter, "imageUploader">
                endpoint="imageUploader"
                onUploadBegin={() => {
                  console.log("Upload starting...");
                  setIsUploading(true);
                }}
                onClientUploadComplete={(res) => {
                  console.log("Client upload complete:", res);
                  setIsUploading(false);
                  setFilesSelected(false);
                  
                  if (res && res.length > 0) {
                    // Extract URLs - try different possible properties
                    const newImageUrls = res.map(file => {
                      console.log("File data:", file);
                      return file.url || file.ufsUrl || file.serverData?.url;
                    }).filter(url => url != null);
                    
                    console.log("Extracted URLs:", newImageUrls);
                    
                    if (newImageUrls.length > 0) {
                      setImageUrls(prev => [...prev, ...newImageUrls]);
                      toast.success(`Successfully uploaded ${res.length} image(s)!`);
                    } else {
                      toast.error('Could not extract image URLs from upload response');
                    }
                  }
                }}
                onUploadError={(error) => {
                  console.error("Upload error:", error);
                  setIsUploading(false);
                  setFilesSelected(false);
                  toast.error(`Upload failed: ${error.message}`);
                }}
                onDrop={(acceptedFiles) => {
  console.log("Files selected:", acceptedFiles);
  setFilesSelected(true);
  toast(`Selected ${acceptedFiles.length} file(s). Click "Upload" to continue.`, {
    icon: '📁',
    duration: 3000,
  });
}}
                appearance={{
                  container: `
                    border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-500 backdrop-blur-sm
                    border-white/10 bg-gradient-to-br from-white/5 to-white/2 hover:border-orange-400/50 hover:bg-white/10 shadow-lg
                    ut-ready:border-orange-400 ut-ready:bg-orange-500/20 ut-ready:scale-[1.02] ut-ready:shadow-2xl ut-ready:shadow-orange-500/20
                  `,
                  uploadIcon: `
                    text-white/50 w-10 h-10 transition-all duration-500
                    ut-ready:text-white ut-ready:scale-110
                  `,
                  label: `
                    text-white font-bold text-xl mb-3 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent
                    ut-ready:text-orange-200
                  `,
                  allowedContent: `
                    text-white/60 text-base mb-2
                    ut-ready:text-orange-100
                  `,
                  button: `
                    bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl px-6 py-3 font-medium
                    hover:from-orange-600 hover:to-amber-700 transform hover:scale-105 transition-all duration-300
                    shadow-lg shadow-orange-500/25
                    ut-ready:bg-green-500 ut-ready:hover:bg-green-600
                    ut-uploading:from-orange-400 ut-uploading:to-amber-500 ut-uploading:cursor-not-allowed
                  `,
                }}
              />

              {/* Upload Instructions */}
              {filesSelected && !isUploading && imageUrls.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl"
                >
                  <p className="text-orange-300 font-medium">
                    💡 Files selected! Click the <strong>"Upload X files"</strong> button above to start uploading.
                  </p>
                </motion.div>
              )}

              {/* Modern Image Previews */}
              {imageUrls.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <p className="text-white font-semibold">Uploaded Photos ({imageUrls.length})</p>
                    </div>
                    <span className="text-orange-400 text-sm flex items-center gap-2">
                      <MousePointer className="w-4 h-4" />
                      Click to remove
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {imageUrls.map((src, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative group cursor-pointer"
                        onClick={() => removeImage(i)}
                      >
                        <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 border border-white/10 group-hover:border-red-400/50 transition-all duration-300 shadow-lg group-hover:shadow-red-500/20">
                          <img 
                            src={src} 
                            alt={`Vehicle preview ${i + 1}`} 
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl flex items-end justify-center pb-3">
                          <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                            <Trash2 className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 w-7 h-7 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                          {i + 1}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Modern Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/10">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-8 py-4 border border-white/20 text-white/80 rounded-2xl hover:bg-white/5 hover:text-white hover:border-white/30 transition-all duration-300 font-medium flex items-center justify-center gap-3 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                Cancel Listing
              </button>
              <button
                type="submit"
                disabled={imageUrls.length === 0 || isUploading}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-600 hover:to-amber-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-2xl shadow-orange-500/25 flex items-center justify-center gap-3 group"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                {isUploading ? 'Uploading...' : imageUrls.length === 0 ? 'Add Photos to Continue' : 'Publish Vehicle Listing'}
                <CheckCircle className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}