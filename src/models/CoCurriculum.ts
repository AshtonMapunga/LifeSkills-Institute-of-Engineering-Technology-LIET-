import mongoose, { Schema, model, models } from 'mongoose';

const coCurriculumSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['Sports and Physical Development', 'Life Skill Sport Academy'],
    required: [true, 'Please provide a category'],
  }
}, { timestamps: true });

if (mongoose.models.CoCurriculum) {
  delete mongoose.models.CoCurriculum;
}

const CoCurriculum = model('CoCurriculum', coCurriculumSchema);

export default CoCurriculum;
