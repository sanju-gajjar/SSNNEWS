import React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Chip,
    IconButton,
    Avatar,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    AccessTime as TimeIcon,
    Visibility as ViewIcon,
    BookmarkBorder as BookmarkIcon,
    Share as ShareIcon,
    LocationOn as LocationIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';

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

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: 20,
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: `${fadeInUp} 0.6s ease-out`,
    marginBottom: theme.spacing(3),
    position: 'relative',
    '&:hover': {
        transform: 'translateY(-12px) scale(1.02)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
    },
    cursor: 'pointer',
    [theme.breakpoints.down('sm')]: {
        marginBottom: theme.spacing(2),
        borderRadius: 16,
        '&:hover': {
            transform: 'translateY(-4px)',
        },
    }
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
    height: 240,
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
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)',
    },
    [theme.breakpoints.down('sm')]: {
        height: 200,
    }
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 3,
    background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
    color: 'white',
    fontWeight: 700,
    fontSize: '0.75rem',
    height: 32,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
    '& .MuiChip-label': {
        paddingX: 12,
    },
    [theme.breakpoints.down('sm')]: {
        top: 12,
        left: 12,
        height: 28,
        fontSize: '0.7rem',
    }
}));

const ActionIcons = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 3,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    [theme.breakpoints.down('sm')]: {
        top: 12,
        right: 12,
        gap: 6,
    }
}));

const ActionIconButton = styled(IconButton)(({ theme }) => ({
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(10px)',
    width: 40,
    height: 40,
    color: theme.palette.text.secondary,
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    '&:hover': {
        background: 'rgba(255,255,255,1)',
        color: theme.palette.primary.main,
        transform: 'scale(1.15)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
    },
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    [theme.breakpoints.down('sm')]: {
        width: 36,
        height: 36,
    }
}));

const ContentBox = styled(CardContent)(({ theme }) => ({
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
        paddingBottom: theme.spacing(1.5),
    }
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    lineHeight: 1.3,
    marginBottom: theme.spacing(1.5),
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    color: theme.palette.text.primary,
    fontSize: '1.25rem',
    [theme.breakpoints.down('sm')]: {
        fontSize: '1.1rem',
        marginBottom: theme.spacing(1),
    }
}));

const ContentTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    lineHeight: 1.6,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    marginBottom: theme.spacing(2),
    fontSize: '0.95rem',
    [theme.breakpoints.down('sm')]: {
        WebkitLineClamp: 2,
        fontSize: '0.9rem',
        marginBottom: theme.spacing(1.5),
    }
}));

const MetaInfo = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
        gap: theme.spacing(0.5),
    }
}));

const MetaLeft = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    flex: 1,
    [theme.breakpoints.down('sm')]: {
        gap: theme.spacing(1.5),
    }
}));

const MetaItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    '& .MuiSvgIcon-root': {
        fontSize: '1rem',
        color: theme.palette.primary.main,
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
        '& .MuiSvgIcon-root': {
            fontSize: '0.9rem',
        }
    }
}));

const AuthorInfo = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
        gap: theme.spacing(0.5),
    }
}));

const ModernNewsCard = ({ 
    news, 
    onClick, 
    onShare, 
    onBookmark,
    animationDelay = 0 
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const formatDate = (dateString) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch (error) {
            return 'Recently';
        }
    };

    const handleShare = async (event) => {
        event.stopPropagation();
        if (onShare) {
            onShare(news);
        } else if (navigator.share) {
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
            navigator.clipboard.writeText(window.location.origin + `/news/${news._id}`);
        }
    };

    const handleBookmark = (event) => {
        event.stopPropagation();
        if (onBookmark) {
            onBookmark(news);
        }
    };

    return (
        <StyledCard
            onClick={() => onClick && onClick(news)}
            sx={{
                animationDelay: `${animationDelay}s`,
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <StyledCardMedia
                    image={news.image || '/api/placeholder/400/240'}
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
                        onClick={handleBookmark}
                        aria-label="bookmark"
                    >
                        <BookmarkIcon fontSize="small" />
                    </ActionIconButton>
                    <ActionIconButton
                        size="small"
                        onClick={handleShare}
                        aria-label="share"
                    >
                        <ShareIcon fontSize="small" />
                    </ActionIconButton>
                </ActionIcons>
            </Box>
            
            <ContentBox>
                <TitleTypography variant="h5">
                    {news.title}
                </TitleTypography>
                
                <ContentTypography variant="body1">
                    {news.content}
                </ContentTypography>
                
                <MetaInfo>
                    <MetaLeft>
                        <MetaItem>
                            <TimeIcon />
                            <span>{formatDate(news.date || news.createdAt)}</span>
                        </MetaItem>
                        
                        {news.views && (
                            <MetaItem>
                                <ViewIcon />
                                <span>{news.views}</span>
                            </MetaItem>
                        )}
                        
                        {news.location && (
                            <MetaItem>
                                <LocationIcon />
                                <span>{news.location}</span>
                            </MetaItem>
                        )}
                    </MetaLeft>
                    
                    {news.author && (
                        <AuthorInfo>
                            <Avatar 
                                sx={{ 
                                    width: 32, 
                                    height: 32,
                                    bgcolor: theme.palette.primary.main,
                                    fontSize: '0.875rem',
                                    [theme.breakpoints.down('sm')]: {
                                        width: 28,
                                        height: 28,
                                        fontSize: '0.75rem',
                                    }
                                }}
                            >
                                {(news.author || 'A').charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    fontWeight: 500,
                                    color: theme.palette.text.secondary,
                                    [theme.breakpoints.down('sm')]: {
                                        fontSize: '0.8rem',
                                    }
                                }}
                            >
                                {news.author}
                            </Typography>
                        </AuthorInfo>
                    )}
                </MetaInfo>
            </ContentBox>
        </StyledCard>
    );
};

export default ModernNewsCard;