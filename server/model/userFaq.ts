import mongoose from 'mongoose';

const userFaqSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional: can be anonymous
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: false, // In case answer is generated later
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

const UserFaq = mongoose.model('UserFaq', userFaqSchema);
export default UserFaq;
