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
  Cog,
  Fuel,
  User,
  Phone,
  Mail,
  Upload,
  Camera,
  ChevronLeft,
  ChevronRight
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
  const [isDragging, setIsDragging] = useState(false);

  const transmissions = ['Automatic', 'Manual', 'Semi-Automatic', 'CVT', 'Dual-Clutch'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
  const currentYear = new Date().getFullYear();

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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={handleClose}>
      </div>

      {/* Premium Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/background/carbackground.jpg')" }}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
      </div>

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative z-10 w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Premium Header with Glass Effect */}
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-white/30 bg-white/20 text-white shadow-lg">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white drop-shadow">
                  Add New Vehicle
                </h3>
                <p className="text-white/80 text-sm mt-1 drop-shadow">
                  Create your premium vehicle listing
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="w-10 h-10 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modern Form Content with Glass Effect */}
        <div className="p-8 max-h-[calc(90vh-140px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Vehicle Details - Premium Grid Layout */}
            <div className="space-y-8">
              <div className="mb-6">
                <h4 className="text-2xl font-bold text-white mb-2 drop-shadow">Vehicle Information</h4>
                <p className="text-white/70 text-base">Fill in all the essential details about your vehicle</p>
              </div>
              
              {/* Modern Grid with Premium Styling */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle Make - Manual Input */}
                <div className="group">
                  <label className="block text-base font-medium text-white/90 mb-3 drop-shadow">
                    Vehicle Make
                  </label>
                  <div className="relative">
                    <Car className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="text"
                      required
                      value={newListing.make}
                      onChange={(e) => handleInputChange('make', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Mercedes-Benz, Toyota, BMW"
                    />
                  </div>
                </div>

                {/* Model Series */}
                <div className="group">
                  <label className="block text-base font-medium text-white/90 mb-3 drop-shadow">
                    Model Series
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="text"
                      required
                      value={newListing.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., C-Class, Corolla, X5"
                    />
                  </div>
                </div>

                {/* Manufacture Year - Manual Input */}
                <div className="group">
                  <label className="block text-base font-medium text-white/90 mb-3 drop-shadow">
                    Manufacture Year
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="number"
                      required
                      value={newListing.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., 2023, 2024"
                      min="1990"
                      max={currentYear}
                    />
                  </div>
                </div>

                {/* Asking Price */}
                <div className="group">
                  <label className="block text-base font-medium text-white/90 mb-3 drop-shadow">
                    Asking Price ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="number"
                      required
                      value={newListing.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., 45,000"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Mileage & Location - Premium Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-white/90 mb-3 drop-shadow">
                    Vehicle Mileage (km)
                  </label>
                  <div className="relative">
                    <Gauge className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="number"
                      required
                      value={newListing.mileage}
                      onChange={(e) => handleInputChange('mileage', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., 15,000"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-medium text-white/90 mb-3 drop-shadow">
                    Vehicle Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="text"
                      required
                      value={newListing.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Nairobi, Kenya"
                    />
                  </div>
                </div>
              </div>

              {/* Fuel Type & Transmission - Premium Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fuel Type Dropdown */}
                <div>
                  <label className="block text-base font-medium text-white/90 mb-3 drop-shadow">
                    Fuel Type
                  </label>
                  <div className="relative">
                    <Fuel className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <select
                      value={newListing.fuelType}
                      onChange={(e) => handleInputChange('fuelType', e.target.value)}
                      className="w-full pl-12 pr-10 py-4 text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                    >
                      {fuelTypes.map(type => (
                        <option key={type} value={type} className="text-gray-900 bg-white">{type}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Transmission Dropdown with CVT and Dual-Clutch */}
                <div>
                  <label className="block text-base font-medium text-white/90 mb-3 drop-shadow">
                    Transmission
                  </label>
                  <div className="relative">
                    <Settings className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <select
                      value={newListing.transmission}
                      onChange={(e) => handleInputChange('transmission', e.target.value)}
                      className="w-full pl-12 pr-10 py-4 text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                    >
                      {transmissions.map(trans => (
                        <option key={trans} value={trans} className="text-gray-900 bg-white">{trans}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Image Upload Section */}
            <div className="space-y-8">
              <div className="mb-6">
                <h4 className="text-2xl font-bold text-white mb-2 drop-shadow">Vehicle Gallery</h4>
                <p className="text-white/70 text-base">Add photos of your vehicle for better visibility. Include exterior, interior, and engine shots.</p>
              </div>

              {/* UploadThing Dropzone with Premium Styling */}
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
                    icon: '',
                    duration: 3000,
                  });
                }}
                appearance={{
                  container: `
                    border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 backdrop-blur-sm
                    border-white/30 hover:border-primary-400 hover:bg-white/5
                  `,
                  uploadIcon: `
                    text-white/60 w-16 h-16
                  `,
                  label: `
                    text-white font-bold text-xl mb-3
                  `,
                  allowedContent: `
                    text-white/60 text-base mb-4
                  `,
                  button: `
                    px-8 py-4 text-base bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/25
                  `,
                }}
              />

              {/* Upload Instructions */}
              {filesSelected && !isUploading && imageUrls.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center p-6 bg-primary-500/10 border border-primary-500/20 rounded-xl"
                >
                  <p className="text-white font-medium text-base">
                    📁 Files selected! Click the <strong>"Upload X files"</strong> button above to start uploading.
                  </p>
                </motion.div>
              )}

              {/* Premium Image Previews */}
              {imageUrls.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-white" />
                      <p className="text-white font-semibold text-lg">Uploaded Photos ({imageUrls.length})</p>
                    </div>
                    <span className="text-white/60 text-sm">
                      Click X to remove
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {imageUrls.map((src, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative group"
                      >
                        <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 border border-white/10">
                          <img 
                            src={src} 
                            alt={`Vehicle preview ${i + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute top-2 right-2 w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                          {i + 1}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Premium Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t border-white/20">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-8 py-4 border border-white/20 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 font-medium text-base flex items-center justify-center gap-3"
              >
                <ArrowLeft className="w-5 h-5" />
                Cancel Listing
              </button>
              <button
                type="submit"
                disabled={imageUrls.length === 0 || isUploading}
                className="flex-1 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-primary-500/25 text-base flex items-center justify-center gap-3"
              >
                <Sparkles className="w-5 h-5" />
                {isUploading ? 'Uploading...' : imageUrls.length === 0 ? 'Add Photos to Continue' : 'Publish Vehicle Listing'}
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}