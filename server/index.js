const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Add this line
const jwt = require('jsonwebtoken'); // Add this line
const axios = require('axios'); // For external API requests
const path = require('path');
const corsOptions = {
    origin: ['http://localhost:3000', 'https://ssanews.onrender.com'], // Allow both origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS for preflight
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    credentials: true, // Allow credentials if needed
};

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.use(cors(corsOptions)); // Apply CORS middleware

// Handle preflight requests globally
app.options('*', cors(corsOptions));

// Connect to MongoDB   
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || 'defaultSecretKey';
const mongoUrl = process.env.MONGODB_URL ;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Middleware
app.use(bodyParser.json());

// Health check endpoint
app.get('/ping', (req, res) => {
    res.status(200).send({ status: 'ok', message: 'pong' });
});

// Middleware to log API calls
app.use((req, res, next) => {
    console.log(`[INFO] ${req.method} request received for ${req.url}`);
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

// User Schema and Model
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    location: String
});

const User = mongoose.model('User', userSchema);

// Registration Route
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
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

        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
        console.log(`[INFO] User logged in successfully: ${email}`);
        res.send({ 
            message: 'Login successful', 
            token, 
            userName: user.name, 
            userLocation: user.location // Include location in the response
        });
    } catch (err) {
        console.error(`[ERROR] Login failed for email: ${req.body.email}`, err);
        res.status(400).send({ message: 'Login failed', error: err.message });
    }
});


const News = mongoose.model('News', newsSchema);
const ExternalNews = mongoose.model('ExternalNews', externalNewsSchema);

// Routes
// Admin: Add news
app.post('/news', async (req, res) => {
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

// User: Get all news
app.get('/news', async (req, res) => {
    try {
        const news = await News.find();
        console.log(`[INFO] Fetched all news`);
        res.send(news);
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
        res.send(news);
    } catch (err) {
        console.error(`[ERROR] Failed to fetch news details: ${req.params.id}`, err);
        res.status(400).send(err.message);
    }
});

// Admin: Update news by ID (POST)
app.post('/news/:id/update', async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!news) return res.status(404).send({ message: 'News not found' });
        res.status(200).send(news);
    } catch (error) {
        console.error('Failed to update news:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Admin: Delete news by ID (DELETE)
app.delete('/news/:id', async (req, res) => {
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
        const news = await News.findByIdAndUpdate(
            req.body.id,
            { $inc: { likes: 1 } },
            { new: true }
        );
        if (!news) return res.status(404).send('News not found');
        res.send(news);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// User: Unlike a news (decrement likes)
app.post('/news/unlike', async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(
            req.body.id,
            { $inc: { likes: -1 } },
            { new: true }
        );
        if (!news) return res.status(404).send('News not found');
        res.send(news);
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
        res.send(news.comments);
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
        res.send(news.comments[news.comments.length - 1]);
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
        const existingNews = await ExternalNews.find({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        if (existingNews && existingNews.length > 0) {
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
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});

// Redirect to login if path not found
app.use((req, res) => {
    if (req.path === '/login') {
        res.status(404).send({ message: 'Page not found' });
    } else {
        res.redirect('/login');
    }
});