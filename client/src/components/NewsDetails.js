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
    Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import Loader from './Loader';

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
    background: '#fafafa',
    borderRadius: 12,
    boxShadow: theme.shadows[1],
    maxHeight: '50vh',
    overflowY: 'auto',
}));

const CommentCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    padding: theme.spacing(1, 0),
}));

const NewsDetails = ({ userName, userLocation }) => {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [likes, setLikes] = useState(0);
    const [loading, setLoading] = useState(false);
    const [visibleComments, setVisibleComments] = useState(10);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        axios.get(`${API_URL}/news/${id}`)
            .then(response => {
                if (isMounted) {
                    setNews(response.data);
                    setLikes(response.data.likes);
                }
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [id]);

    useEffect(() => {
        axios.post(`${API_URL}/news/comments`, { id })
            .then(response => setComments(response.data))
            .catch(error => console.error(error));
    }, [id]);

    const handleAddComment = () => {
        if (newComment.trim()) {
            axios.post(`${API_URL}/news/comments/add`, { id, user: userName || 'Anonymous', comment: newComment })
                .then(response => {
                    setComments([response.data, ...comments]);
                    setNewComment('');
                })
                .catch(error => console.error(error));
        }
    };

    const handleLike = () => {
        axios.post(`${API_URL}/news/like`, { id })
            .then(() => setLikes(likes + 1))
            .catch(error => console.error(error));
    };

    const handleLoadMoreComments = () => {
        setVisibleComments((prev) => prev + 10);
    };

    if (!news) return <Typography variant="h6" align="center">Loading...</Typography>;

    return (
        <Box sx={{
            padding: { xs: 1, sm: 3 },
            maxWidth: 600,
            margin: '0 auto',
            background: '#f9f9f9',
            borderRadius: { xs: 0, sm: 3 }
        }}>
            {loading ? <Loader /> : (
                <>
                    <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 2 }}>
                        <CardContent>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>{news.title}</Typography>
                            {news.image && (
                                <Box sx={{ textAlign: 'center', mb: 2 }}>
                                    <img src={news.image} alt={news.title} style={{ maxWidth: '100%', borderRadius: 12 }} />
                                </Box>
                            )}
                            <Typography variant="body1" sx={{ mb: 2 }}>{news.content}</Typography>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>{news.author?.[0] || 'A'}</Avatar>
                                <Typography variant="subtitle1" color="text.secondary">{news.author}</Typography>
                                <Divider orientation="vertical" flexItem />
                                <Typography variant="subtitle2" color="text.secondary">Likes: {likes}</Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    startIcon={<FavoriteIcon />}
                                    onClick={handleLike}
                                    sx={{ ml: 2 }}
                                >
                                    Like
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Comments Section */}
                    <CommentsContainer>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Comments ({comments.length})
                        </Typography>
                        <CommentInput
                            label="Write a comment..."
                            variant="outlined"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<CommentIcon />}
                                        onClick={handleAddComment}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Add
                                    </Button>
                                ),
                            }}
                        />
                        <Divider sx={{ my: 2 }} />
                        <Box>
                            {comments.slice(0, visibleComments).map((comment) => (
                                <CommentCard key={comment._id}>
                                    <Avatar sx={{ bgcolor: 'secondary.main', width: 28, height: 28 }}>
                                        {comment.user?.[0] || 'U'}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                                            {comment.user}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {comment.comment}
                                        </Typography>
                                    </Box>
                                </CommentCard>
                            ))}
                            {comments.length === 0 && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                    No comments yet. Be the first to comment!
                                </Typography>
                            )}
                        </Box>
                        {visibleComments < comments.length && (
                            <Button
                                variant="text"
                                color="primary"
                                sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                                onClick={handleLoadMoreComments}
                                fullWidth
                            >
                                Load More Comments
                            </Button>
                        )}
                    </CommentsContainer>
                </>
            )}
        </Box>
    );
};

export default NewsDetails;

