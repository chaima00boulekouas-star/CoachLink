import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// Securely serve static files from the backend/uploads directory using absolute path
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Basic Home Route Structure
app.get('/', (req, res) => {
  res.status(200).json({ message: 'CoachLink API is running...' });
});

// Routes will be mounted here shortly once they are created
// app.use('/api/stores', storeRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);

// Database Connection & Server Setup
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/coachlink';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`✅ MongoDB connected successfully to ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  });
