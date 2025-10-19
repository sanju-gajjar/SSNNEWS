import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Chip,
    IconButton,
    Avatar,
    Skeleton,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    Share as ShareIcon,
    Visibility as VisibilityIcon,
    AccessTime as AccessTimeIcon,
    LocationOn as LocationOnIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const EnhancedNewsCard = ({ 
    news, 
    onReadMore, 
    onLike, 
    onShare,
    loading = false 
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    if (loading) {
        return (
            <Card sx={{ 
                borderRadius: 3, 
                boxShadow: theme.shadows[2],
                overflow: 'hidden'
            }}>
                <Skeleton variant="rectangular" height={isMobile ? 180 : 240} />
                <CardContent>
                    <Skeleton variant="text" height={32} width="80%" />
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="text" height={20} width="60%" />
                </CardContent>
            </Card>
        );
    }

    const timeAgo = news.createdAt ? formatDistanceToNow(new Date(news.createdAt), { addSuffix: true }) : '';

    return (
        <Card 
            sx={{
                borderRadius: 3,
                boxShadow: theme.shadows[2],
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                position: 'relative',
                '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8]
                },
                '&:active': {
                    transform: 'translateY(0px)',
                    transition: 'transform 0.1s ease'
                }
            }}
            onClick={() => onReadMore && onReadMore(news._id)}
        >
            {/* Breaking News Badge */}
            {news.isBreaking && (
                <Chip
                    label="⚡ BREAKING"
                    color="error"
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        zIndex: 2,
                        fontWeight: 'bold',
                        fontSize: '0.75rem'
                    }}
                />
            )}

            {/* Category Badge */}
            <Chip
                label={news.category?.toUpperCase() || 'NEWS'}
                variant="filled"
                size="small"
                sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 2,
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    fontSize: '0.7rem'
                }}
            />

            {/* Image Section */}
            <Box sx={{ position: 'relative' }}>
                {imageLoading && !imageError && (
                    <Skeleton 
                        variant="rectangular" 
                        height={isMobile ? 180 : 240} 
                        sx={{ position: 'absolute', top: 0, left: 0, right: 0 }}
                    />
                )}
                <CardMedia
                    component="img"
                    height={isMobile ? 180 : 240}
                    image={imageError ? '/placeholder-news.jpg' : news.image}
                    alt={news.title}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                        setImageError(true);
                        setImageLoading(false);
                    }}
                    sx={{
                        objectFit: 'cover',
                        filter: imageLoading ? 'blur(5px)' : 'none',
                        transition: 'filter 0.3s ease'
                    }}
                />
                
                {/* Gradient Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '50%',
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                        pointerEvents: 'none'
                    }}
                />
            </Box>

            {/* Content Section */}
            <CardContent sx={{ 
                p: { xs: 2, sm: 3 },
                pb: '8px !important'
            }}>
                {/* Title */}
                <Typography 
                    variant="h6" 
                    sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        lineHeight: 1.3,
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {news.title}
                </Typography>

                {/* Summary */}
                <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.4
                    }}
                >
                    {news.content?.substring(0, 120)}...
                </Typography>

                {/* Meta Information */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    mb: 2,
                    flexWrap: 'wrap'
                }}>
                    {timeAgo && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                                {timeAgo}
                            </Typography>
                        </Box>
                    )}
                    
                    {news.location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                                {news.location}
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <VisibilityIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                            {news.views || 0}
                        </Typography>
                    </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onLike && onLike(news._id);
                            }}
                            sx={{ 
                                color: news.isLiked ? 'error.main' : 'text.secondary',
                                p: 0.5
                            }}
                        >
                            <FavoriteIcon fontSize="small" />
                            <Typography variant="caption" sx={{ ml: 0.5 }}>
                                {news.likeCount || 0}
                            </Typography>
                        </IconButton>

                        <IconButton 
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onShare && onShare(news);
                            }}
                            sx={{ color: 'text.secondary', p: 0.5 }}
                        >
                            <ShareIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {/* Author */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                            {(news.author || 'S')[0]}
                        </Avatar>
                        <Typography variant="caption" color="text.secondary">
                            {news.author || 'SSN News'}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default EnhancedNewsCard;