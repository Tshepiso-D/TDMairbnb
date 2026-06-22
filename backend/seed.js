const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Accommodation = require('./models/Accommodation');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany();
  await Accommodation.deleteMany();
  console.log('Cleared existing data');

  // Create users
  const users = await User.create([
    { username: 'Admin User', email: 'admin@airbnb.com', password: 'admin123', role: 'admin' },
    { username: 'John Host', email: 'john@airbnb.com', password: 'password123', role: 'host' },
    { username: 'Jane Doe', email: 'jane@airbnb.com', password: 'password321', role: 'user' },
  ]);
  console.log('Users created');

  const host = users[1];

  // Create sample accommodations
  await Accommodation.create([
    {
      title: 'Modern Apartment in New York',
      location: 'New York',
      description: 'Stay in the heart of New York City in this stunning modern apartment with views of the skyline. Walking distance to Central Park.',
      type: 'Entire apartment',
      bedrooms: 2, bathrooms: 2, guests: 4,
      price: 320, rating: 4.5, reviews: 320,
      amenities: ['wifi', 'kitchen', 'free parking', 'air conditioning', 'washer'],
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
      weeklyDiscount: 10, cleaningFee: 50, serviceFee: 50, occupancyTaxes: 30,
      host: host._id, hostName: host.username,
      enhancedCleaning: true, selfCheckIn: true,
      specificRatings: { cleanliness: 4.8, communication: 4.7, checkIn: 4.9, accuracy: 4.6, location: 4.9, value: 4.5 },
    },
    {
      title: 'Beachfront Villa in Miami',
      location: 'Miami',
      description: 'Gorgeous beachfront villa with direct ocean access, private pool, and stunning sunset views. Perfect for families.',
      type: 'Entire villa',
      bedrooms: 4, bathrooms: 3, guests: 8,
      price: 580, rating: 4.8, reviews: 156,
      amenities: ['wifi', 'pool', 'beach access', 'kitchen', 'air conditioning', 'bbq'],
      images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
      weeklyDiscount: 15, cleaningFee: 120, serviceFee: 80, occupancyTaxes: 50,
      host: host._id, hostName: host.username,
      enhancedCleaning: true, selfCheckIn: false,
      specificRatings: { cleanliness: 5.0, communication: 4.8, checkIn: 4.7, accuracy: 4.9, location: 5.0, value: 4.6 },
    },
    {
      title: 'Cozy Cottage in the Mountains',
      location: 'Aspen',
      description: 'Escape to this charming mountain cottage surrounded by pine trees and fresh mountain air. Perfect ski-in/ski-out location.',
      type: 'Entire house',
      bedrooms: 3, bathrooms: 2, guests: 6,
      price: 250, rating: 4.6, reviews: 89,
      amenities: ['wifi', 'fireplace', 'ski storage', 'kitchen', 'hot tub'],
      images: ['https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800'],
      weeklyDiscount: 5, cleaningFee: 75, serviceFee: 40, occupancyTaxes: 25,
      host: host._id, hostName: host.username,
      enhancedCleaning: false, selfCheckIn: true,
      specificRatings: { cleanliness: 4.7, communication: 4.6, checkIn: 4.8, accuracy: 4.5, location: 4.9, value: 4.7 },
    },
    {
      title: 'Downtown Loft in Chicago',
      location: 'Chicago',
      description: 'Stylish industrial loft in the heart of downtown Chicago. Walk to top restaurants, museums, and entertainment.',
      type: 'Entire apartment',
      bedrooms: 1, bathrooms: 1, guests: 2,
      price: 180, rating: 4.4, reviews: 212,
      amenities: ['wifi', 'gym access', 'doorman', 'kitchen', 'air conditioning'],
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
      weeklyDiscount: 8, cleaningFee: 35, serviceFee: 25, occupancyTaxes: 20,
      host: host._id, hostName: host.username,
      enhancedCleaning: true, selfCheckIn: true,
      specificRatings: { cleanliness: 4.5, communication: 4.4, checkIn: 4.6, accuracy: 4.3, location: 4.8, value: 4.4 },
    },
    {
      title: 'Luxury Penthouse in Los Angeles',
      location: 'Los Angeles',
      description: 'Breathtaking penthouse with panoramic city views, rooftop terrace, and luxury amenities in Beverly Hills.',
      type: 'Entire apartment',
      bedrooms: 3, bathrooms: 3, guests: 6,
      price: 750, rating: 4.9, reviews: 67,
      amenities: ['wifi', 'pool', 'gym', 'concierge', 'valet parking', 'kitchen'],
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
      weeklyDiscount: 12, cleaningFee: 150, serviceFee: 100, occupancyTaxes: 75,
      host: host._id, hostName: host.username,
      enhancedCleaning: true, selfCheckIn: false,
      specificRatings: { cleanliness: 5.0, communication: 4.9, checkIn: 4.8, accuracy: 4.9, location: 4.9, value: 4.8 },
    },
  ]);

  console.log('Accommodations created');
  console.log('\n✅ Seed complete!');
  console.log('Admin:  admin@airbnb.com / admin123');
  console.log('Host:   john@airbnb.com  / password123');
  console.log('User:   jane@airbnb.com  / password321');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
