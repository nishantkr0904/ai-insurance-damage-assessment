import mongoose from 'mongoose';
import { config } from '../config/index.js';
import { User } from '../models/index.js';
import { logger } from '../utils/logger.js';

async function seedDemoUsers() {
  try {
    // Connect to database
    await mongoose.connect(config.mongodb.uri);
    logger.info('Connected to MongoDB');

    // Check if demo users already exist
    const demoUser = await User.findOne({ email: 'user@autoclaim.ai' });
    const demoAdmin = await User.findOne({ email: 'admin@autoclaim.ai' });

    // Create demo user if doesn't exist
    if (!demoUser) {
      const user = new User({
        name: 'Demo User',
        email: 'user@autoclaim.ai',
        password: 'user123',
        role: 'user',
      });
      await user.save();
      logger.info('✅ Demo user created: user@autoclaim.ai / user123');
    } else {
      logger.info('ℹ️  Demo user already exists');
    }

    // Create demo admin if doesn't exist
    if (!demoAdmin) {
      const admin = new User({
        name: 'Demo Admin',
        email: 'admin@autoclaim.ai',
        password: 'admin123',
        role: 'admin',
      });
      await admin.save();
      logger.info('✅ Demo admin created: admin@autoclaim.ai / admin123');
    } else {
      logger.info('ℹ️  Demo admin already exists');
    }

    logger.info('🎉 Demo users seeding completed!');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error seeding demo users:', error);
    process.exit(1);
  }
}

seedDemoUsers();
