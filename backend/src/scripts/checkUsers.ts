import mongoose from 'mongoose';
import { config } from '../config/index.js';
import { User } from '../models/index.js';

async function checkUsers() {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('Connected to MongoDB\n');

    const users = await User.find({}).select('+password');
    console.log(`Found ${users.length} users:\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Password hash: ${user.password.substring(0, 30)}...`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUsers();
