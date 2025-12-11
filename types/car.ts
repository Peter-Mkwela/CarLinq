export interface Car {
  id: string;
  year: number;
  make: string;
  model: string;
  price: number;
  mileage: number;
  city: string;
  state: string;
  description?: string;
  images: string[]; // UploadThing URLs
}

export interface Dealer {
  id: string;
  name: string;
  phone: string; // Format: +1234567890
  email?: string;
}