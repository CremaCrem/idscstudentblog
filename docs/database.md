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
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  }
}, {
  timestamps: true
});

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

// Compound indexes for fast query filtering
blogPostSchema.index({ isPublished: 1, tags: 1, createdAt: -1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);
```