import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const fixIndexes = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/coachlink';
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB...');

    const collections = ['trainerprofiles', 'athleteprofiles'];
    
    for (const colName of collections) {
      const collection = mongoose.connection.db.collection(colName);
      const indexes = await collection.indexes();
      
      console.log(`Checking indexes for ${colName}...`);
      
      const oldIndex = indexes.find(idx => idx.name === 'user_id_1');
      if (oldIndex) {
        await collection.dropIndex('user_id_1');
        console.log(`✅ Successfully dropped old index 'user_id_1' from ${colName}`);
      } else {
        console.log(`ℹ️ No old index 'user_id_1' found in ${colName}`);
      }
    }

    console.log('\nDone! You can now try signing up again.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

fixIndexes();
