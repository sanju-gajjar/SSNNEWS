import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Alert,
    Snackbar,
    CircularProgress,
    Avatar,
    Tooltip
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    ArrowBack as ArrowBackIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { categoryMap } from '../i18n/gujaratiTranslations';

const ManageNews = () => {
    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalNews, setTotalNews] = useState(0);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, newsId: null, newsTitle: '' });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchNews();
    }, [page, rowsPerPage]);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/news', {
                params: {
                    page: page + 1,
                    limit: rowsPerPage,
                    sort: '-publishedAt' // Latest first
                }
            });
            setNews(response.data.news || response.data);
            setTotalNews(response.data.total || response.data.length);
        } catch (error) {
            console.error('Failed to fetch news:', error);
            setMessage({ type: 'error', text: 'Failed to load news articles' });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (newsItem) => {
        navigate(`/admin/edit-news?id=${newsItem._id}`, { state: { newsData: newsItem } });
    };

    const handleDeleteClick = (newsItem) => {
        setDeleteDialog({
            open: true,
            newsId: newsItem._id,
            newsTitle: newsItem.title
        });
    };

    const handleDeleteConfirm = async () => {
        try {
            await axiosInstance.delete(`/news/${deleteDialog.newsId}`);
            setMessage({ type: 'success', text: 'News article deleted successfully!' });
            setDeleteDialog({ open: false, newsId: null, newsTitle: '' });
            fetchNews(); // Refresh the list
        } catch (error) {
            console.error('Failed to delete news:', error);
            setMessage({ type: 'error', text: 'Failed to delete news article' });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialog({ open: false, newsId: null, newsTitle: '' });
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/admin/dashboard')}
                        variant="outlined"
                    >
                        Back
                    </Button>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                            Manage News Articles
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Edit or delete existing news articles
                        </Typography>
                    </Box>
                    <Chip label={`${totalNews} Articles`} color="primary" />
                </Box>
            </Box>

            {/* Table */}
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : news.length === 0 ? (
                    <Box sx={{ p: 8, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary">
                            No news articles found
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'primary.main' }}>
                                        <TableCell sx={{ color: 'white', fontWeight: 700 }}>Image</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 700 }}>Title</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 700 }}>Category</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 700 }}>Author</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 700 }}>Published</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 700 }}>Views</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 700 }} align="center">
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {news.map((item) => (
                                        <TableRow
                                            key={item._id}
                                            sx={{
                                                '&:hover': { bgcolor: 'action.hover' },
                                                transition: 'background-color 0.2s'
                                            }}
                                        >
                                            <TableCell>
                                                <Avatar
                                                    src={item.image}
                                                    alt={item.title}
                                                    variant="rounded"
                                                    sx={{ width: 60, height: 60 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        maxWidth: 300,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical'
                                                    }}
                                                >
                                                    {item.title}
                                                </Typography>
                                                {item.topTenPosition && (
                                                    <Chip 
                                                        label={`Top ${item.topTenPosition}`} 
                                                        size="small" 
                                                        color="warning"
                                                        sx={{ mt: 0.5 }}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={categoryMap[item.category] || item.category}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ fontFamily: 'Noto Sans Gujarati, sans-serif' }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {item.author}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatDate(item.publishedAt)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <VisibilityIcon fontSize="small" color="action" />
                                                    <Typography variant="body2">
                                                        {item.views || 0}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                    <Tooltip title="Edit">
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => handleEdit(item)}
                                                            size="small"
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleDeleteClick(item)}
                                                            size="small"
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            component="div"
                            count={totalNews}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                        />
                    </>
                )}
            </Paper>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialog.open}
                onClose={handleDeleteCancel}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 700, color: 'error.main' }}>
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this news article?
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'error.lighter', borderRadius: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                "{deleteDialog.newsTitle}"
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 2, color: 'error.main', fontWeight: 500 }}>
                            This action cannot be undone.
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleDeleteCancel} variant="outlined">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
                        variant="contained" 
                        color="error"
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for messages */}
            <Snackbar
                open={!!message.text}
                autoHideDuration={6000}
                onClose={() => setMessage({ type: '', text: '' })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    severity={message.type} 
                    onClose={() => setMessage({ type: '', text: '' })}
                    sx={{ width: '100%' }}
                >
                    {message.text}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ManageNews;
