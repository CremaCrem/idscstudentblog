const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tag display name is required'],
      trim: true,
      maxlength: [30, 'Tag name cannot exceed 30 characters']
    },
    normalizedName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },
    usageCount: {
      type: Number,
      default: 0,
      index: true // Indexed for sorting by popularity
    }
  },
  {
    timestamps: true
  }
);

// Create a text index on normalizedName for fast partial text matching (autocomplete)
tagSchema.index({ normalizedName: 'text' });

module.exports = mongoose.model('Tag', tagSchema);
