const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters']
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    },
    fullName: {
      type: String,
      required: [true, 'Full Name is required'],
      trim: true,
      minlength: [2, 'Full Name must be at least 2 characters'],
      maxlength: [100, 'Full Name cannot exceed 100 characters']
    },
    studentId: {
      type: String,
      required: [true, 'Student ID Number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: ''
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    verifiedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

userSchema.index({ verificationStatus: 1, createdAt: -1 });

// Indexes for fast lookup
userSchema.index({ email: 1, username: 1 });

module.exports = mongoose.model('User', userSchema);
