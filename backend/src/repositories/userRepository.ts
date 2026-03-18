import { User, type IUserDocument } from '../models/index.js';

export const userRepository = {
  async findByEmail(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email }).select('+password');
  },

  async findById(id: string): Promise<IUserDocument | null> {
    return User.findById(id);
  },

  async create(data: {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'admin';
  }): Promise<IUserDocument> {
    const user = new User(data);
    return user.save();
  },

  async findAll(): Promise<IUserDocument[]> {
    return User.find().select('-password');
  },

  async countUsers(): Promise<number> {
    return User.countDocuments();
  },

  async update(
    id: string,
    data: Partial<{ name: string; email: string }>
  ): Promise<IUserDocument | null> {
    return User.findByIdAndUpdate(id, data, { new: true });
  },
};
