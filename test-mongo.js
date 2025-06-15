import 'dotenv/config';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

console.log('Connecting to:', uri); // 👈 Check if this prints

async function testConnection() {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db();
    console.log('✅ Connected to MongoDB');
    client.close();
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
  }
}

testConnection();