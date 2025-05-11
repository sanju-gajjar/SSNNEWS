const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Add this line
const jwt = require('jsonwebtoken'); // Add this line

const corsOptions = {
    origin: ['http://localhost:3000', 'https://ssanews.onrender.com'], // Allow both origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS for preflight
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    credentials: true, // Allow credentials if needed
};

app.use(cors(corsOptions)); // Apply CORS middleware

// Handle preflight requests globally
app.options('*', cors(corsOptions));

// Connect to MongoDB   
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || 'defaultSecretKey';

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Middleware
app.use(bodyParser.json());

// News Schema and Model
const newsSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    likes: { type: Number, default: 0 },
    comments: [{ user: String, comment: String }],
    createdAt: { type: Date, default: Date.now }
});

// User Schema and Model
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model('User', userSchema);

// Registration Route
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (err) {
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
        res.send({ message: 'Login successful', token });
    } catch (err) {
        res.status(400).send({ message: 'Login failed', error: err.message });
    }
});


const News = mongoose.model('News', newsSchema);

// Routes
// Admin: Add news
app.post('/news', async (req, res) => {
    try {
        const news = new News(req.body);
        await news.save();
        res.status(201).send(news);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Admin: Update news
app.put('/news/:id', async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!news) return res.status(404).send('News not found');
        res.send(news);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Admin: Delete news
app.delete('/news/:id', async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);
        if (!news) return res.status(404).send('News not found');
        res.send(news);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// User: Get all news
app.get('/news', async (req, res) => {
    try {
        const news = await News.find();
        res.send(news);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// User: Get news details
app.post('/news/details', async (req, res) => {
    try {
        const news = await News.findById(req.body.id);
        if (!news) return res.status(404).send('News not found');
        res.send(news);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// User: Like a news
app.post('/news/like', async (req, res) => {
    try {
        const news = await News.findById(req.body.id);
        if (!news) return res.status(404).send('News not found');
        news.likes += 1;
        await news.save();
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
        res.send(news.comments);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// User: Add a comment to a news
app.post('/news/comments/add', async (req, res) => {
    try {
        const news = await News.findById(req.body.id);
        if (!news) return res.status(404).send('News not found');
        news.comments.push({ user: req.body.user, comment: req.body.comment });
        await news.save();
        res.send(news.comments[news.comments.length - 1]);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// User: Delete a comment from a news
app.post('/news/comments/delete', async (req, res) => {
    try {
        const news = await News.findById(req.body.id);
        if (!news) return res.status(404).send('News not found');
        const commentIndex = news.comments.findIndex(comment => comment._id.toString() === req.body.commentId);
        if (commentIndex === -1) return res.status(404).send('Comment not found');
        news.comments.splice(commentIndex, 1);
        await news.save();
        res.send(news);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});

// Redirect to login if path not found
app.use((req, res) => {
    res.redirect('/login');
});