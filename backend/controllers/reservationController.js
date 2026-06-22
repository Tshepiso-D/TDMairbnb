const Reservation = require('../models/Reservation');
const Accommodation = require('../models/Accommodation');

// @desc    Create a reservation
// @route   POST /api/reservations
// @access  Private
const createReservation = async (req, res) => {
  try {
    const { accommodationId, checkIn, checkOut, guests } = req.body;

    if (!accommodationId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    // Calculate nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return res.status(400).json({ message: 'Check-out must be after check-in' });
    }

    // Calculate total price
    let subtotal = accommodation.price * nights;
    let weeklyDiscountAmount = 0;
    if (nights >= 7 && accommodation.weeklyDiscount > 0) {
      weeklyDiscountAmount = (subtotal * accommodation.weeklyDiscount) / 100;
      subtotal -= weeklyDiscountAmount;
    }

    const totalPrice =
      subtotal +
      accommodation.cleaningFee +
      accommodation.serviceFee +
      accommodation.occupancyTaxes;

    const reservation = await Reservation.create({
      accommodation: accommodationId,
      user: req.user._id,
      host: accommodation.host,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: parseInt(guests),
      nights,
      pricePerNight: accommodation.price,
      weeklyDiscount: weeklyDiscountAmount,
      cleaningFee: accommodation.cleaningFee,
      serviceFee: accommodation.serviceFee,
      occupancyTaxes: accommodation.occupancyTaxes,
      totalPrice,
      accommodationTitle: accommodation.title,
      accommodationLocation: accommodation.location,
      accommodationImage: accommodation.images[0] || '',
    });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get reservations by user
// @route   GET /api/reservations/user
// @access  Private
const getReservationsByUser = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('accommodation', 'title location images price')
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get reservations by host
// @route   GET /api/reservations/host
// @access  Private/Host
const getReservationsByHost = async (req, res) => {
  try {
    const reservations = await Reservation.find({ host: req.user._id })
      .populate('accommodation', 'title location images price')
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a reservation
// @route   DELETE /api/reservations/:id
// @access  Private
const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Allow user who made it or admin to delete
    if (
      reservation.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to cancel this reservation' });
    }

    await reservation.deleteOne();
    res.json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all reservations (admin)
// @route   GET /api/reservations
// @access  Private/Admin
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('accommodation', 'title location')
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createReservation,
  getReservationsByUser,
  getReservationsByHost,
  deleteReservation,
  getAllReservations,
};
