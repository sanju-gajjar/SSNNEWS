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
    Chip,
    Avatar,
    Divider,
    useTheme,
    useMediaQuery,
    Fade,
    Tooltip
} from '@mui/material';
import {
    WbSunny as SunnyIcon,
    Cloud as CloudIcon,
    Refresh as RefreshIcon,
    LocationOn as LocationIcon,
    Thermostat as TempIcon,
    Water as HumidityIcon,
    Air as WindIcon,
    Visibility as VisibilityIcon,
    Schedule as TimeIcon,
    TrendingUp as HighIcon,
    TrendingDown as LowIcon
} from '@mui/icons-material';
import axiosInstance from '../../api/axiosInstance';
import translations from '../../i18n/translations.js';

const WeatherWidget = ({ language = 'gujarati', compact = false, selectedCity = null }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const t = translations.weather;
    const tCommon = translations.common;

    const fetchWeatherData = async (forceRefresh = false) => {
        try {
            setLoading(true);
            setError(null);

            const endpoint = selectedCity 
                ? `/api/external/weather/${selectedCity}${forceRefresh ? '?refresh=true' : ''}`
                : `/api/external/weather${forceRefresh ? '?refresh=true' : ''}`;

            const response = await axiosInstance.get(endpoint);
            
            if (response.data.success) {
                setWeatherData(response.data);
                setLastUpdated(new Date());
            } else {
                throw new Error('Failed to fetch weather data');
            }
        } catch (err) {
            console.error('Weather fetch error:', err);
            setError(err.response?.data?.error || 'Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeatherData();
    }, [selectedCity]);

    const handleRefresh = () => {
        fetchWeatherData(true);
    };

    const getWeatherIcon = (condition, iconCode) => {
        if (iconCode && iconCode.includes('01')) return <SunnyIcon sx={{ color: '#FFA726' }} />;
        if (iconCode && (iconCode.includes('02') || iconCode.includes('03'))) return <CloudIcon sx={{ color: '#90A4AE' }} />;
        return <CloudIcon sx={{ color: '#78909C' }} />;
    };

    const formatTime = (timeString) => {
        try {
            return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return timeString;
        }
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

    if (loading) {
        return (
            <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Skeleton variant="text" width="40%" height={32} />
                        <Skeleton variant="circular" width={40} height={40} />
                    </Box>
                    <Grid container spacing={2}>
                        {[1, 2, 3].map(i => (
                            <Grid item xs={4} key={i}>
                                <Skeleton variant="rectangular" height={compact ? 80 : 120} sx={{ borderRadius: 2 }} />
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

    if (!weatherData || !weatherData.data) {
        return (
            <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Alert severity="info">{tCommon.dataNotAvailable[language]}</Alert>
                </CardContent>
            </Card>
        );
    }

    const cities = selectedCity ? [weatherData.data] : weatherData.data.cities || [];
    const summary = weatherData.data.summary;

    return (
        <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                {/* Header */}
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                            <SunnyIcon />
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

                {/* Summary for multiple cities */}
                {!selectedCity && summary && (
                    <Box mb={3} p={2} sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Gujarat Weather Summary
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body2">
                                    Avg: {summary.avgTemperature}°C
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2">
                                    {summary.generalCondition}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {/* Weather Cards */}
                <Grid container spacing={isMobile ? 1 : 2}>
                    {cities.slice(0, compact ? 3 : 6).map((city, index) => (
                        <Grid item xs={selectedCity ? 12 : (isMobile ? 6 : 4)} key={index}>
                            <Fade in timeout={300 + (index * 100)}>
                                <Card 
                                    variant="outlined" 
                                    sx={{ 
                                        height: compact ? 'auto' : 200,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.secondary.light}15)`,
                                        borderRadius: 2,
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: theme.shadows[4]
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: isMobile ? 1.5 : 2, pb: isMobile ? 1.5 : 2 }}>
                                        {/* City Header */}
                                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    {city.city}
                                                </Typography>
                                            </Box>
                                            {getWeatherIcon(city.description, city.icon)}
                                        </Box>

                                        {/* Temperature */}
                                        <Box textAlign="center" mb={compact ? 1 : 2}>
                                            <Typography 
                                                variant={selectedCity ? "h2" : "h4"} 
                                                fontWeight="bold" 
                                                color="primary.main"
                                            >
                                                {city.temperature}°
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {city.description}
                                            </Typography>
                                        </Box>

                                        {!compact && (
                                            <>
                                                <Divider sx={{ my: 1 }} />
                                                
                                                {/* Weather Details */}
                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <Box display="flex" alignItems="center" gap={0.5}>
                                                            <TempIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                            <Typography variant="caption">
                                                                {city.feelsLike}°C
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Box display="flex" alignItems="center" gap={0.5}>
                                                            <HumidityIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                            <Typography variant="caption">
                                                                {city.humidity}%
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Box display="flex" alignItems="center" gap={0.5}>
                                                            <WindIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                            <Typography variant="caption">
                                                                {city.windSpeed} km/h
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Box display="flex" alignItems="center" gap={0.5}>
                                                            <VisibilityIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                            <Typography variant="caption">
                                                                {city.visibility || 'N/A'} km
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>

                                                {selectedCity && (
                                                    <Box mt={2}>
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={6}>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {t.sunrise[language]}
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    {formatTime(city.sunrise)}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {t.sunset[language]}
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    {formatTime(city.sunset)}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                )}
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

export default WeatherWidget;