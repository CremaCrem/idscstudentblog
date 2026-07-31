const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const tagRoutes = require('./routes/tagRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// CORS Configuration (Must be before any other middleware or routes)
const allowedOrigins = [process.env.ALLOWED_ORIGIN || 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174'];
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        optionsSuccessStatus: 200 // Provides 200 OK for legacy browsers/proxies choking on 204
    })
);
app.options('/*splat', cors());

// Security HTTP headers
app.use(helmet({
    crossOriginResourcePolicy: false, // Prevents Helmet from blocking cross-origin requests
}));

// Logging
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

// Body Parsing & Cookie Parsing Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiting for Auth endpoints (10 requests per 15 minutes per IP)
const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many authentication attempts. Please try again after 15 minutes.',
            timestamp: new Date().toISOString()
        }
    }
});

// API Routes
app.use('/api/v1/auth', authRateLimiter, authRoutes);
app.use('/api/v1/tags', tagRoutes);
app.use('/api/v1/blogs', require('./routes/blogRoutes'));
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/upload', require('./routes/uploadRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Unhandled Route Handler (404)
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Cannot ${req.method} ${req.originalUrl}`,
            timestamp: new Date().toISOString()
        }
    });
});

// Centralized Express Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const errorCode = err.code || 'INTERNAL_SERVER_ERROR';

    console.error(`[SERVER ERROR] [${new Date().toISOString()}] ${err.stack || err.message}`);

    res.status(statusCode).json({
        success: false,
        error: {
            code: errorCode,
            message: statusCode === 500 ? 'An unexpected server error occurred.' : err.message,
            ...(err.details && { details: err.details }),
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
            timestamp: new Date().toISOString()
        }
    });
});

module.exports = app;
