const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const path = require('path');
const { securityMiddleware, validateUserInput, generateSecureJWT } = require('./middleware/security');
const { authMiddleware, adminMiddleware } = require('./middleware/auth');
// More flexible CORS configuration for production
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:8080',
  'https://ssanews.onrender.com',
  'https://ssnnews.onrender.com',
  'http://swadeshsandeshnews.com',
  'https://swadeshsandeshnews.com',
];

const isAllowed =
  allowedOrigins.includes(origin) ||
  origin.endsWith('.onrender.com');

if (isAllowed) return callback(null, true);

return callback(new Error('Not allowed by CORS'));
        
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.use(cors(corsOptions));

// Apply security middleware
securityMiddleware(app);

// Handle preflight requests globally
app.options('*', cors(corsOptions));

// Connect to MongoDB   
require('dotenv').config();

// Validate JWT Secret
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret === 'secret' || jwtSecret === 'defaultSecretKey') {
    console.warn('⚠️  WARNING: Using weak JWT secret! Please set a strong JWT_SECRET in .env');
    if (process.env.NODE_ENV === 'production') {
        console.error('❌ CRITICAL: Cannot use weak JWT secret in production!');
        process.exit(1);
    }
}

const mongoUrl = process.env.MONGODB_URL;

mongoose.connect(mongoUrl)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Middleware
app.use(bodyParser.json());

// Health check endpoint
app.get('/ping', (req, res) => {
    res.status(200).send({ status: 'ok', message: 'pong' });
});

// Middleware to log API calls with more details
app.use((req, res, next) => {
    console.log(`[INFO] ${req.method} ${req.url} from origin: ${req.get('Origin') || 'No origin'}`);
    console.log(`[INFO] User-Agent: ${req.get('User-Agent')}`);
    next();
});

// News Schema and Model
const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    title2: { type: String },
    content: { type: String, required: true },
    author: { type: String, required: true },
    approvedby: { type: String, required: true },
    tags: [{ type: String }],
    top: { type: Number, default: 0 },
    video: { type: String },
    image: { type: String },
    source: { type: String },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: [{ user: String, comment: String }],
    createdAt: { type: Date, default: Date.now }
});

// External News Schema and Model
const externalNewsSchema = new mongoose.Schema({
     article_id: { type: String },
  title: { type: String },
  link: { type: String },
  keywords: [{ type: String }],
  creator: [{ type: String }],
  description: { type: String },
  content: { type: String },
  pubDate: { type: String },
  pubDateTZ: { type: String },
  image_url: { type: String },
  video_url: { type: String },
  source_id: { type: String },
  source_name: { type: String },
  source_priority: { type: Number },
  source_url: { type: String },
  source_icon: { type: String },
  language: { type: String },
  country: [{ type: String }],
  category: [{ type: String }],
  sentiment: { type: String },
  sentiment_stats: { type: String },
  ai_tag: { type: String },
  ai_region: { type: String },
  ai_org: { type: String },
  ai_summary: { type: String },
  ai_content: { type: String },
  duplicate: { type: Boolean }
}, { strict: false });

// Import User Model
const User = require('./models/User');

// Registration Route
app.post('/register', async (req, res) => {
    try {
        const { name, email, password, location } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ 
            name,
            email, 
            password: hashedPassword,
            location: location || '',
            role: 'user'
        });
        await user.save();
        console.log(`[INFO] User registered successfully: ${email}`);
        res.status(201).send({ message: 'User registered successfully' });
    } catch (err) {
        console.error(`[ERROR] Registration failed for email: ${req.body.email}`, err);
        res.status(400).send({ message: 'Registration failed', error: err.message });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send({ message: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).send({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });
        
        // Get display name from 'name' field (the actual field in database)
        const displayName = user.name || email.split('@')[0];
        
        console.log(`[INFO] User logged in successfully: ${email}, Role: ${user.role}, DisplayName: ${displayName}`);
        res.send({ 
            message: 'Login successful', 
            token, 
            userName: displayName,
            userLocation: user.location || '',
            userRole: user.role
        });
    } catch (err) {
        console.error(`[ERROR] Login failed for email: ${req.body.email}`, err);
        res.status(400).send({ message: 'Login failed', error: err.message });
    }
});


// Import News Model
const News = require('./models/News');
const ExternalNews = mongoose.model('ExternalNews', externalNewsSchema);

// Routes
// Admin: Add news (Protected Route)
app.post('/news', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const {
            title,
            title2,
            content,
            author,
            approvedby,
            tags,
            top,
            video,
            image,
            source
        } = req.body;

        if (!title || !content || !author || !approvedby || !tags || !video || !image || !source) {
            return res.status(400).send({ message: 'All fields are required.' });
        }

        const tagsArray = Array.isArray(tags)
            ? tags
            : typeof tags === 'string'
                ? tags.split(',').map(tag => tag.trim()).filter(Boolean)
                : [];

        const news = new News({
            title,
            title2,
            content,
            author,
            approvedby,
            tags: tagsArray,
            top: typeof top === 'string' ? Number(top) : top,
            video,
            image,
            source,
            createdAt: new Date()
        });

        await news.save();
        console.log(`[INFO] News added successfully: ${title}`);
        res.status(201).send(news);
    } catch (err) {
        console.error(`[ERROR] Failed to add news: ${req.body.title}`, err);
        res.status(400).send({ message: 'Failed to add news', error: err.message });
    }
});

// Admin: Get dashboard statistics
app.get('/admin/stats', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        // Total news count
        const totalNews = await News.countDocuments();
        
        // Category-wise counts
        const categoryStats = await News.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        // Top 10 news count
        const top10Count = await News.countDocuments({ topTenPosition: { $ne: null, $gte: 1, $lte: 10 } });
        
        // Recent activity (last 7 days)
        const recentNews = await News.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
        
        // Today's news
        const todayNews = await News.countDocuments({ createdAt: { $gte: todayStart } });
        
        // This month's news
        const monthlyNews = await News.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        
        // Total likes across all news
        const likesResult = await News.aggregate([
            {
                $group: {
                    _id: null,
                    totalLikes: {
                        $sum: {
                            $cond: {
                                if: { $isArray: '$likes' },
                                then: { $size: '$likes' },
                                else: { $ifNull: ['$likes', 0] }
                            }
                        }
                    }
                }
            }
        ]);
        const totalLikes = likesResult.length > 0 ? likesResult[0].totalLikes : 0;
        
        // Today's likes - simplified since likes is a number field
        const todayLikes = 0; // Cannot track individual like timestamps with current schema
        
        // Total views
        const viewsResult = await News.aggregate([
            { $group: { _id: null, totalViews: { $sum: { $ifNull: ['$views', 0] } } } }
        ]);
        const totalViews = viewsResult.length > 0 ? viewsResult[0].totalViews : 0;
        
        // Total comments
        const commentsResult = await News.aggregate([
            { 
                $project: { 
                    commentCount: { 
                        $cond: {
                            if: { $isArray: '$comments' },
                            then: { $size: '$comments' },
                            else: 0
                        }
                    } 
                } 
            },
            { $group: { _id: null, totalComments: { $sum: '$commentCount' } } }
        ]);
        const totalComments = commentsResult.length > 0 ? commentsResult[0].totalComments : 0;
        
        // News by date (last 7 days for chart)
        const newsByDate = await News.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            { 
                $group: { 
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        // Trending news (most views in last 7 days)
        const trendingNewsRaw = await News.find({ createdAt: { $gte: sevenDaysAgo } })
            .sort({ views: -1 })
            .limit(5)
            .select('title views likes')
            .lean();

        // Transform trending news to avoid sending full likes arrays
        const trendingNews = trendingNewsRaw.map(news => ({
            title: news.title,
            views: news.views || 0,
            likes: news.likes || 0
        }));
        
        // Total users
        const totalUsers = await User.countDocuments();
        
        // Active users (logged in last 7 days)
        const activeUsers = await User.countDocuments({ lastLogin: { $gte: sevenDaysAgo } });
        
        // Users by role
        const usersByRole = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);
        
        console.log(`[INFO] Admin stats fetched successfully`);
        res.send({
            totalNews,
            todayNews,
            recentNews,
            monthlyNews,
            categoryStats,
            top10Count,
            totalLikes,
            todayLikes,
            totalViews,
            totalComments,
            newsByDate,
            trendingNews,
            totalUsers,
            activeUsers,
            usersByRole
        });
    } catch (err) {
        console.error(`[ERROR] Failed to fetch admin stats`, err);
        res.status(500).send({ message: 'Failed to fetch statistics', error: err.message });
    }
});

// User: Get all news
app.get('/news', async (req, res) => {
    try {
        const news = await News.find();
        console.log(`[INFO] Fetched all news`);
        
        // Clean the news data to remove MongoDB-specific fields from nested objects
        const cleanNews = news.map(item => ({
            _id: item._id,
            title: item.title,
            title2: item.title2,
            content: item.content,
            author: item.author,
            approvedby: item.approvedby,
            tags: item.tags,
            top: item.top,
            topTenPosition: item.topTenPosition,
            video: item.video,
            image: item.image,
            source: item.source,
            views: item.views,
            likes: item.likes || 0,
            comments: Array.isArray(item.comments) ? item.comments.length : 0,
            category: item.category,
            createdAt: item.createdAt
        }));
        
        res.send(cleanNews);
    } catch (err) {
        console.error(`[ERROR] Failed to fetch news`, err);
        res.status(400).send(err.message);
    }
});

// User: Get news details by ID (GET)
app.get('/news/:id', async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        console.log(`[INFO] Fetching news details for ID: ${req.params.id}`);
        if (!news) return res.status(404).send('News not found');
        console.log(`[INFO] Fetched news details: ${req.params.id}`);
        
        // Clean the news data to remove MongoDB-specific fields from nested objects
        const cleanNews = {
            _id: news._id,
            title: news.title,
            title2: news.title2,
            content: news.content,
            author: news.author,
            approvedby: news.approvedby,
            tags: news.tags,
            top: news.top,
            topTenPosition: news.topTenPosition,
            video: news.video,
            image: news.image,
            source: news.source,
            views: news.views,
            likes: news.likes || 0,
            comments: Array.isArray(news.comments) ? news.comments.length : 0,
            category: news.category,
            createdAt: news.createdAt
        };
        
        res.send(cleanNews);
    } catch (err) {
        console.error(`[ERROR] Failed to fetch news details: ${req.params.id}`, err);
        res.status(400).send(err.message);
    }
});
// User: Get news details by ID (GET)

// Admin: Update news by ID (POST)
// Admin: Update news (Protected Route)
app.post('/news/:id/update', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!news) return res.status(404).send({ message: 'News not found' });
        
        // Clean the news data for response
        const cleanNews = {
            _id: news._id,
            title: news.title,
            title2: news.title2,
            content: news.content,
            author: news.author,
            approvedby: news.approvedby,
            tags: news.tags,
            top: news.top,
            topTenPosition: news.topTenPosition,
            video: news.video,
            image: news.image,
            source: news.source,
            views: news.views,
            likes: news.likes || 0,
            comments: Array.isArray(news.comments) ? news.comments.length : 0,
            category: news.category,
            createdAt: news.createdAt
        };
        
        res.status(200).send(cleanNews);
    } catch (error) {
        console.error('Failed to update news:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Admin: Delete news by ID (DELETE)
// Admin: Delete news (Protected Route)
app.delete('/news/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);
        if (!news) return res.status(404).send({ message: 'News not found' });
        console.log(`[INFO] News deleted successfully: ${req.params.id}`);
        res.send({ message: 'News deleted successfully' });
    } catch (err) {
        console.error(`[ERROR] Failed to delete news: ${req.params.id}`, err);
        res.status(400).send(err.message);
    }
});

// User: Like a news (toggle like/unlike)
app.post('/news/like', async (req, res) => {
    try {
        // First get the current news document
        const news = await News.findById(req.body.id);
        if (!news) return res.status(404).send('News not found');

        // Handle migration from array to number if needed
        let currentLikes = news.likes;
        if (Array.isArray(currentLikes)) {
            currentLikes = currentLikes.length;
        } else if (typeof currentLikes !== 'number') {
            currentLikes = 0;
        }

        // Increment likes
        const newLikes = currentLikes + 1;

        // Update the document
        const updatedNews = await News.findByIdAndUpdate(
            req.body.id,
            { likes: newLikes },
            { new: true }
        );

        // Return only the likes count
        res.send({ likes: newLikes });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// User: Unlike a news (decrement likes)
app.post('/news/unlike', async (req, res) => {
    try {
        // First get the current news document
        const news = await News.findById(req.body.id);
        if (!news) return res.status(404).send('News not found');

        // Handle migration from array to number if needed
        let currentLikes = news.likes;
        if (Array.isArray(currentLikes)) {
            currentLikes = currentLikes.length;
        } else if (typeof currentLikes !== 'number') {
            currentLikes = 0;
        }

        // Decrement likes (don't go below 0)
        const newLikes = Math.max(0, currentLikes - 1);

        // Update the document
        const updatedNews = await News.findByIdAndUpdate(
            req.body.id,
            { likes: newLikes },
            { new: true }
        );

        // Return only the likes count
        res.send({ likes: newLikes });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// User: Get all comments for a news
app.post('/news/comments', async (req, res) => {
    try {
        const news = await News.findById(req.body.id);
        if (!news) return res.status(404).send('News not found');
        console.log(`[INFO] Fetched comments for news: ${req.body.id}`);
        const cleanComments = news.comments.map(comment => ({
            user: comment.user,
            comment: comment.comment
        }));
        res.send(cleanComments);
    } catch (err) {
        console.error(`[ERROR] Failed to fetch comments for news: ${req.body.id}`, err);
        res.status(400).send(err.message);
    }
});

// User: Add a comment to a news
app.post('/news/comments/add', async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(
            req.body.id,
            { $push: { comments: { user: req.body.user, comment: req.body.comment } } },
            { new: true }
        );
        if (!news) return res.status(404).send('News not found');
        console.log(`[INFO] Comment added successfully for news: ${req.body.id}`);
        const newComment = news.comments[news.comments.length - 1];
        res.send({
            user: newComment.user,
            comment: newComment.comment
        });
    } catch (err) {
        console.error(`[ERROR] Failed to add comment for news: ${req.body.id}`, err);
        res.status(400).send(err.message);
    }
});

// User: Delete a comment from a news
app.post('/news/comments/delete', async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(
            req.body.id,
            { $pull: { comments: { _id: req.body.commentId } } },
            { new: true }
        );
        if (!news) return res.status(404).send('News not found');
        console.log(`[INFO] Comment deleted successfully for news: ${req.body.id}`);
        res.send(news);
    } catch (err) {
        console.error(`[ERROR] Failed to delete comment for news: ${req.body.id}`, err);
        res.status(400).send(err.message);
    }
});

// Fetch news by date (POST)
app.post('/news', async (req, res) => {
    try {
        const { date } = req.body;
        const startOfDay = new Date(date).setHours(0, 0, 0, 0);
        const endOfDay = new Date(date).setHours(23, 59, 59, 999);

        const news = await News.find({
            createdAt: { $gte: startOfDay, $lte: endOfDay },
        });

        console.log(`[INFO] Fetched news for date: ${date}`);
        res.send(news);
    } catch (err) {
        console.error(`[ERROR] Failed to fetch news for date: ${req.body.date}`, err);
        res.status(400).send(err.message);
    }
});

app.post('/update-district', async (req, res) => {
    const { userName, district } = req.body;

    if (!userName || !district) {
        return res.status(400).json({ error: 'userName and district are required' });
    }

    try {
        // Find user by userName and update or create if not exists
        const user = await User.findOneAndUpdate(
            { name:userName },
            { $set: { location: district } },
            { new: true, upsert: true }
        );

        res.status(200).json({ message: 'District updated successfully', user });
    } catch (error) {
        console.error('Error updating district:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


const PORT = process.env.PORT || 8080;

// Combined external news fetch and store in MongoDB
app.post('/external-news/fetch-and-store', async (req, res) => {
    try {
        const apiKey = process.env.NEWS_API_KEY;
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Check if today's external news already exists
        let existingNews = await ExternalNews.find({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        if (existingNews && existingNews.length > 0) {
        existingNews = await ExternalNews.find({
            createdAt: { $lte: startOfDay }
        }).limit(50)
            return res.send({ count: existingNews.length, message: 'External news already fetched for today', news: existingNews });
        }

        // If not, fetch from external API
        const dateStr = new Date().toISOString().slice(0, 10);
        const urls = [
            `https://newsdata.io/api/1/latest?country=in&language=hi&apikey=${apiKey}`
        ];

        // Fetch each URL sequentially with a delay between requests
        const responses = [];
        for (const url of urls) {
            const response = await axios.get(url);
            responses.push(response);
            // Wait for 500ms between requests to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
        let allNews = [];
        responses.forEach(resp => {
            if (resp.data && Array.isArray(resp.data.results)) {
                allNews = allNews.concat(resp.data.results);
            }
        });

        // Store in MongoDB with createdAt as today and source as 'external'
        const now = new Date();
        const newsDocs = allNews.map(n => ({
            article_id: n.article_id || '',
            title: n.title || '',
            link: n.link || '',
            keywords: Array.isArray(n.keywords) ? n.keywords : (n.keywords ? [n.keywords] : []),
            creator: Array.isArray(n.creator) ? n.creator : (n.creator ? [n.creator] : []),
            description: n.description || '',
            content: n.content || '',
            pubDate: n.pubDate || '',
            pubDateTZ: n.pubDateTZ || '',
            image_url: n.image_url || '',
            video_url: n.video_url || '',
            source_id: n.source_id || '',
            source_name: n.source_name || '',
            source_priority: typeof n.source_priority === 'number' ? n.source_priority : 0,
            source_url: n.source_url || '',
            source_icon: n.source_icon || '',
            language: n.language || '',
            country: Array.isArray(n.country) ? n.country : (n.country ? [n.country] : []),
            category: Array.isArray(n.category) ? n.category : (n.category ? [n.category] : []),
            sentiment: n.sentiment || '',
            sentiment_stats: n.sentiment_stats || '',
            ai_tag: n.ai_tag || '',
            ai_region: n.ai_region || '',
            ai_org: n.ai_org || '',
            ai_summary: n.ai_summary || '',
            ai_content: n.ai_content || '',
            duplicate: typeof n.duplicate === 'boolean' ? n.duplicate : false,
            createdAt: now
        }));

        await ExternalNews.insertMany(newsDocs);
        res.send({ count: newsDocs.length, message: 'External news fetched and stored', news: newsDocs });
    } catch (err) {
        console.error('[ERROR] Failed to fetch and store external news', err);
        res.status(500).send({ message: 'Failed to fetch and store external news', error: err.message });
    }
});

// === EXTERNAL API ROUTES ===
// Import and use external API routes
const externalApiRoutes = require('./routes/externalApiRoutes');
app.use('/api/external', externalApiRoutes);

// === USER ROUTES ===
// Import and use user management routes
const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

// Initialize cron jobs for data fetching
const cronManager = require('./middleware/cronManager');
cronManager.init();

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

//const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`External APIs available at: http://localhost:${PORT}/api/external/`);
});

// Redirect to login if path not found
app.use((req, res) => {
    if (req.path === '/login') {
        res.status(404).send({ message: 'Page not found' });
    } else {
        res.redirect('/login');
    }
});
