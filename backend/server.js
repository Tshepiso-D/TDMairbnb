const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

app.get("/",function(req,res){
  res.sendFile(
  path.join(__dirname,"../frontend/dist/index.html"),
  function(err){
    if(err){
      res.status(500).send(err);
    }
  }
)});

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/accommodations', require('./routes/accommodationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Airbnb Clone API is running' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
