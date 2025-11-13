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
        enum: [
            'breaking',           // તાજા સમાચાર
            'national',          // રાષ્ટ્રીય
            'international',     // આંતરરાષ્ટ્રીય
            'state',            // રાજ્ય સમાચાર
            'city',             // શહેર
            'politics',         // રાજકારણ
            'business',         // વ્યવસાય
            'sports',           // રમતગમત
            'entertainment',    // મનોરંજન
            'technology',       // ટેકનોલોજી
            'health',           // આરોગ્ય
            'lifestyle',        // જીવનશૈલી
            'education',        // શિક્ષણ
            'opinion',          // અભિપ્રાય
            'blog',             // બ્લોગ
            'photo',            // તસવીરો
            'video',            // વીડિયો
            'weather',          // હવામાન
            'other'             // અન્ય
        ],
        default: 'other',
        index: true
    },
    image: { 
        type: String,
        validate: {
            validator: function(v) {
                if (!v) return true; // Allow empty
                return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
            },
            message: 'Invalid image URL format'
        }
    },
    author: {
        type: String,
        default: 'SSN News Team',
        maxlength: 100
    },
    location: {
        type: String,
        enum: [
            '', 'AHMADABAD', 'AMRELI', 'ANAND', 'ARAVALLI', 'BANASKANTHA', 
            'BHARUCH', 'BHAVNAGAR', 'BOTAD', 'CHHOTA UDEPUR', 'DAHOD', 
            'DANGS', 'DEVBHUMI DWARKA', 'GANDHINAGAR', 'GIR SOMNATH', 
            'JAMNAGAR', 'JUNAGADH', 'KACHCHH', 'KHEDA', 'MAHESANA', 
            'MAHISAGAR', 'MORBI', 'NARMADA', 'NAVSARI', 'PANCHMAHALS', 
            'PATAN', 'PORBANDAR', 'RAJKOT', 'SABARKANTHA', 'SURAT', 
            'SURENDRANAGAR', 'TAPI', 'VADODARA', 'VALSAD'
        ],
        default: '',
        index: true
    },
    isBreaking: {
        type: Boolean,
        default: false,
        index: true
    },
    views: {
        type: Number,
        default: 0,
        min: 0
    },
    likes: {
        type: Number,
        default: 0,
        min: 0
    },
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        userName: { type: String, required: true },
        comment: { 
            type: String, 
            required: true,
            maxlength: 500,
            trim: true
        },
        timestamp: { type: Date, default: Date.now }
    }],
    tags: [{ 
        type: String, 
        lowercase: true,
        trim: true,
        maxlength: 50
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
    },
    slug: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true
    },
    videoDuration: {
        type: String,
        default: ''
    },
    thumbnailUrl: {
        type: String,
        default: ''
    },
    topTenPosition: {
        type: Number,
        default: null,
        min: 1,
        max: 10
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
newsSchema.index({ views: -1, publishedAt: -1 });
newsSchema.index({ topTenPosition: 1 }, { sparse: true, unique: false });

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
    return this.likes || 0;
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

// Method to add like (increment count)
newsSchema.methods.addLike = function() {
    this.likes += 1;
    return this.save();
};

// Method to remove like (decrement count)
newsSchema.methods.removeLike = function() {
    if (this.likes > 0) {
        this.likes -= 1;
        return this.save();
    }
    return this;
};

// Method to add comment
newsSchema.methods.addComment = function(userId, userName, comment) {
    this.comments.push({ userId, userName, comment });
    return this.save();
};

// Static method for trending news
newsSchema.statics.getTrending = function(limit = 10) {
    return this.find({ 
        status: 'published',
        publishedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })
    .sort({ views: -1, 'likes': -1 })
    .limit(limit);
};

// Static method for search
newsSchema.statics.searchNews = function(query, options = {}) {
    const { 
        category, 
        location, 
        limit = 20, 
        skip = 0,
        sortBy = 'publishedAt',
        sortOrder = -1 
    } = options;
    
    const searchQuery = {
        status: 'published',
        $text: { $search: query }
    };
    
    if (category && category !== 'all') {
        searchQuery.category = category;
    }
    
    if (location && location !== 'all') {
        searchQuery.location = location;
    }
    
    return this.find(searchQuery)
        .sort({ [sortBy]: sortOrder })
        .limit(limit)
        .skip(skip);
};

// Pre-save middleware for slug generation
newsSchema.pre('save', function(next) {
    if (this.isModified('title') || this.isNew) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 100);
    }
    next();
});

module.exports = mongoose.model('News', newsSchema);