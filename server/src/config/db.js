const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/idsc_student_blog');
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DATABASE ERROR] ${error.message}`);
    // Exit process with failure if DB connection cannot be established
    process.exit(1);
  }
};

module.exports = connectDB;
