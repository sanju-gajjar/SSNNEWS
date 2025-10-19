const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 200,
        index: true
    },
    title2: { 
        type: String,
        trim: true,
        maxlength: 200 
    },
    content: { 
        type: String, 
        required: true,
        maxlength: 5000 
    },
    category: {
        type: String,
        enum: ['technology', 'sports', 'crime', 'politics', 'entertainment', 'other'],
        default: 'other',
        index: true
    },
    image: { 
        type: String, 
        validate: {
            validator: function(v) {
                return !v || /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
            },
            message: 'Invalid image URL format'
        }
    },
    author: {
        type: String,
        default: 'SSN News Team'
    },
    location: {
        type: String,
        enum: [
            'AHMADABAD', 'AMRELI', 'ANAND', 'ARAVALLI', 'BANASKANTHA', 
            'BHARUCH', 'BHAVNAGAR', 'BOTAD', 'CHHOTA UDEPUR', 'DAHOD', 
            'DANGS', 'DEVBHUMI DWARKA', 'GANDHINAGAR', 'GIR SOMNATH', 
            'JAMNAGAR', 'JUNAGADH', 'KACHCHH', 'KHEDA', 'MAHESANA', 
            'MAHISAGAR', 'MORBI', 'NARMADA', 'NAVSARI', 'PANCHMAHALS', 
            'PATAN', 'PORBANDAR', 'RAJKOT', 'SABARKANTHA', 'SURAT', 
            'SURENDRANAGAR', 'TAPI', 'VADODARA', 'VALSAD'
        ],
        index: true
    },
    isBreaking: {
        type: Boolean,
        default: false,
        index: true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now }
    }],
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        userName: String,
        comment: { 
            type: String, 
            maxlength: 500 
        },
        timestamp: { type: Date, default: Date.now }
    }],
    tags: [{ 
        type: String, 
        lowercase: true,
        trim: true 
    }],
    publishedAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published',
        index: true
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Compound indexes for better query performance
newsSchema.index({ category: 1, publishedAt: -1 });
newsSchema.index({ location: 1, publishedAt: -1 });
newsSchema.index({ isBreaking: 1, publishedAt: -1 });
newsSchema.index({ status: 1, publishedAt: -1 });

// Text search index
newsSchema.index({ 
    title: 'text', 
    content: 'text', 
    tags: 'text' 
}, {
    weights: { title: 10, tags: 5, content: 1 }
});

// Virtual for like count
newsSchema.virtual('likeCount').get(function() {
    return this.likes ? this.likes.length : 0;
});

// Virtual for comment count
newsSchema.virtual('commentCount').get(function() {
    return this.comments ? this.comments.length : 0;
});

// Method to increment views
newsSchema.methods.incrementViews = function() {
    this.views += 1;
    return this.save();
};

// Static method for trending news
newsSchema.statics.getTrending = function(limit = 10) {
    return this.find({ 
        status: 'published',
        publishedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })
    .sort({ views: -1, likeCount: -1 })
    .limit(limit);
};

module.exports = mongoose.model('News', newsSchema);
