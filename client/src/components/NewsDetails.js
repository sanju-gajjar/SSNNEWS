import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import axios
import { Box, Typography, Button, TextField, Card, CardContent, CardActions, Grid, Modal } from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import Loader from './Loader'; // Import the Loader component

const CommentInput = styled(TextField)({
    marginTop: '1rem',
    width: '100%',
});

const ModalBox = styled(Box)({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxHeight: '80%',
    overflowY: 'auto',
    backgroundColor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    padding: '1rem',
});

const API_URL = process.env.REACT_APP_API_URL;

const NewsDetails = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [likes, setLikes] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state

    useEffect(() => {
        let isMounted = true; // Add a flag to track if the component is mounted
        setLoading(true); // Start loading
        axios.get(`${API_URL}/news/${id}`)
            .then(response => {
                if (isMounted) { // Only update state if the component is still mounted
                    setNews(response.data);
                    setLikes(response.data.likes);
                }
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                if (isMounted) setLoading(false); // Stop loading only if mounted
            });

        return () => {
            isMounted = false; // Cleanup function to prevent state updates after unmount
        };
    }, [id]);

    useEffect(() => {
        axios.post(`${API_URL}/news/comments`, { id })
            .then(response => setComments(response.data))
            .catch(error => console.error(error));
    }, [id]);

    const handleAddComment = () => {
        if (newComment.trim()) {
            axios.post(`${API_URL}/news/comments/add`, { id, user: 'Anonymous', comment: newComment })
                .then(response => {
                    setComments([...comments, response.data]);
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

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    if (!news) return <Typography variant="h6" align="center">Loading...</Typography>;

    return (
        <div>
            {loading ? <Loader /> : (
                <>
                    <Box sx={{ padding: '1rem', maxWidth: '600px', margin: '0 auto' }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h4" gutterBottom>{news.title}</Typography>
                                {news.image && (
                                    <Box sx={{ textAlign: 'center', marginBottom: '1rem' }}>
                                        <img src={news.image} alt={news.title} style={{ maxWidth: '100%', borderRadius: '8px' }} />
                                    </Box>
                                )}
                                <Typography variant="body1" sx={{ marginBottom: '1rem' }}>{news.content}</Typography>
                                <Typography variant="subtitle1" color="text.secondary">Author: {news.author}</Typography>
                                <Typography variant="subtitle2" color="text.secondary">Likes: {likes}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button variant="contained" color="primary" startIcon={<FavoriteIcon />} onClick={handleLike}>
                                    Like
                                </Button>
                                <Button variant="contained" color="secondary" startIcon={<CommentIcon />} onClick={handleOpenModal}>
                                    Comments
                                </Button>
                            </CardActions>
                        </Card>

                        <Box sx={{ marginTop: '2rem' }}>
                            <Typography variant="h5" gutterBottom>Add a Comment</Typography>
                            <CommentInput
                                label="Add a comment"
                                variant="outlined"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <Button variant="contained" color="primary" startIcon={<CommentIcon />} onClick={handleAddComment}>
                                            Add
                                        </Button>
                                    ),
                                }}
                            />
                        </Box>

                        <Modal open={isModalOpen} onClose={handleCloseModal}>
                            <ModalBox>
                                <Typography variant="h5" gutterBottom>All Comments</Typography>
                                <Grid container spacing={2}>
                                    {comments.map((comment) => (
                                        <Grid item xs={12} key={comment._id}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="subtitle1"><strong>{comment.user}:</strong> {comment.comment}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Button variant="contained" color="secondary" onClick={handleCloseModal} sx={{ marginTop: '1rem' }}>
                                    Close
                                </Button>
                            </ModalBox>
                        </Modal>
                    </Box>
                </>
            )}
        </div>
    );
};

export default NewsDetails;
