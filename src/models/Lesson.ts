import mongoose, { Schema, model, models } from 'mongoose';

const lessonSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a lesson title'],
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['Core Academic', 'Career Based'],
    default: 'Core Academic',
  },
  description: {
    type: String,
    trim: true,
  },
  imageSeed: {
    type: String,
    default: '10',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  lessons: [{
    title: { type: String, required: true },
    description: { type: String, default: '' },
    mediaUrl: { type: String, default: '' }
  }]
}, { timestamps: true });

if (mongoose.models.Lesson) {
  delete mongoose.models.Lesson;
}

const Lesson = model('Lesson', lessonSchema);

export default Lesson;
