
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../src/models/User.Model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not found in .env file');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const admins = [
      { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD },
      { email: process.env.ADMIN_EMAIL_2, password: process.env.ADMIN_PASSWORD_2 }
    ].filter(a => a.email && a.password);

    if (admins.length === 0) {
      throw new Error('No admin credentials found! Please check your .env file.');
    }

    for (const adminData of admins) {
      const { email, password } = adminData;
      
      const existingAdmin = await User.findOne({ email: email.toLowerCase() });
      if (existingAdmin) {
        console.log(`Admin account for ${email} already exists.`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        name: email.split('@')[0] + ' (Admin)',
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'admin',
        isVerified: true
      });

      console.log(`Admin account created successfully for: ${email}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin account:', error);
    process.exit(1);
  }
};

createAdmin();
