const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./modules/auth/auth.routes.js');

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

//Routes 
app.use("/api/v1/auth", authRoutes);

// Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'running'
    });
});

// 404 Not Found handler
app.use((req, res, next) => {
    const error = new (require('./utils/ApiError'))(404, 'Route not found');
    next(error);
});

// Global Error Handler Middleware
const errorHandler = require('./core/middlewares/error.middleware');
app.use(errorHandler);

module.exports = app;
