const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    location: { 
        type: String, 
        default: '',
        enum: [
            '', 'AHMADABAD', 'AMRELI', 'ANAND', 'ARAVALLI', 'BANASKANTHA', 
            'BHARUCH', 'BHAVNAGAR', 'BOTAD', 'CHHOTA UDEPUR', 'DAHOD', 
            'DANGS', 'DEVBHUMI DWARKA', 'GANDHINAGAR', 'GIR SOMNATH', 
            'JAMNAGAR', 'JUNAGADH', 'KACHCHH', 'KHEDA', 'MAHESANA', 
            'MAHISAGAR', 'MORBI', 'NARMADA', 'NAVSARI', 'PANCHMAHALS', 
            'PATAN', 'PORBANDAR', 'RAJKOT', 'SABARKANTHA', 'SURAT', 
            'SURENDRANAGAR', 'TAPI', 'VADODARA', 'VALSAD'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    preferences: {
        notifications: { type: Boolean, default: true },
        categories: [{ type: String }]
    }
}, { 
    timestamps: true,
    toJSON: { 
        transform: function(doc, ret) {
            delete ret.password;
            return ret;
        }
    }
});

// Index for better performance
userSchema.index({ email: 1, userName: 1 });

module.exports = mongoose.model('User', userSchema);
