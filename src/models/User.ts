// import mongoose from 'mongoose';

// const UserSchema = new mongoose.Schema({
//   email: { 
//     type: String, 
//     required: true, 
//     unique: true,
//     validate: {
//       validator: function(email: string) {
//         return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//       },
//       message: 'Invalid email format'
//     }
//   },
//   password: { type: String, required: true },
//   otp: String,
//   otpExpires: Date,
//   isVerified: { type: Boolean, default: false },
//   trustedDevices: [{
//     deviceId: String,
//     userAgent: String,
//     ipAddress: String,
//     lastUsed: Date
//   }],
//   loginHistory: [{
//     timestamp: Date,
//     device: String,
//     location: String,
//     riskScore: Number,
//     status: String
//   }]
// }, {
//   timestamps: true
// });

// export default mongoose.models.User || mongoose.model('User', UserSchema);


// import mongoose from 'mongoose';

// const UserSchema = new mongoose.Schema({
//   email: { 
//     type: String, 
//     required: true, 
//     unique: true,
//     validate: {
//       validator: function(email: string) {
//         return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//       },
//       message: 'Invalid email format'
//     }
//   },
//   password: { type: String, required: true },
//   otp: String,
//   otpExpires: Date,
//   isVerified: { type: Boolean, default: false },
//   trustedDevices: [{
//     deviceId: String,
//     userAgent: String,
//     ipAddress: String,
//     location: {
//       country: String,
//       city: String,
//       region: String,
//       timezone: String
//     },
//     lastUsed: Date
//   }],
//   loginHistory: [{
//     timestamp: Date,
//     device: String,
//     userAgent: String,
//     ipAddress: String,
//     location: {
//       country: String,
//       city: String,
//       region: String,
//       timezone: String,
//       latitude: Number,
//       longitude: Number
//     },
//     riskScore: Number,
//     riskFactors: [String],
//     status: String
//   }]
// }, {
//   timestamps: true
// });

// export default mongoose.models.User || mongoose.model('User', UserSchema);

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String }, // Add phone field
  isVerified: { type: Boolean, default: false }, // ADD THIS LINE
  otp: { type: String },
  otpExpires: { type: Date },
  otpMethod: { type: String }, // 'email' or 'phone'
  lastLoginIP: { type: String },
  lastLoginAt: { type: Date },
  loginHistory: [{
    timestamp: { type: Date },
    device: { type: String },
    userAgent: { type: String },
    ipAddress: { type: String },
    mfaMethod: { type: String }, // Store which MFA method was used
    location: {
      country: String,
      city: String,
      region: String,
      timezone: String,
      latitude: Number,
      longitude: Number
    },
    riskScore: Number,
    riskFactors: [String],
    status: String
  }]
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model('User', UserSchema);