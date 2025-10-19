import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    IconButton,
    Skeleton,
    Alert,
    Avatar,
    Divider,
    useTheme,
    useMediaQuery,
    Fade,
    Tooltip,
    Chip
} from '@mui/material';
import {
    Psychology as HoroscopeIcon,
    Refresh as RefreshIcon,
    Star as StarIcon,
    Palette as ColorIcon,
    Schedule as TimeIcon,
    Favorite as LuckyIcon
} from '@mui/icons-material';
import axiosInstance from '../../api/axiosInstance';
import translations from '../../i18n/translations.js';

const HoroscopeWidget = ({ language = 'gujarati', compact = false, selectedSign = null }) => {
    const [horoscopeData, setHoroscopeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const t = translations.horoscope;
    const tCommon = translations.common;

    const fetchHoroscopeData = async (forceRefresh = false) => {
        try {
            setLoading(true);
            setError(null);

            const endpoint = selectedSign 
                ? `/api/external/horoscope/${selectedSign}${forceRefresh ? '?refresh=true' : ''}`
                : `/api/external/horoscope${forceRefresh ? '?refresh=true' : ''}`;

            const response = await axiosInstance.get(endpoint);
            
            if (response.data.success) {
                setHoroscopeData(response.data);
                setLastUpdated(new Date());
            } else {
                throw new Error('Failed to fetch horoscope data');
            }
        } catch (err) {
            console.error('Horoscope fetch error:', err);
            setError(err.response?.data?.error || 'Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHoroscopeData();
    }, [selectedSign]);

    const handleRefresh = () => {
        fetchHoroscopeData(true);
    };

    const getTimeAgo = (date) => {
        if (!date) return '';
        const minutes = Math.floor((new Date() - date) / (1000 * 60));
        if (minutes < 1) return tCommon.justNow[language];
        if (minutes < 60) return `${minutes} ${tCommon.minutesAgo[language]}`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} ${tCommon.hoursAgo[language]}`;
        const days = Math.floor(hours / 24);
        return `${days} ${tCommon.daysAgo[language]}`;
    };

    const getZodiacEmoji = (sign) => {
        const emojis = {
            'aries': '♈',
            'taurus': '♉',
            'gemini': '♊',
            'cancer': '♋',
            'leo': '♌',
            'virgo': '♍',
            'libra': '♎',
            'scorpio': '♏',
            'sagittarius': '♐',
            'capricorn': '♑',
            'aquarius': '♒',
            'pisces': '♓'
        };
        return emojis[sign] || '⭐';
    };

    if (loading) {
        return (
            <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Skeleton variant="text" width="40%" height={32} />
                        <Skeleton variant="circular" width={40} height={40} />
                    </Box>
                    <Grid container spacing={2}>
                        {[1, 2, 3, 4].map(i => (
                            <Grid item xs={6} sm={3} key={i}>
                                <Skeleton variant="rectangular" height={compact ? 80 : 140} sx={{ borderRadius: 2 }} />
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Alert 
                        severity="error" 
                        action={
                            <IconButton onClick={handleRefresh} size="small">
                                <RefreshIcon />
                            </IconButton>
                        }
                    >
                        {tCommon.error[language]}: {error}
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    if (!horoscopeData || !horoscopeData.data) {
        return (
            <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Alert severity="info">{tCommon.dataNotAvailable[language]}</Alert>
                </CardContent>
            </Card>
        );
    }

    const signs = selectedSign ? [horoscopeData.data] : horoscopeData.data.signs || [];

    return (
        <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                {/* Header */}
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                            <HoroscopeIcon />
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold">
                            {t.title[language]}
                        </Typography>
                    </Box>
                    <Tooltip title={tCommon.refresh[language]}>
                        <IconButton onClick={handleRefresh} size="small">
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Today's Date */}
                <Box mb={3} textAlign="center">
                    <Typography variant="subtitle2" color="text.secondary">
                        {tCommon.today[language]} - {new Date().toLocaleDateString('en-IN')}
                    </Typography>
                </Box>

                {/* Horoscope Cards */}
                <Grid container spacing={isMobile ? 1 : 2}>
                    {signs.slice(0, compact ? 4 : 12).map((sign, index) => (
                        <Grid item xs={6} sm={4} md={selectedSign ? 12 : 3} key={index}>
                            <Fade in timeout={300 + (index * 50)}>
                                <Card 
                                    variant="outlined" 
                                    sx={{ 
                                        height: compact ? 'auto' : (selectedSign ? 'auto' : 180),
                                        background: `linear-gradient(135deg, ${theme.palette.secondary.light}15, ${theme.palette.primary.light}15)`,
                                        borderRadius: 2,
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: theme.shadows[4]
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: isMobile ? 1.5 : 2, pb: isMobile ? 1.5 : 2 }}>
                                        {/* Sign Header */}
                                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                <Typography variant="h6" sx={{ fontSize: 24 }}>
                                                    {getZodiacEmoji(sign.sign)}
                                                </Typography>
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight="bold">
                                                        {sign.signGujarati}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {sign.dateRange}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>

                                        {/* Description */}
                                        <Typography 
                                            variant="body2" 
                                            color="text.primary"
                                            sx={{ 
                                                mb: 2,
                                                lineHeight: 1.4,
                                                fontSize: selectedSign ? '0.95rem' : '0.85rem',
                                                display: '-webkit-box',
                                                WebkitLineClamp: selectedSign ? 6 : 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {sign.description}
                                        </Typography>

                                        {!compact && (
                                            <>
                                                <Divider sx={{ my: 1 }} />
                                                
                                                {/* Lucky Details */}
                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                                                            <StarIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                                                            <Typography variant="caption" fontWeight="bold">
                                                                {t.luckyNumber[language]}:
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body2" color="primary.main" fontWeight="bold">
                                                            {sign.luckyNumber}
                                                        </Typography>
                                                    </Grid>
                                                    
                                                    <Grid item xs={6}>
                                                        <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                                                            <ColorIcon sx={{ fontSize: 14, color: 'secondary.main' }} />
                                                            <Typography variant="caption" fontWeight="bold">
                                                                {t.luckyColor[language]}:
                                                            </Typography>
                                                        </Box>
                                                        <Chip 
                                                            label={sign.color} 
                                                            size="small" 
                                                            sx={{ 
                                                                fontSize: '0.7rem',
                                                                height: 20,
                                                                bgcolor: sign.color?.toLowerCase() === 'red' ? '#ffebee' :
                                                                        sign.color?.toLowerCase() === 'blue' ? '#e3f2fd' :
                                                                        sign.color?.toLowerCase() === 'green' ? '#e8f5e8' :
                                                                        sign.color?.toLowerCase() === 'yellow' ? '#fffde7' :
                                                                        'grey.100'
                                                            }}
                                                        />
                                                    </Grid>

                                                    {selectedSign && (
                                                        <>
                                                            <Grid item xs={6}>
                                                                <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                                                                    <TimeIcon sx={{ fontSize: 14, color: 'info.main' }} />
                                                                    <Typography variant="caption" fontWeight="bold">
                                                                        {t.luckyTime[language]}:
                                                                    </Typography>
                                                                </Box>
                                                                <Typography variant="body2">
                                                                    {sign.luckyTime}
                                                                </Typography>
                                                            </Grid>
                                                            
                                                            <Grid item xs={6}>
                                                                <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                                                                    <LuckyIcon sx={{ fontSize: 14, color: 'error.main' }} />
                                                                    <Typography variant="caption" fontWeight="bold">
                                                                        {t.mood[language]}:
                                                                    </Typography>
                                                                </Box>
                                                                <Typography variant="body2">
                                                                    {sign.mood}
                                                                </Typography>
                                                            </Grid>
                                                        </>
                                                    )}
                                                </Grid>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </Fade>
                        </Grid>
                    ))}
                </Grid>

                {/* Last Updated */}
                {lastUpdated && (
                    <Box mt={2} textAlign="center">
                        <Typography variant="caption" color="text.secondary">
                            {tCommon.lastUpdated[language]} {getTimeAgo(lastUpdated)}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default HoroscopeWidget;