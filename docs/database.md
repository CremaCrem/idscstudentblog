# Database Schema Specification

Database Engine: MongoDB  
ORM: Mongoose

## 1. User Model Schema (`users`)

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
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
  // --- IDSC Identity Verification Fields ---
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
}, {
  timestamps: true
});

// Compound index for fast retrieval of the pending approval queue
userSchema.index({ verificationStatus: 1, createdAt: -1 });

module.exports = mongoose.model('User', userSchema);
```

## 2. Blog Post Model Schema (`blogposts`)

```javascript
const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  originalUrl: {
    type: String,
    required: [true, 'Blog URL is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  title: {
    type: String,
    default: 'Untitled Student Post',
    trim: true
  },
  description: {
    type: String,
    default: 'No preview available for this blog post.',
    trim: true
  },
  thumbnail: {
    type: String,
    default: '/assets/default-blog-thumbnail.svg'
  },
  cloudinaryPublicId: {
    type: String,
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    index: true
  }],
  isPublished: {
    type: Boolean,
    default: true,
    index: true
  },
  isBroken: {
    type: Boolean,
    default: false,
    index: true
  },
  lastHealthCheckAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Post-delete hook to clean up associated Cloudinary asset
blogPostSchema.post('findOneAndDelete', async function(doc) {
  if (doc && doc.cloudinaryPublicId) {
    const cloudinary = require('cloudinary').v2;
    try {
      await cloudinary.uploader.destroy(doc.cloudinaryPublicId);
    } catch (err) {
      console.error('Failed to delete Cloudinary asset:', err);
    }
  }
});

// Compound indexes for fast query filtering
blogPostSchema.index({ isPublished: 1, tags: 1, createdAt: -1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);
```