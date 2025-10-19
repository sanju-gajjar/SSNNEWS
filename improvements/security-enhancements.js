// Enhanced Security Middleware for Server
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');
const xss = require('xss');

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// Security middleware
const securityMiddleware = (app) => {
    app.use(helmet());
    app.use(limiter);
    
    // Input validation middleware
    app.use('/api', (req, res, next) => {
        // Sanitize all string inputs
        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = xss(req.body[key]);
            }
        }
        next();
    });
};

// Enhanced User Input Validation
const validateUserInput = {
    email: (email) => {
        return validator.isEmail(email) && validator.isLength(email, { max: 254 });
    },
    
    password: (password) => {
        return validator.isLength(password, { min: 8, max: 128 }) &&
               /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password);
    },
    
    newsContent: (content) => {
        return validator.isLength(content, { min: 10, max: 5000 });
    },
    
    newsTitle: (title) => {
        return validator.isLength(title, { min: 5, max: 200 });
    }
};

// JWT Token Enhancement
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateSecureJWT = (payload) => {
    const secret = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
    return jwt.sign(payload, secret, { 
        expiresIn: '24h',
        issuer: 'ssnnews',
        audience: 'ssnnews-users'
    });
};

module.exports = {
    securityMiddleware,
    validateUserInput,
    generateSecureJWT
};