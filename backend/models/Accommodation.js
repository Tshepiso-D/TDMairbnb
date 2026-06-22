const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    location: { type: String, required: [true, 'Location is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: ['Entire apartment', 'Private room', 'Shared room', 'Entire house', 'Entire villa'],
    },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    guests: { type: Number, required: true, min: 1 },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    amenities: [{ type: String }],
    images: [{ type: String }],
    weeklyDiscount: { type: Number, default: 0, min: 0, max: 100 },
    cleaningFee: { type: Number, default: 0, min: 0 },
    serviceFee: { type: Number, default: 0, min: 0 },
    occupancyTaxes: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    hostName: { type: String },
    enhancedCleaning: { type: Boolean, default: false },
    selfCheckIn: { type: Boolean, default: false },
    specificRatings: {
      cleanliness: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      checkIn: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
      location: { type: Number, default: 0 },
      value: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Accommodation', accommodationSchema);
