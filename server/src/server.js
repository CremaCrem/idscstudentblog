require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5050;

// Connect to MongoDB Atlas / local database
connectDB();

const server = app.listen(PORT, () => {
    console.log(`[SERVER] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
    console.error(`[UNHANDLED REJECTION] ${err.message}`);
    server.close(() => process.exit(1));
});
