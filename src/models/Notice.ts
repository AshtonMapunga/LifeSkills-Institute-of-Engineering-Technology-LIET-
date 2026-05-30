import mongoose, { Schema, model, models } from 'mongoose';

const noticeSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a notice title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a notice description'],
    trim: true,
  },
  date: {
    type: String,
    required: [true, 'Please provide a date (e.g. Oct 24)'],
    trim: true,
  }
}, { timestamps: true });

if (mongoose.models.Notice) {
  delete mongoose.models.Notice;
}

const Notice = model('Notice', noticeSchema);

export default Notice;
