import mongoose, { Schema, model, models } from 'mongoose';

const applicationSchema = new Schema({
  // Step 1 - Student Info
  fullName: { type: String, required: true, trim: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  idNumber: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },

  // Step 2 - Parent / Guardian & Academic Background
  guardianName: { type: String, required: true, trim: true },
  guardianPhone: { type: String, required: true, trim: true },
  guardianOccupation: { type: String, trim: true },
  previousSchool: { type: String, trim: true },
  lastGrade: { type: String, trim: true },
  currentResults: { type: String, trim: true },

  // Step 3 - Program Selection
  programTrack: { type: String, required: true },
  specificCourse: { type: String, required: true },
  intakeStatus: { type: String, required: true, enum: ['First Term', 'Mid-Year Transfer'] },

  // Step 4 - Document uploads (stored as base64 or URL)
  nationalIdImage: { type: String, default: '' },  // base64 or URL
  academicResultsImage: { type: String, default: '' }, // base64 or URL
  hearAboutUs: { type: String, trim: true },

  status: { type: String, enum: ['pending', 'reviewing', 'accepted', 'rejected'], default: 'pending' },
  userId: { type: String, required: true },
}, { timestamps: true });

const Application = models.Application || model('Application', applicationSchema);

export default Application;
