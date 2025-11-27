/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useRef, useEffect } from 'react';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false); // <-- auth check
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

  useEffect(() => {
    // Example: check if user is logged in
    const email = localStorage.getItem('userEmail');
    if (email) setIsLoggedIn(true);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleLogin = () => {
    // Simple mock login for demo
    localStorage.setItem('userEmail', 'demo@user.com');
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Overlay Login Modal if not logged in */}
      {!isLoggedIn && (
        <div className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 sm:p-12 max-w-sm w-full text-center shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="text-gray-700 mb-6">Please login to list your car.</p>
            <button
              onClick={handleLogin}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all duration-200"
            >
              Login
            </button>
          </div>
        </div>
      )}

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

            {/* Progress Steps, Form, and everything else remain unchanged */}
            {/* ... You can paste your full form code here exactly as it is ... */}

          </div>
        </div>
      </div>
    </div>
  );
}
