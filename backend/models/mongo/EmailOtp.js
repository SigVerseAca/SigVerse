const mongoose = require('mongoose');

// Each document represents the current OTP issued for one email/purpose pair.
const emailOtpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  purpose: { type: String, enum: ['signup', 'login', 'reset'], required: true, index: true },
  code_hash: { type: String, required: true },
  // Meta can carry flow-specific context (for example, signup details) until verification succeeds.
  meta: { type: Object, default: {} },
  attempts: { type: Number, default: 0 },
  // MongoDB TTL deletes the document once this timestamp is reached.
  expires_at: { type: Date, required: true, index: { expires: 0 } }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('EmailOtp', emailOtpSchema, 'email_otps');
