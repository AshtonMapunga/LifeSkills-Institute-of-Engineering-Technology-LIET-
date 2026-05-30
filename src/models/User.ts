import mongoose, { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide a full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  }
}, { timestamps: true });

const User = models.User || model('User', userSchema);

export default User;
