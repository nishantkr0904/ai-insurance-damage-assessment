import mongoose from 'mongoose';
import { config } from '../config/index.js';
import { userRepository } from '../repositories/index.js';
import { logger } from '../utils/logger.js';

async function testAuthService() {
  try {
    await mongoose.connect(config.mongodb.uri);
    logger.info('Connected to MongoDB');

    // Simulate the authService.login flow
    const email = 'user@autoclaim.ai';
    const password = 'user123';

    logger.info('Step 1: Finding user by email:', email);
    const user = await userRepository.findByEmail(email);
    
    if (!user) {
      logger.error('User not found!');
      process.exit(1);
    }
    
    logger.info('Step 2: User found:', {
      email: user.email,
      name: user.name,
      role: user.role,
      hasPassword: !!user.password,
      passwordLength: user.password?.length
    });

    logger.info('Step 3: Comparing password...');
    const isPasswordValid = await user.comparePassword(password);
    logger.info('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      logger.error('Password comparison failed!');
      process.exit(1);
    }

    logger.info('✅ Authentication would succeed!');
    process.exit(0);
  } catch (error) {
    logger.error('Error:', error);
    process.exit(1);
  }
}

testAuthService();
