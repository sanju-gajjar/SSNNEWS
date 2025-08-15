import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Typography,
    Button,
    TextField,
    Card,
    CardContent,
    CardActions,
    Grid,
    Avatar,
    Paper,
    Divider,
    Stack,
    useMediaQuery
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import Loader from './Loader';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const API_URL = process.env.REACT_APP_API_URL;

const CommentInput = styled(TextField)(({ theme }) => ({
    marginTop: theme.spacing(2),
    width: '100%',
    background: '#fff',
    borderRadius: 8,
}));

const CommentsContainer = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    background: '#f8f9fa',
    borderRadius: 16,
    boxShadow: theme.shadows[2],
    maxHeight: '50vh',
    overflowY: 'auto',
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
    const [news, setNews] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [likes, setLikes] = useState(0);
    const [loading, setLoading] = useState(false);
    const [visibleComments, setVisibleComments] = useState(10);
    const [liked, setLiked] = useState(false);
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const [allNewsIds, setAllNewsIds] = useState([]);

    // Use localStorage for auth state
    const isLoggedIn = !!localStorage.getItem('isLoggedIn');
    const storedUserName = localStorage.getItem('userName') || userName;
    const storedUserLocation = localStorage.getItem('userLocation') || userLocation;

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        axios.get(`${API_URL}/news/${id}`)
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
        axios.get(`${API_URL}/news`)
            .then(response => {
                if (isMounted) setAllNewsIds(response.data);
            })
            .catch(error => console.error(error));
        return () => {
            isMounted = false;
        };
    }, [id]);

    useEffect(() => {
        axios.post(`${API_URL}/news/comments`, { id })
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
            axios.post(`${API_URL}/news/comments/add`, { id, user: storedUserName || 'Anonymous', comment: newComment })
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
            axios.post(`${API_URL}/news/like`, { id })
                .then(() => {
                    setLikes(likes + 1);
                    setLiked(true);
                })
                .catch(error => console.error(error));
        } else {
            axios.post(`${API_URL}/news/unlike`, { id })
                .then(() => {
                    setLikes(likes - 1);
                    setLiked(false);
                })
                .catch(error => console.error(error));
        }
    };

    const handleShare = () => {
        const url = window.location.href;
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

    if (!news) return <Loader />;

    // Navigation logic
    const currentIndex = allNewsIds.findIndex(nid => String(nid._id) === String(id));
    const prevId = currentIndex > 0 ? allNewsIds[currentIndex - 1] : null;
    const nextId = currentIndex < allNewsIds.length - 1 ? allNewsIds[currentIndex + 1] : null;
    const handleGoBack = () => window.history.back();
    const handleGoHome = () => window.location.href = '/UserHome';
    const handleGoToNews = (nid) => window.location.href = `/news/${nid._id}`;

    return (
        <Box sx={{
            padding: { xs: 1, sm: 3 },
            maxWidth: 600,
            margin: '0 auto',
            background: '#f9f9f9',
            borderRadius: { xs: 0, sm: 3 },
            minHeight: '100vh'
        }}>
            {/* Navigation Bar */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                px: 1,
                py: 1,
                background: '#fff',
                borderRadius: 3,
                boxShadow: theme.shadows[2],
                position: 'sticky',
                top: 0,
                zIndex: 20
            }}>
                {/* <Button variant="outlined" color="primary" onClick={handleGoBack} sx={{ borderRadius: 2, fontWeight: 600 }}>
                    Back
                </Button> */}
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        color="secondary"
                        disabled={!prevId}
                        onClick={() => handleGoToNews(prevId)}
                        sx={{ borderRadius: 2, fontWeight: 600 }}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        disabled={!nextId}
                        onClick={() => handleGoToNews(nextId)}
                        sx={{ borderRadius: 2, fontWeight: 600 }}
                    >
                        Next
                    </Button>
                </Stack>
                <Button variant="outlined" color="primary" onClick={handleGoHome} sx={{ borderRadius: 2, fontWeight: 600 }}>
                    Home
                </Button>
            </Box>
            {/* News Card */}
            <Card sx={{
                mb: 2,
                borderRadius: 4,
                boxShadow: 3,
                overflow: 'hidden',
                position: 'relative'
            }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, fontSize: isMobile ? '1.3rem' : '2rem' }}>{news.title}</Typography>
                    {news.image && (
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <img src={news.image} alt={news.title} style={{ maxWidth: '100%', borderRadius: 16, boxShadow: theme.shadows[2] }} />
                        </Box>
                    )}
                    {news.video && (
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <iframe
                                width="100%"
                                height={isMobile ? 200 : 350}
                                src={`https://www.youtube.com/embed/${(() => {
                                    const url = news.video;
                                    const match = url.match(/(?:v=|\/embed\/|\/live\/|\/shorts\/|\/watch\?v=)([A-Za-z0-9_-]{11})/);
                                    if (match && match[1]) return match[1];
                                    const parts = url.split('/');
                                    const last = parts[parts.length - 1];
                                    return last.length === 11 ? last : url;
                                })()}?autoplay=1`}
                                title="YouTube video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ borderRadius: 16, boxShadow: theme.shadows[2] }}
                            />
                            {/* Removed the Share Video button as per autoplay request */}
                        </Box>
                    )}
                    <Typography variant="body1" sx={{ mb: 2, fontSize: isMobile ? '1rem' : '1.1rem', color: '#333' }}>{news.content}</Typography>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>{news.author?.[0] || 'A'}</Avatar>
                        <Typography variant="subtitle1" color="text.secondary">{news.author}</Typography>
                        <Divider orientation="vertical" flexItem />
                        <Typography variant="subtitle2" color="text.secondary">Likes: {likes}</Typography>
                    </Stack>
                </CardContent>
                <CardActions>
                    <Button
                        startIcon={<FavoriteIcon />}
                        color={liked ? 'error' : 'primary'}
                        variant="contained"
                        onClick={handleLike}
                        sx={{ borderRadius: 2, fontWeight: 600 }}
                    >
                        {liked ? 'Liked' : 'Like'}
                    </Button>
                    <Button
                        startIcon={<ShareIcon />}
                        color="primary"
                        variant="outlined"
                        onClick={handleShare}
                        sx={{ borderRadius: 2, fontWeight: 600 }}
                    >
                        Share
                    </Button>
                </CardActions>
            </Card>
            <CommentsContainer elevation={0}>
                <Typography variant="h6" sx={{ mb: 2 }}>Comments</Typography>
                {isLoggedIn && (
                    <Box sx={{ mb: 2 }}>
                        <CommentInput
                            label="Add a comment"
                            variant="outlined"
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            multiline
                            rows={2}
                        />
                        <Button
                            startIcon={<CommentIcon />}
                            variant="contained"
                            color="primary"
                            sx={{ mt: 1, borderRadius: 2, fontWeight: 600 }}
                            onClick={handleAddComment}
                        >
                            Post
                        </Button>
                    </Box>
                )}
                {comments.slice(0, visibleComments).map((comment, idx) => (
                    <CommentCard key={idx}>
                        <Avatar sx={{ bgcolor: 'secondary.main', width: 28, height: 28 }}>
                            {comment.user?.[0] || 'A'}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{comment.user}</Typography>
                            <Typography variant="body2" sx={{ color: '#555' }}>{comment.comment}</Typography>
                        </Box>
                    </CommentCard>
                ))}
                {comments.length > visibleComments && (
                    <Button
                        variant="text"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={handleLoadMoreComments}
                    >
                        Load more comments
                    </Button>
                )}
            </CommentsContainer>
            <Dialog open={showAuthDialog} onClose={() => setShowAuthDialog(false)}>
                <DialogTitle>Authentication Required</DialogTitle>
                <DialogContent>
                    <Typography>
                        You need to be logged in to perform this action.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => {
                            setShowAuthDialog(false);
                            window.location.href = '/'; // Redirect to login
                        }}
                    >
                        Login
                    </Button>
                    <Button onClick={() => setShowAuthDialog(false)} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default NewsDetails;
