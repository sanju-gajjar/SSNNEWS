import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {
    Box,
    Typography,
    Button,
    TextField,
    Card,
    CardContent,
    Avatar,
    Paper,
    Divider,
    Stack,
    useMediaQuery,
    Chip,
    IconButton,
    Fab,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { styled, useTheme, keyframes } from '@mui/material/styles';
import {
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Comment as CommentIcon,
    Share as ShareIcon,
    AccessTime as TimeIcon,
    LocationOn as LocationIcon,
    Visibility as ViewIcon,
    BookmarkBorder as BookmarkIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import Loader from './Loader';
import ModernBottomNav from './BottomNavigation/ModernBottomNav';
import RelatedNews from './RelatedNews/RelatedNews';

// Using axiosInstance instead of API_URL

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
    position: 'relative',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: theme.spacing(3),
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    animation: `${fadeInUp} 0.8s ease-out`,
    [theme.breakpoints.down('sm')]: {
        borderRadius: 16,
        marginBottom: theme.spacing(2),
    }
}));

const HeroImage = styled('img')(({ theme }) => ({
    width: '100%',
    height: 'auto',
    maxHeight: 400,
    objectFit: 'cover',
    display: 'block',
    [theme.breakpoints.down('sm')]: {
        maxHeight: 250,
    }
}));

const HeroOverlay = styled(Box)({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
    padding: '40px 24px 24px',
    color: 'white',
});

const ContentCard = styled(Card)(({ theme }) => ({
    borderRadius: 20,
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    marginBottom: theme.spacing(3),
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    animation: `${fadeInUp} 0.8s ease-out 0.2s both`,
    [theme.breakpoints.down('sm')]: {
        borderRadius: 16,
        marginBottom: theme.spacing(2),
    }
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
    background: 'linear-gradient(45deg, #667eea, #764ba2)',
    color: 'white',
    width: 48,
    height: 48,
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
    '&:hover': {
        background: 'linear-gradient(45deg, #764ba2, #667eea)',
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 35px rgba(102, 126, 234, 0.6)',
    },
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    [theme.breakpoints.down('sm')]: {
        width: 44,
        height: 44,
    }
}));

const LikeButton = styled(IconButton)(({ theme, liked }) => ({
    background: liked 
        ? 'linear-gradient(45deg, #FF6B6B, #FF8E53)'
        : 'linear-gradient(45deg, #667eea, #764ba2)',
    color: 'white',
    width: 48,
    height: 48,
    boxShadow: liked 
        ? '0 8px 25px rgba(255, 107, 107, 0.4)'
        : '0 8px 25px rgba(102, 126, 234, 0.4)',
    '&:hover': {
        background: liked
            ? 'linear-gradient(45deg, #FF8E53, #FF6B6B)'
            : 'linear-gradient(45deg, #764ba2, #667eea)',
        transform: 'translateY(-2px) scale(1.05)',
        boxShadow: liked
            ? '0 12px 35px rgba(255, 107, 107, 0.6)'
            : '0 12px 35px rgba(102, 126, 234, 0.6)',
    },
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    [theme.breakpoints.down('sm')]: {
        width: 44,
        height: 44,
    }
}));

const MetaChip = styled(Chip)(({ theme }) => ({
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(10px)',
    color: theme.palette.text.primary,
    fontWeight: 600,
    '& .MuiSvgIcon-root': {
        color: theme.palette.primary.main,
    }
}));

const CommentInput = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: 16,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
    }
}));

const CommentsContainer = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    borderRadius: 20,
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    animation: `${fadeInUp} 0.8s ease-out 0.4s both`,
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
        borderRadius: 16,
    }
}));

const CommentCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    padding: theme.spacing(1, 0),
    borderBottom: '1px solid #eee',
}));

const StickyActions = styled(Box)(({ theme }) => ({
    position: 'sticky',
    bottom: 0,
    background: '#fff',
    zIndex: 10,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}));

const NewsDetails = ({ userName, userLocation }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [news, setNews] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [likes, setLikes] = useState(0);
    const [loading, setLoading] = useState(false);
    const [visibleComments, setVisibleComments] = useState(10);
    const [liked, setLiked] = useState(false);
    const [allNewsIds, setAllNewsIds] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [showAuthDialog, setShowAuthDialog] = useState(false);

    // Use localStorage for auth state
    const isLoggedIn = !!localStorage.getItem('isLoggedIn');
    const storedUserName = localStorage.getItem('userName') || userName;
    const storedUserLocation = localStorage.getItem('userLocation') || userLocation;

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        axiosInstance.get(`/news/${id}`)
            .then(response => {
                if (isMounted) {
                    setNews(response.data);
                    setLikes(response.data.likes);
                    setLiked(false); // Default: not liked
                }
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });
        // Fetch all news IDs for navigation
        axiosInstance.get(`/news`)
            .then(response => {
                if (isMounted) setAllNewsIds(response.data);
            })
            .catch(error => console.error(error));
        return () => {
            isMounted = false;
        };
    }, [id]);

    useEffect(() => {
        axiosInstance.post(`/news/comments`, { id })
            .then(response => setComments(response.data))
            .catch(error => console.error(error));
    }, [id]);

    const handleRequireAuth = (action) => {
        if (!isLoggedIn) {
            setShowAuthDialog(true);
            return false;
        }
        return true;
    };

    const handleAddComment = () => {
        if (!handleRequireAuth('comment')) return;
        if (newComment.trim()) {
            axiosInstance.post(`/news/comments/add`, { id, user: storedUserName || 'Anonymous', comment: newComment })
                .then(response => {
                    setComments([response.data, ...comments]);
                    setNewComment('');
                })
                .catch(error => console.error(error));
        }
    };

    const handleLike = () => {
        if (!handleRequireAuth('like')) return;
        if (!liked) {
            axiosInstance.post(`/news/like`, { id })
                .then(() => {
                    setLikes(likes + 1);
                    setLiked(true);
                })
                .catch(error => console.error(error));
        } else {
            axiosInstance.post(`/news/unlike`, { id })
                .then(() => {
                    setLikes(likes - 1);
                    setLiked(false);
                })
                .catch(error => console.error(error));
        }
    };

    const handleShare = () => {
        let url = window.location.href;
        if (!url.endsWith('/share')) {
            if (url.includes('/share')) {
                // Already contains /share somewhere, do not append
            } else {
                url += '/share';
            }
        }
        const shareData = {
            title: news?.title || 'SSN News',
            text: news?.title || '',
            url,
        };
        if (navigator.share) {
            navigator.share(shareData)
                .catch((error) => console.error('Share failed:', error));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(url)
                .then(() => alert('Link copied to clipboard!'))
                .catch(() => alert('Failed to copy link.'));
        }
    };

    const handleLoadMoreComments = () => {
        setVisibleComments((prev) => prev + 10);
    };

    // Navigation logic - using the state variable
    const newsIndex = allNewsIds.findIndex(nid => String(nid._id) === String(id));
    React.useEffect(() => {
        if (newsIndex !== -1) {
            setCurrentIndex(newsIndex);
        }
    }, [newsIndex]);

    if (loading) return <Loader />;
    if (!news) return <Loader />;
    const prevId = currentIndex > 0 ? allNewsIds[currentIndex - 1] : null;
    const nextId = currentIndex < allNewsIds.length - 1 ? allNewsIds[currentIndex + 1] : null;
    // Navigation handlers
    const handleGoHome = () => navigate('/UserHome');
    const handleGoToNews = (nid) => navigate(`/news/${nid._id}`);
    const handlePrevious = () => prevId && handleGoToNews(prevId);
    const handleNext = () => nextId && handleGoToNews(nextId);

    const formatDate = (dateString) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch (error) {
            return 'Recently';
        }
    };

    const handleNewsClick = (newsId) => {
        navigate(`/news/${newsId}`);
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            pb: 12 // Extra padding for bottom navigation
        }}>
            <Container maxWidth="md" sx={{ px: { xs: 1, sm: 2 } }}>
                {/* Header with back button */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    pt: 2, 
                    pb: 1,
                    animation: `${slideIn} 0.5s ease-out`
                }}>
                    <Fab
                        size="small"
                        onClick={() => navigate(-1)}
                        sx={{ 
                            background: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(10px)',
                            color: theme.palette.primary.main,
                            mr: 2,
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            '&:hover': {
                                background: 'rgba(255,255,255,1)',
                                transform: 'scale(1.1)',
                            }
                        }}
                    >
                        <ArrowBackIcon />
                    </Fab>
                    
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            color: 'white', 
                            fontWeight: 700,
                            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                            flex: 1
                        }}
                    >
                        News Details
                    </Typography>
                </Box>

                {/* Hero Section */}
                <HeroSection>
                    {news.image && (
                        <>
                            <HeroImage 
                                src={news.image} 
                                alt={news.title}
                                loading="lazy"
                            />
                            <HeroOverlay>
                                {news.category && (
                                    <Chip
                                        label={news.category}
                                        sx={{
                                            background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                                            color: 'white',
                                            fontWeight: 700,
                                            mb: 2,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                    />
                                )}
                                <Typography 
                                    variant={isMobile ? "h5" : "h3"} 
                                    sx={{ 
                                        fontWeight: 800,
                                        lineHeight: 1.2,
                                        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                                        mb: 2
                                    }}    
                                >
                                    {news.title}
                                </Typography>
                                
                                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                    <MetaChip
                                        icon={<TimeIcon />}
                                        label={formatDate(news.date || news.createdAt)}
                                        size="small"
                                    />
                                    {news.location && (
                                        <MetaChip
                                            icon={<LocationIcon />}
                                            label={news.location}
                                            size="small"
                                        />
                                    )}
                                    {news.views && (
                                        <MetaChip
                                            icon={<ViewIcon />}
                                            label={`${news.views} views`}
                                            size="small"
                                        />
                                    )}
                                </Stack>
                            </HeroOverlay>
                        </>
                    )}
                </HeroSection>

                {/* Content Card */}
                <ContentCard>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        {!news.image && (
                            <Typography 
                                variant={isMobile ? "h4" : "h3"} 
                                sx={{ 
                                    fontWeight: 800,
                                    mb: 3,
                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                {news.title}
                            </Typography>
                        )}

                        {/* Video Section */}
                        {news.video && (
                            <Box sx={{ mb: 3, borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[8] }}>
                                <iframe
                                    width="100%"
                                    height={isMobile ? 200 : 350}
                                    src={`https://www.youtube.com/embed/${(() => {
                                        const url = news.video;
                                        let videoId = '';
                                        const shortMatch = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
                                        if (shortMatch && shortMatch[1]) videoId = shortMatch[1];
                                        else {
                                            const match = url.match(/(?:v=|\/embed\/|\/live\/|\/shorts\/|\/watch\?v=)([A-Za-z0-9_-]{11})/);
                                            if (match && match[1]) videoId = match[1];
                                            else {
                                                const parts = url.split('/');
                                                const last = parts[parts.length - 1].split('?')[0];
                                                videoId = last.length === 11 ? last : url;
                                            }
                                        }
                                        return videoId;
                                    })()}?autoplay=1`}
                                    title="YouTube video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </Box>
                        )}

                        {/* Content */}
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                lineHeight: 1.8,
                                color: theme.palette.text.primary,
                                mb: 4,
                                textAlign: 'justify'
                            }}
                        >
                            {news.content}
                        </Typography>

                        {/* Author and Meta Info */}
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 2,
                            pt: 2,
                            borderTop: `1px solid ${theme.palette.divider}`
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar 
                                    sx={{ 
                                        bgcolor: theme.palette.primary.main,
                                        width: 40,
                                        height: 40,
                                        fontSize: '1.1rem',
                                        fontWeight: 600
                                    }}
                                >
                                    {news.author?.[0] || 'A'}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        {news.author || 'Anonymous'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Journalist
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Action Buttons */}
                            <Stack direction="row" spacing={1}>
                                <LikeButton 
                                    liked={liked}
                                    onClick={handleLike}
                                    aria-label={liked ? 'Unlike' : 'Like'}
                                >
                                    {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                </LikeButton>
                                
                                <ActionButton onClick={handleShare} aria-label="Share">
                                    <ShareIcon />
                                </ActionButton>
                                
                                <ActionButton aria-label="Bookmark">
                                    <BookmarkIcon />
                                </ActionButton>
                            </Stack>
                        </Box>

                        {/* Likes Count */}
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                mt: 2, 
                                color: theme.palette.text.secondary,
                                textAlign: 'center'
                            }}
                        >
                            {likes} {likes === 1 ? 'person likes' : 'people like'} this article
                        </Typography>
                    </CardContent>
                </ContentCard>

                {/* Comments Section */}
                <CommentsContainer elevation={0}>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            mb: 3,
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Comments ({comments.length})
                    </Typography>
                    
                    {isLoggedIn && (
                        <Box sx={{ mb: 3 }}>
                            <CommentInput
                                label="Share your thoughts..."
                                variant="outlined"
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                multiline
                                rows={3}
                                fullWidth
                            />
                            <Button
                                startIcon={<CommentIcon />}
                                variant="contained"
                                color="primary"
                                sx={{ 
                                    mt: 2, 
                                    borderRadius: 3, 
                                    fontWeight: 600,
                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #764ba2, #667eea)',
                                    }
                                }}
                                onClick={handleAddComment}
                            >
                                Post Comment
                            </Button>
                        </Box>
                    )}
                    
                    {comments.slice(0, visibleComments).map((comment, idx) => (
                        <CommentCard key={idx} sx={{ mb: 2, p: 2, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.02)' }}>
                            <Avatar sx={{ 
                                bgcolor: 'primary.main', 
                                width: 36, 
                                height: 36,
                                mr: 2
                            }}>
                                {comment.user?.[0] || 'A'}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    {comment.user}
                                </Typography>
                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.5 }}>
                                    {comment.comment}
                                </Typography>
                            </Box>
                        </CommentCard>
                    ))}
                    
                    {comments.length > visibleComments && (
                        <Button
                            variant="outlined"
                            color="primary"
                            sx={{ 
                                mt: 2, 
                                borderRadius: 3,
                                width: '100%',
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                            onClick={handleLoadMoreComments}
                        >
                            Load More Comments
                        </Button>
                    )}
                </CommentsContainer>
            </Container>

            {/* Related News Section */}
            <RelatedNews 
                currentNewsId={id} 
                category={news.category}
                onNewsClick={handleNewsClick}
            />

            {/* Modern Bottom Navigation */}
            <ModernBottomNav
                onPrevious={handlePrevious}
                onNext={handleNext}
                onHome={handleGoHome}
                hasPrevious={!!prevId}
                hasNext={!!nextId}
                currentPage="details"
            />

            {/* Authentication Required Dialog */}
            <Dialog 
                open={showAuthDialog} 
                onClose={() => setShowAuthDialog(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        maxWidth: 400,
                        m: 2
                    }
                }}
            >
                <DialogTitle sx={{ 
                    textAlign: 'center',
                    pb: 1,
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    color: 'white',
                    fontWeight: 700
                }}>
                    Login Required
                </DialogTitle>
                <DialogContent sx={{ pt: 3, textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Please login to interact with news articles.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        You can like, comment, and bookmark articles after logging in.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
                    <Button
                        onClick={() => setShowAuthDialog(false)}
                        color="inherit"
                        sx={{ 
                            borderRadius: 3,
                            textTransform: 'none',
                            fontWeight: 600
                        }}
                    >
                        Continue Reading
                    </Button>
                    <Button
                        onClick={() => {
                            setShowAuthDialog(false);
                            navigate('/login');
                        }}
                        variant="contained"
                        sx={{ 
                            borderRadius: 3,
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                                background: 'linear-gradient(45deg, #764ba2, #667eea)',
                            }
                        }}
                    >
                        Login Now
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default NewsDetails;
