require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const scholarshipRoutes = require('./routes/scholarships');
const applicationRoutes = require('./routes/applications');
const documentRoutes = require('./routes/documents');
const notificationRoutes = require('./routes/notifications');

// Initialize app
const app = express();

// Connect to database
connectDB();

// CORS — allow all Vercel preview URLs, production URL, and localhost
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (Postman, mobile, server-to-server)
        if (!origin) return callback(null, true);
        // Allow all vercel.app deployments (previews + production)
        if (origin.endsWith('.vercel.app')) return callback(null, true);
        // Allow localhost for local dev
        if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) return callback(null, true);
        // Allow explicit FRONTEND_URL if set
        const allowed = (process.env.FRONTEND_URL || '').split(',').map(u => u.trim()).filter(Boolean);
        if (allowed.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
// Handle OPTIONS preflight for all routes
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/notifications', notificationRoutes);

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'ScholarHub App is live 🚀'
    });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server only when running locally (not in Vercel serverless)
if (process.env.NODE_ENV !== 'production' || process.env.LOCAL_DEV === 'true') {
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
        console.log(`Error: ${err.message}`);
        server.close(() => process.exit(1));
    });
}

module.exports = app;
