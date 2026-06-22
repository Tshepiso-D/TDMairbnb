const express = require('express');
const router = express.Router();
const {
  createReservation,
  getReservationsByUser,
  getReservationsByHost,
  deleteReservation,
  getAllReservations,
} = require('../controllers/reservationController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, getAllReservations);
router.post('/', protect, createReservation);
router.get('/user', protect, getReservationsByUser);
router.get('/host', protect, getReservationsByHost);
router.delete('/:id', protect, deleteReservation);

module.exports = router;
