import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Skeleton,
    Chip,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    AccessTime as TimeIcon,
    Visibility as ViewIcon,
    BookmarkBorder as BookmarkIcon,
    Share as ShareIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';
import axiosInstance from '../../api/axiosInstance';

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

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: 16,
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: `${fadeInUp} 0.6s ease-out`,
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    },
    cursor: 'pointer',
    marginBottom: theme.spacing(2),
}));

const StyledCardMedia = styled(CardMedia)({
    height: 160,
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 100%)',
    }
});

const CategoryChip = styled(Chip)(({ theme }) => ({
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 2,
    background: 'linear-gradient(45deg, #667eea, #764ba2)',
    color: 'white',
    fontWeight: 600,
    fontSize: '0.75rem',
    height: 28,
    '& .MuiChip-label': {
        paddingX: 12,
    }
}));

const ActionIcons = styled(Box)({
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    display: 'flex',
    gap: 4,
});

const ActionIconButton = styled(IconButton)(({ theme }) => ({
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(10px)',
    width: 32,
    height: 32,
    color: theme.palette.text.secondary,
    '&:hover': {
        background: 'rgba(255,255,255,1)',
        color: theme.palette.primary.main,
        transform: 'scale(1.1)',
    },
    transition: 'all 0.2s ease-in-out',
}));

const MetaInfo = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
}));

const MetaItem = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    '& .MuiSvgIcon-root': {
        fontSize: '1rem',
    }
});

const ShimmerCard = styled(Card)(({ theme }) => ({
    borderRadius: 16,
    marginBottom: theme.spacing(2),
    '& .shimmer': {
        background: `linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%)`,
        backgroundSize: '800px 104px',
        animation: `${shimmer} 1.2s ease-in-out infinite`,
    }
}));

const RelatedNews = ({ currentNewsId, category, onNewsClick }) => {
    const [relatedNews, setRelatedNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchRelatedNews();
    }, [currentNewsId, category]);

    const fetchRelatedNews = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/news');
            
            // Filter out current news and get related news by category or latest
            let filtered = response.data.filter(news => news._id !== currentNewsId);
            
            if (category) {
                // First try to get news from same category
                const sameCategory = filtered.filter(news => 
                    news.category?.toLowerCase() === category.toLowerCase()
                );
                
                if (sameCategory.length >= 5) {
                    filtered = sameCategory.slice(0, 5);
                } else {
                    // If not enough in same category, mix with latest
                    filtered = [
                        ...sameCategory,
                        ...filtered.filter(news => 
                            news.category?.toLowerCase() !== category.toLowerCase()
                        ).slice(0, 5 - sameCategory.length)
                    ];
                }
            } else {
                filtered = filtered.slice(0, 5);
            }
            
            setRelatedNews(filtered);
        } catch (error) {
            console.error('Error fetching related news:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async (news, event) => {
        event.stopPropagation();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: news.title,
                    text: news.content.substring(0, 100) + '...',
                    url: window.location.origin + `/news/${news._id}`
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(window.location.origin + `/news/${news._id}`);
        }
    };

    const handleBookmark = (news, event) => {
        event.stopPropagation();
        // Implement bookmark functionality
        console.log('Bookmark:', news.title);
    };

    const formatDate = (dateString) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch (error) {
            return 'Recently';
        }
    };

    const LoadingSkeleton = () => (
        <ShimmerCard>
            <Box className="shimmer" sx={{ height: 160 }} />
            <CardContent>
                <Box className="shimmer" sx={{ height: 20, mb: 1, borderRadius: 1 }} />
                <Box className="shimmer" sx={{ height: 16, mb: 2, width: '80%', borderRadius: 1 }} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box className="shimmer" sx={{ height: 14, width: 60, borderRadius: 1 }} />
                    <Box className="shimmer" sx={{ height: 14, width: 40, borderRadius: 1 }} />
                </Box>
            </CardContent>
        </ShimmerCard>
    );

    if (loading) {
        return (
            <Box sx={{ px: 2, py: 3 }}>
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
                    Related News
                </Typography>
                {[...Array(3)].map((_, index) => (
                    <LoadingSkeleton key={index} />
                ))}
            </Box>
        );
    }

    if (!relatedNews.length) {
        return null;
    }

    return (
        <Box sx={{ px: 2, py: 3, pb: 12 }}> {/* Extra padding for bottom nav */}
            <Typography 
                variant="h5" 
                sx={{ 
                    mb: 3, 
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: 'center'
                }}
            >
                You Might Also Like
            </Typography>
            
            {relatedNews.map((news, index) => (
                <StyledCard
                    key={news._id}
                    onClick={() => onNewsClick(news._id)}
                    sx={{
                        animationDelay: `${index * 0.1}s`,
                    }}
                >
                    <Box sx={{ position: 'relative' }}>
                        <StyledCardMedia
                            image={news.image || '/api/placeholder/400/160'}
                            title={news.title}
                        />
                        
                        {news.category && (
                            <CategoryChip 
                                label={news.category} 
                                size="small" 
                            />
                        )}
                        
                        <ActionIcons>
                            <ActionIconButton
                                size="small"
                                onClick={(e) => handleBookmark(news, e)}
                            >
                                <BookmarkIcon fontSize="small" />
                            </ActionIconButton>
                            <ActionIconButton
                                size="small"
                                onClick={(e) => handleShare(news, e)}
                            >
                                <ShareIcon fontSize="small" />
                            </ActionIconButton>
                        </ActionIcons>
                    </Box>
                    
                    <CardContent sx={{ pb: 2 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                lineHeight: 1.3,
                                mb: 1,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                color: theme.palette.text.primary,
                            }}
                        >
                            {news.title}
                        </Typography>
                        
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.secondary,
                                lineHeight: 1.4,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                mb: 2
                            }}
                        >
                            {news.content}
                        </Typography>
                        
                        <MetaInfo>
                            <MetaItem>
                                <TimeIcon />
                                <span>{formatDate(news.date || news.createdAt)}</span>
                            </MetaItem>
                            {news.views && (
                                <MetaItem>
                                    <ViewIcon />
                                    <span>{news.views} views</span>
                                </MetaItem>
                            )}
                        </MetaInfo>
                    </CardContent>
                </StyledCard>
            ))}
        </Box>
    );
};

export default RelatedNews;