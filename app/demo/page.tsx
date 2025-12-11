/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
export const dynamic = 'force-dynamic';;

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import { 
  Car, 
  Upload, 
  Camera, 
  X,
  DollarSign,
  Gauge,
  Calendar,
  Settings,
  Fuel,
  User,
  Phone,
  Mail,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function DealersPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    transmission: '',
    fuelType: '',
    name: 'John Doe',
    phone: '+254 700 000000',
    email: 'john.doe@dealership.com',
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const makes = ['Toyota', 'Mercedes-Benz', 'BMW', 'Honda', 'Ford', 'Nissan', 'Volkswagen', 'Audi', 'Hyundai', 'Kia'];
  const transmissions = ['Automatic', 'Manual', 'Semi-Automatic'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const steps = [
    { number: 1, title: 'Vehicle Info', icon: Car },
    { number: 2, title: 'Photos', icon: Camera },
    { number: 3, title: 'Review', icon: CheckCircle },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    handleFiles(Array.from(e.target.files));
  };
  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...imageFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { ...formData, images });
    alert('Car listing submitted successfully!');
    setFormData({
      make: '', model: '', year: '', price: '', mileage: '', transmission: '', fuelType: '',
      name: 'John Doe', phone: '+254 700 000000', email: 'john.doe@dealership.com',
    });
    setImages([]);
    setImagePreviews([]);
    setCurrentStep(1);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Hero Background - Only covers content area */}
      <div className="flex-1 flex flex-col relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: "url('/background/carbackground.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6 sm:mb-8"
            >
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg">
                List Your Car
              </h1>
              <p className="text-sm sm:text-xl text-white/90 max-w-2xl mx-auto drop-shadow px-2">
                Quick and easy car listing. Fill in the essential details and upload photos.
              </p>
            </motion.div>

            {/* Progress Steps - Mobile Optimized */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-full mx-auto mb-6 sm:mb-8 px-2"
            >
              <div className="flex justify-center items-center space-x-2 sm:space-x-4 lg:space-x-8">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isCompleted = currentStep > step.number;
                  const isActive = currentStep === step.number;

                  return (
                    <div key={step.number} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                          ${isCompleted ? 'bg-primary-500 border-primary-500 text-white shadow-lg' 
                            : isActive ? 'border-primary-500 bg-white/20 text-white' 
                            : 'border-white/30 text-white/60'}`}>
                          {isCompleted ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : <StepIcon className="w-3 h-3 sm:w-4 sm:h-4" />}
                        </div>
                        <span className={`text-xs sm:text-sm font-medium mt-1 sm:mt-2 transition-colors duration-300
                          ${isCompleted || isActive ? 'text-white' : 'text-white/60'}`}>
                          {step.title}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-4 sm:w-6 lg:w-12 h-0.5 mx-1 sm:mx-2 lg:mx-4 transition-all duration-300
                          ${currentStep > step.number ? 'bg-primary-500' : 'bg-white/30'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Frosted Glass Form - Wider on Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-full sm:max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl border border-white/20 overflow-hidden flex-1 flex flex-col"
            >
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                {/* Step 1: Vehicle Info */}
                {currentStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-4 sm:p-6 lg:p-8 flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 drop-shadow">Vehicle Information</h2>
                    <div className="space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-1 sm:mb-2 drop-shadow">Make *</label>
                          <div className="relative">
                            <select
                              required
                              value={formData.make}
                              onChange={(e) => handleInputChange('make', e.target.value)}
                              className="w-full px-4 py-3 sm:py-3 text-sm sm:text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer pr-10"
                            >
                              <option value="" className="text-gray-900 bg-white">Select Make</option>
                              {makes.map(make => <option key={make} value={make} className="text-gray-900 bg-white">{make}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-1 sm:mb-2 drop-shadow">Model *</label>
                          <input
                            type="text"
                            required
                            value={formData.model}
                            onChange={(e) => handleInputChange('model', e.target.value)}
                            placeholder="e.g., Corolla, X5"
                            className="w-full px-4 py-3 sm:py-3 text-sm sm:text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>

                      {/* Year and Price */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-1 sm:mb-2 drop-shadow">Year *</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 sm:w-5 sm:h-5" />
                            <div className="relative">
                              <select
                                required
                                value={formData.year}
                                onChange={(e) => handleInputChange('year', e.target.value)}
                                className="w-full pl-12 pr-10 py-3 sm:py-3 text-sm sm:text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                              >
                                <option value="" className="text-gray-900 bg-white">Select Year</option>
                                {years.map(year => <option key={year} value={year} className="text-gray-900 bg-white">{year}</option>)}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-1 sm:mb-2 drop-shadow">Price ($) *</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 sm:w-5 sm:h-5" />
                            <input
                              type="number"
                              required
                              min="0"
                              value={formData.price}
                              onChange={(e) => handleInputChange('price', e.target.value)}
                              placeholder="25000"
                              className="w-full pl-12 pr-4 py-3 sm:py-3 text-sm sm:text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Mileage and Transmission */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-1 sm:mb-2 drop-shadow">Mileage (km) *</label>
                          <div className="relative">
                            <Gauge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 sm:w-5 sm:h-5" />
                            <input
                              type="number"
                              required
                              min="0"
                              value={formData.mileage}
                              onChange={(e) => handleInputChange('mileage', e.target.value)}
                              placeholder="15000"
                              className="w-full pl-12 pr-4 py-3 sm:py-3 text-sm sm:text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-1 sm:mb-2 drop-shadow">Transmission *</label>
                          <div className="relative">
                            <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 sm:w-5 sm:h-5" />
                            <div className="relative">
                              <select
                                required
                                value={formData.transmission}
                                onChange={(e) => handleInputChange('transmission', e.target.value)}
                                className="w-full pl-12 pr-10 py-3 sm:py-3 text-sm sm:text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                              >
                                <option value="" className="text-gray-900 bg-white">Select Transmission</option>
                                {transmissions.map(trans => <option key={trans} value={trans} className="text-gray-900 bg-white">{trans}</option>)}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Fuel Type */}
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-1 sm:mb-2 drop-shadow">Fuel Type *</label>
                        <div className="relative">
                          <Fuel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 sm:w-5 sm:h-5" />
                          <div className="relative">
                            <select
                              required
                              value={formData.fuelType}
                              onChange={(e) => handleInputChange('fuelType', e.target.value)}
                              className="w-full pl-12 pr-10 py-3 sm:py-3 text-sm sm:text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                            >
                              <option value="" className="text-gray-900 bg-white">Select Fuel Type</option>
                              {fuelTypes.map(fuel => <option key={fuel} value={fuel} className="text-gray-900 bg-white">{fuel}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Photos */}
                {currentStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 drop-shadow">Upload Photos</h2>
                    <div className="mb-4 sm:mb-6 flex-1">
                      <p className="text-white/80 mb-3 sm:mb-4 text-sm sm:text-base drop-shadow">Add photos of your vehicle. Include exterior, interior, and engine shots for better visibility.</p>
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center cursor-pointer transition-all duration-300 mb-4 sm:mb-6
                          ${isDragging ? 'border-primary-400 bg-primary-500/20 scale-105' : 'border-white/30 hover:border-primary-400 hover:bg-white/5'}`}
                      >
                        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileInput} className="hidden" />
                        <Camera className={`w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 transition-colors duration-300 ${isDragging ? 'text-primary-400' : 'text-white/60'}`} />
                        <p className="text-base sm:text-xl font-medium text-white mb-1 sm:mb-2 drop-shadow">{isDragging ? 'Drop your photos here' : 'Drag & drop photos here'}</p>
                        <p className="text-white/60 text-xs sm:text-sm mb-2 sm:mb-4">or click to browse files</p>
                        <p className="text-white/50 text-xs">PNG, JPG, JPEG up to 10MB each</p>
                      </div>

                      {imagePreviews.length > 0 && (
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4 drop-shadow">Uploaded Photos ({imagePreviews.length})</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                            {imagePreviews.map((preview, index) => (
                              <motion.div key={index} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative group">
                                <img src={preview} alt={`Vehicle ${index + 1}`} className="w-full h-16 sm:h-20 lg:h-24 object-cover rounded-lg sm:rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-200"/>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                  className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                                >
                                  <X className="w-2 h-2 sm:w-3 sm:h-3" />
                                </button>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Review & Submit */}
                {currentStep === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 drop-shadow">Review & Submit</h2>
                    <div className="space-y-4 sm:space-y-6 text-white/90 text-sm sm:text-base">
                      {/* Vehicle Details */}
                      <div className="bg-white/5 rounded-xl p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 drop-shadow">Vehicle Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <p className="text-white/70 text-sm">Make</p>
                            <p className="text-white font-medium">{formData.make || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-white/70 text-sm">Model</p>
                            <p className="text-white font-medium">{formData.model || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-white/70 text-sm">Year</p>
                            <p className="text-white font-medium">{formData.year || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-white/70 text-sm">Price</p>
                            <p className="text-white font-medium">{formData.price ? `$${formData.price}` : 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-white/70 text-sm">Mileage</p>
                            <p className="text-white font-medium">{formData.mileage ? `${formData.mileage} km` : 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-white/70 text-sm">Transmission</p>
                            <p className="text-white font-medium">{formData.transmission || 'Not provided'}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-white/70 text-sm">Fuel Type</p>
                            <p className="text-white font-medium">{formData.fuelType || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Seller Information */}
                      <div className="bg-white/5 rounded-xl p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 drop-shadow">Seller Information</h3>
                        <div className="space-y-2 sm:space-y-3">
                          <div>
                            <p className="text-white/70 text-sm">Name</p>
                            <p className="text-white font-medium">{formData.name}</p>
                          </div>
                          <div>
                            <p className="text-white/70 text-sm">Phone</p>
                            <p className="text-white font-medium">{formData.phone}</p>
                          </div>
                          <div>
                            <p className="text-white/70 text-sm">Email</p>
                            <p className="text-white font-medium">{formData.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Photos Preview */}
                      <div className="bg-white/5 rounded-xl p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 drop-shadow">
                          Photos ({imagePreviews.length})
                        </h3>
                        {imagePreviews.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                            {imagePreviews.map((preview, index) => (
                              <motion.div key={index} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative">
                                <img 
                                  src={preview} 
                                  alt={`Vehicle ${index + 1}`} 
                                  className="w-full h-20 sm:h-24 lg:h-28 object-cover rounded-lg shadow-lg"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center rounded-b-lg">
                                  {index + 1}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-white/60 text-sm">No photos uploaded</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons - Mobile Optimized */}
                <div className="p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-auto">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center justify-center gap-2 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base border border-white/20 bg-white/10 backdrop-blur-sm text-white rounded-lg sm:rounded-xl hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center justify-center gap-2 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base bg-primary-500 hover:bg-primary-600 text-white rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/25"
                    >
                      <span>Continue</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base bg-green-500 hover:bg-green-600 text-white rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg shadow-green-500/25"
                    >
                      Submit Listing
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
