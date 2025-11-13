import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Alert,
    Snackbar,
    Chip,
    Divider,
    Card,
    CardContent,
    InputAdornment,
    Avatar
} from '@mui/material';
import {
    Add as AddIcon,
    ArrowBack as ArrowBackIcon,
    Title as TitleIcon,
    Description as DescriptionIcon,
    Person as PersonIcon,
    VerifiedUser as VerifiedIcon,
    Tag as TagIcon,
    OndemandVideo as VideoIcon,
    Image as ImageIcon,
    Source as SourceIcon,
    Star as StarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import CategoryDropdown from './CategoryDropdown';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        title: '',
        title2: '',
        content: '',
        category: 'other',
        author: '',
        approvedby: '',
        tags: '',
        top: 0,
        topTenPosition: null,
        video: '',
        image: '',
        source: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.content || !formData.author || !formData.approvedby || 
            !formData.tags || !formData.video || !formData.image || !formData.source) {
            setMessage({ type: 'error', text: 'Please fill all required fields.' });
            return;
        }

        setLoading(true);
        try {
            await axiosInstance.post('/news', formData);
            setMessage({ type: 'success', text: 'News article created successfully!' });
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 2000);
        } catch (error) {
            console.error('Error creating news:', error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create news article' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Header Section */}
            <Box sx={{ 
                bgcolor: 'white', 
                borderBottom: '1px solid',
                borderColor: 'divider',
                p: { xs: 3, md: 4 }
            }}>
                <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/admin/dashboard')}
                            variant="outlined"
                            size="large"
                        >
                            Dashboard
                        </Button>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', mb: 0.5 }}>
                                Create New Article
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Fill in the details to publish a new news article
                            </Typography>
                        </Box>
                        <Chip 
                            label="Admin" 
                            color="primary" 
                            icon={<VerifiedIcon />}
                            sx={{ px: 1, fontWeight: 600 }}
                        />
                    </Box>
                </Box>
            </Box>

            {/* Form Section */}
            <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Main Content Card */}
                        <Grid item xs={12} lg={8}>
                            <Card elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <DescriptionIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                            Article Content
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ mb: 3 }} />

                                    <Grid container spacing={3}>
                                        {/* Main Title */}
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                                                Primary Title *
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                placeholder="Enter the main headline"
                                                required
                                                variant="outlined"
                                            />
                                        </Grid>

                                        {/* Secondary Title */}
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                                                Secondary Title
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                name="title2"
                                                value={formData.title2}
                                                onChange={handleChange}
                                                placeholder="Enter subtitle (optional)"
                                                variant="outlined"
                                            />
                                        </Grid>

                                        {/* Content */}
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                                                Article Content *
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={12}
                                                name="content"
                                                value={formData.content}
                                                onChange={handleChange}
                                                placeholder="Write your news article content here..."
                                                required
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* Media & Metadata Card */}
                            <Card elevation={2} sx={{ borderRadius: 2 }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <ImageIcon sx={{ mr: 1, color: 'secondary.main', fontSize: 28 }} />
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                            Media & Links
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ mb: 3 }} />

                                    <Grid container spacing={3}>
                                        {/* Image URL */}
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                                                Featured Image URL *
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                name="image"
                                                value={formData.image}
                                                onChange={handleChange}
                                                placeholder="https://example.com/image.jpg"
                                                required
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <ImageIcon color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                variant="outlined"
                                            />
                                        </Grid>

                                        {/* Video URL */}
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                                                Video URL *
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                name="video"
                                                value={formData.video}
                                                onChange={handleChange}
                                                placeholder="https://youtube.com/watch?v=..."
                                                required
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <VideoIcon color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                variant="outlined"
                                            />
                                        </Grid>

                                        {/* Source */}
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                                                Source URL *
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                name="source"
                                                value={formData.source}
                                                onChange={handleChange}
                                                placeholder="https://source-website.com"
                                                required
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <SourceIcon color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Sidebar - Metadata */}
                        <Grid item xs={12} lg={4}>
                            {/* Publishing Details */}
                            <Card elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            Publishing
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                            Author *
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            name="author"
                                            value={formData.author}
                                            onChange={handleChange}
                                            placeholder="Author name"
                                            required
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                            Approved By *
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            name="approvedby"
                                            value={formData.approvedby}
                                            onChange={handleChange}
                                            placeholder="Approver name"
                                            required
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                            Tags *
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleChange}
                                            placeholder="tag1, tag2, tag3"
                                            required
                                            size="small"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <TagIcon color="action" fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            variant="outlined"
                                            helperText="Separate tags with commas"
                                        />
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Category & Features */}
                            <Card elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                        Classification
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                            Category *
                                        </Typography>
                                        <CategoryDropdown
                                            value={formData.category}
                                            onChange={(e) => handleChange({ target: { name: 'category', value: e.target.value } })}
                                        />
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                            Top 10 Position
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            name="topTenPosition"
                                            value={formData.topTenPosition || ''}
                                            onChange={handleChange}
                                            placeholder="1-10 (optional)"
                                            size="small"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <StarIcon color="warning" fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                                inputProps: { min: 1, max: 10 }
                                            }}
                                            variant="outlined"
                                            helperText="Leave empty for no ranking"
                                        />
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Publish Button */}
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={loading}
                                startIcon={<AddIcon />}
                                sx={{
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    bgcolor: 'success.main',
                                    '&:hover': {
                                        bgcolor: 'success.dark',
                                    }
                                }}
                            >
                                {loading ? 'Publishing...' : 'Publish Article'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>

            {/* Snackbar for messages */}
            <Snackbar
                open={!!message.text}
                autoHideDuration={6000}
                onClose={() => setMessage({ type: '', text: '' })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setMessage({ type: '', text: '' })} 
                    severity={message.type}
                    sx={{ width: '100%' }}
                >
                    {message.text}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminPanel;
