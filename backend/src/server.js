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
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl.startsWith('/api/payments/webhook')) {
      req.rawBody = buf.toString();
    }
  }
})); // Parses incoming JSON requests and conditionally captures raw body
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// Securely serve static files from the backend/uploads directory using absolute path
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Basic Home Route Structure
app.get('/', (req, res) => {
  res.status(200).json({ message: 'CoachLink API is running...' });
});

import routes from "./routes/index.js";

// Mount API routers
app.use('/', routes);

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
