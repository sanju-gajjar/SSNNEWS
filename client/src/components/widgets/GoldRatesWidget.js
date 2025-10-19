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
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Refresh as RefreshIcon,
    AccountBalance as GoldIcon,
    ShowChart as ChartIcon,
    Circle as StatusIcon
} from '@mui/icons-material';
import axiosInstance from '../../api/axiosInstance';
import translations from '../../i18n/translations.js';

const GoldRatesWidget = ({ language = 'gujarati', compact = false }) => {
    const [goldData, setGoldData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const t = translations.goldRates;
    const tCommon = translations.common;

    const fetchGoldData = async (forceRefresh = false) => {
        try {
            setLoading(true);
            setError(null);

            const endpoint = `/api/external/gold-rates${forceRefresh ? '?refresh=true' : ''}`;
            const response = await axiosInstance.get(endpoint);
            
            if (response.data.success) {
                setGoldData(response.data);
                setLastUpdated(new Date());
            } else {
                throw new Error('Failed to fetch gold rates data');
            }
        } catch (err) {
            console.error('Gold rates fetch error:', err);
            setError(err.response?.data?.error || 'Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoldData();
    }, []);

    const handleRefresh = () => {
        fetchGoldData(true);
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getChangeColor = (change) => {
        if (change > 0) return 'success.main';
        if (change < 0) return 'error.main';
        return 'text.secondary';
    };

    const getChangeIcon = (change) => {
        if (change > 0) return <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />;
        if (change < 0) return <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />;
        return null;
    };

    if (loading) {
        return (
            <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Skeleton variant="text" width="50%" height={32} />
                        <Skeleton variant="circular" width={40} height={40} />
                    </Box>
                    <Grid container spacing={2}>
                        {[1, 2].map(i => (
                            <Grid item xs={6} key={i}>
                                <Skeleton variant="rectangular" height={compact ? 100 : 160} sx={{ borderRadius: 2 }} />
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

    if (!goldData || !goldData.data) {
        return (
            <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Alert severity="info">{tCommon.dataNotAvailable[language]}</Alert>
                </CardContent>
            </Card>
        );
    }

    const metals = goldData.data.metals || [];
    const marketStatus = goldData.data.marketStatus;

    return (
        <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                {/* Header */}
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ bgcolor: 'warning.main', width: 32, height: 32 }}>
                            <GoldIcon />
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

                {/* Market Status */}
                {marketStatus && (
                    <Box display="flex" alignItems="center" gap={1} mb={3}>
                        <StatusIcon 
                            sx={{ 
                                fontSize: 12, 
                                color: marketStatus.status === 'open' ? 'success.main' : 'error.main' 
                            }} 
                        />
                        <Typography variant="body2" color="text.secondary">
                            {marketStatus.status === 'open' 
                                ? t.marketStatus.open[language] 
                                : t.marketStatus.closed[language]
                            }
                        </Typography>
                        {marketStatus.nextOpen && (
                            <Typography variant="caption" color="text.secondary">
                                • Next: {marketStatus.nextOpen}
                            </Typography>
                        )}
                    </Box>
                )}

                {/* Metal Cards */}
                <Grid container spacing={2}>
                    {metals.map((metal, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Fade in timeout={300 + (index * 200)}>
                                <Card 
                                    variant="outlined" 
                                    sx={{ 
                                        background: metal.metal === 'gold' 
                                            ? `linear-gradient(135deg, #FFD700, #FFA500)` 
                                            : `linear-gradient(135deg, #C0C0C0, #A8A8A8)`,
                                        color: 'white',
                                        borderRadius: 2,
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: theme.shadows[6]
                                        }
                                    }}
                                >
                                    <CardContent>
                                        {/* Metal Header */}
                                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                            <Typography 
                                                variant="h6" 
                                                fontWeight="bold"
                                                sx={{ 
                                                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                                                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                                                }}
                                            >
                                                {metal.metalGujarati}
                                            </Typography>
                                            <ChartIcon sx={{ opacity: 0.7 }} />
                                        </Box>

                                        {/* Current Price */}
                                        <Box mb={2}>
                                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                                {t.currentRate[language]} ({t.units.perGram[language]})
                                            </Typography>
                                            <Typography 
                                                variant="h5" 
                                                fontWeight="bold"
                                                sx={{ 
                                                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                                                    mb: 1
                                                }}
                                            >
                                                {metal.weightRates ? formatCurrency(metal.weightRates['1_gm']) : 'N/A'}
                                            </Typography>
                                            
                                            {/* Change */}
                                            {metal.rates && (
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    {getChangeIcon(metal.rates.change)}
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            color: metal.rates.change > 0 ? '#4caf50' : 
                                                                   metal.rates.change < 0 ? '#f44336' : 'inherit',
                                                            fontWeight: 'bold',
                                                            textShadow: '1px 1px 1px rgba(0,0,0,0.3)'
                                                        }}
                                                    >
                                                        {metal.rates.change > 0 ? '+' : ''}{metal.rates.change} 
                                                        ({metal.rates.changePercent > 0 ? '+' : ''}{metal.rates.changePercent}%)
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        {!compact && metal.weightRates && (
                                            <>
                                                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', my: 1 }} />
                                                
                                                {/* Different Weight Rates */}
                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                                            {t.units.per10Gram[language]}
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {formatCurrency(metal.weightRates['10_gm'])}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                                            {t.units.perTola[language]}
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {formatCurrency(metal.weightRates['1_tola'])}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>

                                                {/* High/Low */}
                                                {metal.rates && (
                                                    <Box mt={1}>
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={6}>
                                                                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                                                    {t.high[language]}
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    ₹{metal.rates.high}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                                                    {t.low[language]}
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    ₹{metal.rates.low}
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

                {/* Disclaimer */}
                {goldData.data.disclaimer && (
                    <Box mt={2} p={2} sx={{ bgcolor: 'grey.100', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            {goldData.data.disclaimer}
                        </Typography>
                    </Box>
                )}

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

export default GoldRatesWidget;