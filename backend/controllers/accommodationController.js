const Accommodation = require('../models/Accommodation');
const path = require('path');

// @desc    Get all accommodations
// @route   GET /api/accommodations
// @access  Public
const getAccommodations = async (req, res) => {
  try {
    const { location, type, minPrice, maxPrice, guests } = req.query;
    let filter = {};

    if (location) filter.location = { $regex: location, $options: 'i' };
    if (type) filter.type = type;
    if (guests) filter.guests = { $gte: parseInt(guests) };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    const accommodations = await Accommodation.find(filter).sort({ createdAt: -1 });
    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single accommodation
// @route   GET /api/accommodations/:id
// @access  Public
const getAccommodationById = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id).populate(
      'host',
      'username email'
    );
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    res.json(accommodation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create accommodation
// @route   POST /api/accommodations
// @access  Private/Host/Admin
const createAccommodation = async (req, res) => {
  try {
    const {
      title, location, description, type, bedrooms, bathrooms,
      guests, price, amenities, weeklyDiscount, cleaningFee,
      serviceFee, occupancyTaxes, enhancedCleaning, selfCheckIn,
    } = req.body;

    // Validation
    if (!title || !location || !description || !type || !price) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Handle image uploads
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const accommodation = await Accommodation.create({
      title,
      location,
      description,
      type,
      bedrooms: parseInt(bedrooms) || 1,
      bathrooms: parseInt(bathrooms) || 1,
      guests: parseInt(guests) || 1,
      price: parseFloat(price),
      amenities: amenities
        ? Array.isArray(amenities)
          ? amenities
          : amenities.split(',').map((a) => a.trim())
        : [],
      images,
      weeklyDiscount: parseFloat(weeklyDiscount) || 0,
      cleaningFee: parseFloat(cleaningFee) || 0,
      serviceFee: parseFloat(serviceFee) || 0,
      occupancyTaxes: parseFloat(occupancyTaxes) || 0,
      enhancedCleaning: enhancedCleaning === 'true' || enhancedCleaning === true,
      selfCheckIn: selfCheckIn === 'true' || selfCheckIn === true,
      host: req.user._id,
      hostName: req.user.username,
    });

    res.status(201).json(accommodation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update accommodation
// @route   PUT /api/accommodations/:id
// @access  Private/Host/Admin
const updateAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    // Check ownership
    if (
      accommodation.host.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    // Handle new image uploads
    let images = accommodation.images;
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const updateData = { ...req.body, images };
    if (updateData.amenities && !Array.isArray(updateData.amenities)) {
      updateData.amenities = updateData.amenities.split(',').map((a) => a.trim());
    }

    const updated = await Accommodation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updated);
  }catch (error) {
   res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete accommodation
// @route   DELETE /api/accommodations/:id
// @access  Private/Host/Admin
const deleteAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    // Check ownership or admin
    if (
      accommodation.host.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await accommodation.deleteOne();
    res.json({ message: 'Accommodation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAccommodations,
  getAccommodationById,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
};
