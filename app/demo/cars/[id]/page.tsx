/* eslint-disable @typescript-eslint/no-unused-vars */
// app/cars/[id]/page.tsx - COMPLETE WORKING CODE
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import Image from 'next/image';
import { 
  Car, 
  Calendar, 
  Gauge, 
  Fuel, 
  Settings, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Share2, 
  Heart,
  Building, 
  Shield, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Eye,
  User,
  Mail,
  Clock,
  ArrowLeft,
  PhoneCall,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import CarGallery from './CarGallery';
import ContactButtons from './ContactButtons';

interface CarDetailPageProps {
  params: {
    id: string;
  };
}

async function getCar(id: string) {
  try {
    const car = await prisma.listing.findUnique({
      where: { id },
      include: {
        dealer: {
          select: {
            id: true,
            name: true,
            companyName: true,
            phone: true,
            email: true,
            address: true,
            isVerified: true,
            createdAt: true,
          }
        }
      }
    });

    if (!car) {
      return null;
    }

    // Transform the data
    return {
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      transmission: car.transmission || 'Automatic',
      fuelType: car.fuelType || 'Petrol',
      location: car.location,
      images: car.images || [],
      description: car.description || '',
      status: car.status,
      viewCount: car.viewCount || 0,
      inquiryCount: car.inquiryCount || 0,
      likeCount: car.likeCount || 0,
      createdAt: car.createdAt.toISOString(),
      updatedAt: car.updatedAt.toISOString(),
      dealer: {
        id: car.dealer.id,
        name: car.dealer.name,
        companyName: car.dealer.companyName || car.dealer.name,
        phone: car.dealer.phone || 'Not provided',
        email: car.dealer.email,
        address: car.dealer.address || '',
        isVerified: car.dealer.isVerified,
        joinedDate: car.dealer.createdAt.toISOString(),
      }
    };
  } catch (error) {
    console.error('Error fetching car:', error);
    return null;
  }
}

export async function generateMetadata({ params }: CarDetailPageProps): Promise<Metadata> {
  const car = await getCar(params.id);
  
  if (!car) {
    return {
      title: 'Car Not Found - CarLinq',
      description: 'This car listing is no longer available.',
    };
  }

  const imageUrl = car.images.length > 0 
    ? car.images[0] 
    : '/default-car.jpg';

  const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000';
  const absoluteImageUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;

  const title = `${car.year} ${car.make} ${car.model} - $${car.price.toLocaleString()}`;
  const description = `${car.make} ${car.model} for sale in ${car.location}. ${car.mileage.toLocaleString()} km, ${car.transmission}, ${car.fuelType}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: `${car.make} ${car.model}`,
        }
      ],
      url: `${baseUrl}/cars/${car.id}`,
      type: 'website',
      siteName: 'CarLinq',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteImageUrl],
    },
  };
}

// Helper function to format phone number
function formatPhoneNumber(phone: string): string {
  if (!phone || phone === 'Not provided') return 'Not provided';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('263') && cleaned.length === 12) {
    return '0' + cleaned.slice(3);
  } else if (cleaned.length === 9) {
    return '0' + cleaned;
  } else if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return cleaned;
  } else if (cleaned.startsWith('+263') && cleaned.length === 13) {
    return '0' + cleaned.slice(4);
  }
  
  return phone;
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

// Helper function to calculate days since listing
function getDaysSinceListing(dateString: string): number {
  const listedDate = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - listedDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Increment view count
async function incrementViewCount(carId: string) {
  try {
    await prisma.listing.update({
      where: { id: carId },
      data: { viewCount: { increment: 1 } }
    });
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const car = await getCar(params.id);

  if (!car) {
    notFound();
  }

  // Increment view count
  await incrementViewCount(car.id);

  const daysListed = getDaysSinceListing(car.createdAt);
  const formattedPhone = formatPhoneNumber(car.dealer.phone);
  const formattedJoinedDate = formatDate(car.dealer.joinedDate);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Back Navigation */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Link 
            href="/cars"
            className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Browse</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-orange-500">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/cars" className="hover:text-orange-500">Cars</Link>
          <span className="mx-2">/</span>
          <Link href={`/cars?make=${car.make}`} className="hover:text-orange-500">{car.make}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{car.model}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <Suspense fallback={<div className="animate-pulse bg-gray-200 rounded-2xl h-[400px]" />}>
            <CarGallery car={car} />
          </Suspense>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {car.year} {car.make} {car.model}
              </h1>
              <div className="flex items-center justify-between">
                <div className="text-4xl lg:text-5xl font-bold text-orange-600">
                  ${car.price.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">{car.viewCount.toLocaleString()} views</span>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className="mt-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  car.status === 'AVAILABLE'
                    ? 'bg-green-100 text-green-800'
                    : car.status === 'SOLD'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {car.status.charAt(0) + car.status.slice(1).toLowerCase()}
                </span>
              </div>
              
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Listed {daysListed} day{daysListed !== 1 ? 's' : ''} ago</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{car.inquiryCount} inquiries</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{car.likeCount} likes</span>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Year</p>
                    <p className="font-semibold text-gray-900">{car.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Gauge className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mileage</p>
                    <p className="font-semibold text-gray-900">{car.mileage.toLocaleString()} km</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Settings className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Transmission</p>
                    <p className="font-semibold text-gray-900">{car.transmission}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Fuel className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fuel Type</p>
                    <p className="font-semibold text-gray-900">{car.fuelType}</p>
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">{car.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {car.description && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{car.description}</p>
                </div>
              </div>
            )}

            {/* Dealer Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Dealer Information</h2>
                {car.dealer.isVerified && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Verified Dealer</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 truncate">{car.dealer.companyName}</h3>
                  <p className="text-gray-600 mb-2 truncate">{car.dealer.name}</p>
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium truncate">{formattedPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{car.dealer.email}</span>
                  </div>
                </div>
              </div>
              
              {car.dealer.address && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Address</p>
                  <p className="font-medium">{car.dealer.address}</p>
                </div>
              )}
              
              <div className="flex items-center text-sm text-gray-600">
                <Building className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">Member since {formattedJoinedDate}</span>
              </div>
            </div>

            {/* Contact Buttons */}
            <Suspense fallback={<div className="h-20 animate-pulse bg-gray-200 rounded-xl" />}>
              <ContactButtons car={car} formattedPhone={formattedPhone} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}