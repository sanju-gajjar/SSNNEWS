const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');
const xss = require('xss');

// Rate limiting configurations
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
        code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login requests per windowMs
    message: {
        error: 'Too many login attempts, please try again later.',
        code: 'AUTH_RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Security middleware
const securityMiddleware = (app) => {
    // Basic security headers
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:", "http:"],
                connectSrc: ["'self'"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
            },
        },
    }));
    
    // Apply rate limiting
    app.use('/api', generalLimiter);
    app.use('/login', generalLimiter);
    app.use('/register', generalLimiter);
    
    // Input sanitization middleware
    app.use('/api', (req, res, next) => {
        if (req.body) {
            for (let key in req.body) {
                if (typeof req.body[key] === 'string') {
                    req.body[key] = xss(req.body[key]);
                }
            }
        }
        next();
    });
};

// Enhanced input validation
const validateUserInput = {
    email: (email) => {
        if (!email) return { isValid: false, message: 'Email is required' };
        if (!validator.isEmail(email)) return { isValid: false, message: 'Invalid email format' };
        if (!validator.isLength(email, { max: 254 })) return { isValid: false, message: 'Email too long' };
        return { isValid: true };
    },
    
    password: (password) => {
        if (!password) return { isValid: false, message: 'Password is required' };
        if (!validator.isLength(password, { min: 6, max: 128 })) {
            return { isValid: false, message: 'Password must be 6-128 characters long' };
        }
        return { isValid: true };
    },
    
    newsContent: (content) => {
        if (!content) return { isValid: false, message: 'Content is required' };
        if (!validator.isLength(content, { min: 10, max: 5000 })) {
            return { isValid: false, message: 'Content must be 10-5000 characters long' };
        }
        return { isValid: true };
    },
    
    newsTitle: (title) => {
        if (!title) return { isValid: false, message: 'Title is required' };
        if (!validator.isLength(title, { min: 5, max: 200 })) {
            return { isValid: false, message: 'Title must be 5-200 characters long' };
        }
        return { isValid: true };
    },

    userName: (userName) => {
        if (!userName) return { isValid: false, message: 'Username is required' };
        if (!validator.isLength(userName, { min: 2, max: 50 })) {
            return { isValid: false, message: 'Username must be 2-50 characters long' };
        }
        if (!validator.isAlphanumeric(userName.replace(/[._-]/g, ''))) {
            return { isValid: false, message: 'Username can only contain letters, numbers, dots, dashes, and underscores' };
        }
        return { isValid: true };
    }
};

// JWT Token Enhancement
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateSecureJWT = (payload, expiresIn = '24h') => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret === 'secret' || secret.length < 32) {
        throw new Error('JWT_SECRET must be a strong secret key (at least 32 characters)');
    }
    
    return jwt.sign(payload, secret, { 
        expiresIn,
        issuer: 'ssnnews',
        audience: 'ssnnews-users'
    });
};

const verifyJWT = (token) => {
    const secret = process.env.JWT_SECRET;
    return jwt.verify(token, secret, {
        issuer: 'ssnnews',
        audience: 'ssnnews-users'
    });
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const user = verifyJWT(token);
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

module.exports = {
    securityMiddleware,
    validateUserInput,
    generateSecureJWT,
    verifyJWT,
    authenticateToken,
    generalLimiter,
    authLimiter
};
