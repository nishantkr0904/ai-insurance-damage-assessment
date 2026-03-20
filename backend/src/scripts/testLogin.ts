import mongoose from 'mongoose';
import { User } from '../models/index.js';
import { config } from '../config/index.js';
import bcrypt from 'bcryptjs';

async function test() {
  await mongoose.connect(config.mongodb.uri);
  console.log('Connected');
  
  const user = await User.findOne({ email: 'user@autoclaim.ai' }).select('+password');
  if (!user) {
    console.log('User not found!');
    process.exit(1);
  }
  
  console.log('User found:', {
    email: user.email,
    name: user.name,
    role: user.role,
    passwordHash: user.password.substring(0, 20) + '...'
  });
  
  // Test password
  const isValid = await user.comparePassword('user123');
  console.log('Password valid:', isValid);
  
  // Also try direct bcrypt compare
  const directCompare = await bcrypt.compare('user123', user.password);
  console.log('Direct bcrypt compare:', directCompare);
  
  process.exit(0);
}

test();
