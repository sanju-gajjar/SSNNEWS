import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Divider,
    Chip,
    CardActionArea,
    LinearProgress,
    Avatar,
    IconButton,
    Tooltip,
    Fade,
    Grow
} from '@mui/material';
import {
    Article as ArticleIcon,
    TrendingUp as TrendingUpIcon,
    Category as CategoryIcon,
    People as PeopleIcon,
    Star as StarIcon,
    Add as AddIcon,
    Edit as EditIcon,
    ManageAccounts as ManageAccountsIcon,
    CalendarToday as CalendarIcon,
    ThumbUp as ThumbUpIcon,
    Visibility as VisibilityIcon,
    Comment as CommentIcon,
    Today as TodayIcon,
    Timeline as TimelineIcon,
    TrendingFlat as TrendingFlatIcon,
    Assessment as AssessmentIcon,
    Newspaper as NewspaperIcon,
    BarChart as BarChartIcon,
    PieChart as PieChartIcon,
    ShowChart as ShowChartIcon,
    AccessTime as AccessTimeIcon,
    Whatshot as WhatshotIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { categoryMap } from '../i18n/gujaratiTranslations';

const StatCard = ({ title, value, icon, color = 'primary', subtitle, trend, progress }) => (
    <Grow in={true} timeout={500}>
        <Card
            elevation={0}
            sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${color === 'primary' ? '#667eea' : color === 'success' ? '#4facfe' : color === 'error' ? '#f093fb' : color === 'info' ? '#4facfe' : color === 'warning' ? '#43e97b' : '#667eea'} 0%, ${color === 'primary' ? '#764ba2' : color === 'success' ? '#00f2fe' : color === 'error' ? '#f5576c' : color === 'info' ? '#00f2fe' : color === 'warning' ? '#38f9d7' : '#764ba2'} 100%)`,
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: `0 20px 40px -12px rgba(0,0,0,0.25)`,
                    '& .stat-icon': {
                        transform: 'scale(1.1) rotate(5deg)'
                    }
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'rgba(255,255,255,0.3)'
                }
            }}
        >
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box
                        className="stat-icon"
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            borderRadius: 3,
                            p: 1.5,
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {React.cloneElement(icon, {
                            sx: { fontSize: 28, color: 'white' }
                        })}
                    </Box>
                    {trend && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TrendingFlatIcon
                                sx={{
                                    fontSize: 16,
                                    color: trend > 0 ? '#4ade80' : '#f87171',
                                    transform: trend > 0 ? 'rotate(0deg)' : 'rotate(180deg)'
                                }}
                            />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                                {Math.abs(trend)}%
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255,255,255,0.8)',
                            mb: 1,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            color: 'white',
                            mb: subtitle ? 0.5 : 0,
                            lineHeight: 1.2,
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        {typeof value === 'number' && value > 999 ? value.toLocaleString() : value}
                    </Typography>
                    {subtitle && (
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.75rem', fontWeight: 500 }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                {progress !== undefined && (
                    <Box sx={{ mt: 2 }}>
                        <LinearProgress
                            variant="determinate"
                            value={Math.min(progress, 100)}
                            sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: 'rgba(255,255,255,0.2)',
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: 'rgba(255,255,255,0.9)',
                                    borderRadius: 3
                                }
                            }}
                        />
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', mt: 0.5, display: 'block' }}>
                            {progress}% of target
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    </Grow>
);

const ActionCard = ({ title, description, icon, color = 'primary', onClick, badge }) => (
    <Fade in={true} timeout={600}>
        <Card
            elevation={0}
            sx={{
                height: '100%',
                background: 'white',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15)',
                    borderColor: `${color}.main`,
                    '& .action-icon': {
                        transform: 'scale(1.1)',
                        bgcolor: `${color}.main`
                    }
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    bgcolor: `${color}.main`,
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                },
                '&:hover::before': {
                    opacity: 1
                }
            }}
        >
            <CardActionArea onClick={onClick} sx={{ height: '100%', p: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Box
                            className="action-icon"
                            sx={{
                                bgcolor: `${color}.light`,
                                color: `${color}.main`,
                                p: 1.5,
                                borderRadius: 2.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {React.cloneElement(icon, { sx: { fontSize: 24 } })}
                        </Box>
                        {badge && (
                            <Chip
                                label={badge}
                                size="small"
                                color={color}
                                sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                            />
                        )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                            {description}
                        </Typography>
                    </Box>
                </Box>
            </CardActionArea>
        </Card>
    </Fade>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/admin/stats');
            setStats(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setError('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#fafbfc', minHeight: '100vh' }}>
            {/* Hero Header Section */}
            <Box sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                py: 6,
                mb: 4,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    opacity: 0.1
                }
            }}>
                <Box sx={{ maxWidth: 1400, mx: 'auto', px: 4, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography
                            variant="h1"
                            sx={{
                                fontWeight: 900,
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                mb: 2,
                                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                                letterSpacing: -1
                            }}
                        >
                            News Platform Dashboard
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 400,
                                opacity: 0.9,
                                maxWidth: 600,
                                mx: 'auto',
                                mb: 3
                            }}
                        >
                            Monitor your content performance and audience engagement
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Chip
                                label={`Last updated: ${new Date().toLocaleTimeString()}`}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    fontWeight: 600,
                                    backdropFilter: 'blur(10px)'
                                }}
                            />
                            <Chip
                                icon={<AccessTimeIcon />}
                                label="Live Data"
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    fontWeight: 600,
                                    backdropFilter: 'blur(10px)'
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Key Metrics Row */}
                    <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{
                                textAlign: 'center',
                                p: 3,
                                bgcolor: 'rgba(255,255,255,0.1)',
                                borderRadius: 3,
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}>
                                <NewspaperIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                                <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
                                    {stats?.totalNews || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Total Articles
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{
                                textAlign: 'center',
                                p: 3,
                                bgcolor: 'rgba(255,255,255,0.1)',
                                borderRadius: 3,
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}>
                                <VisibilityIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                                <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
                                    {stats?.totalViews?.toLocaleString() || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Total Views
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{
                                textAlign: 'center',
                                p: 3,
                                bgcolor: 'rgba(255,255,255,0.1)',
                                borderRadius: 3,
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}>
                                <ThumbUpIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                                <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
                                    {stats?.totalLikes || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Total Engagement
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{
                                textAlign: 'center',
                                p: 3,
                                bgcolor: 'rgba(255,255,255,0.1)',
                                borderRadius: 3,
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}>
                                <PeopleIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                                <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
                                    {stats?.totalUsers || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Registered Users
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            <Box sx={{ maxWidth: 1400, mx: 'auto', px: 4 }}>
                {/* Performance Metrics */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, color: 'text.primary' }}>
                        Performance Overview
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Today's Articles"
                                value={stats?.todayNews || 0}
                                subtitle={`${stats?.recentNews || 0} this week`}
                                icon={<TodayIcon />}
                                color="success"
                                trend={15}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Today's Engagement"
                                value={stats?.todayLikes || 0}
                                subtitle="New likes today"
                                icon={<ThumbUpIcon />}
                                color="error"
                                trend={8}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Active Users"
                                value={stats?.activeUsers || 0}
                                subtitle="Last 7 days"
                                icon={<PeopleIcon />}
                                color="info"
                                trend={-3}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Top Stories"
                                value={stats?.top10Count || 0}
                                subtitle="Featured articles"
                                icon={<StarIcon />}
                                color="warning"
                                progress={75}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Content Management & Analytics */}
                <Grid container spacing={4} sx={{ mb: 6 }}>
                    {/* Quick Actions */}
                    <Grid item xs={12} lg={4}>
                        <Paper elevation={0} sx={{
                            p: 4,
                            borderRadius: 4,
                            bgcolor: 'white',
                            border: '1px solid',
                            borderColor: 'divider',
                            height: '100%'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <AssessmentIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    Content Management
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <ActionCard
                                    title="Create New Article"
                                    description="Write and publish fresh content"
                                    icon={<AddIcon />}
                                    color="primary"
                                    onClick={() => navigate('/admin/post')}
                                    badge="New"
                                />
                                <ActionCard
                                    title="Manage Articles"
                                    description="Edit, delete, and organize content"
                                    icon={<EditIcon />}
                                    color="warning"
                                    onClick={() => navigate('/admin/manage-news')}
                                />
                                <ActionCard
                                    title="User Administration"
                                    description="Manage user roles and permissions"
                                    icon={<ManageAccountsIcon />}
                                    color="success"
                                    onClick={() => navigate('/user-management')}
                                />
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Category Performance */}
                    <Grid item xs={12} lg={8}>
                        <Paper elevation={0} sx={{
                            p: 4,
                            borderRadius: 4,
                            bgcolor: 'white',
                            border: '1px solid',
                            borderColor: 'divider',
                            height: '100%'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <PieChartIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                        Category Performance
                                    </Typography>
                                </Box>
                                <Chip
                                    label={`${stats?.categoryStats?.length || 0} Categories`}
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                />
                            </Box>
                            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                                {stats?.categoryStats && stats.categoryStats.length > 0 ? (
                                    stats.categoryStats.slice(0, 8).map((cat, index) => {
                                        const maxCount = Math.max(...stats.categoryStats.map(c => c.count));
                                        const percentage = (cat.count / maxCount) * 100;

                                        return (
                                            <Box key={index} sx={{ mb: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Typography sx={{
                                                        fontFamily: 'Noto Sans Gujarati, sans-serif',
                                                        fontWeight: 600,
                                                        fontSize: '0.9rem'
                                                    }}>
                                                        {categoryMap[cat._id] || cat._id}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                                        {cat.count}
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={percentage}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 4,
                                                        bgcolor: 'grey.200',
                                                        '& .MuiLinearProgress-bar': {
                                                            bgcolor: 'primary.main',
                                                            borderRadius: 4
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        );
                                    })
                                ) : (
                                    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                                        No category data available
                                    </Typography>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* User Analytics & Activity */}
                <Grid container spacing={4} sx={{ mb: 6 }}>
                    {/* User Demographics */}
                    <Grid item xs={12} lg={6}>
                        <Paper elevation={0} sx={{
                            p: 4,
                            borderRadius: 4,
                            bgcolor: 'white',
                            border: '1px solid',
                            borderColor: 'divider'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <BarChartIcon sx={{ mr: 2, color: 'success.main', fontSize: 28 }} />
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    User Demographics
                                </Typography>
                            </Box>
                            <Box>
                                {stats?.usersByRole && stats.usersByRole.length > 0 ? (
                                    stats.usersByRole.map((role, index) => {
                                        const roleColors = {
                                            admin: 'error',
                                            reporter: 'warning',
                                            moderator: 'info',
                                            user: 'success'
                                        };
                                        const roleColor = roleColors[role._id] || 'default';
                                        const totalUsers = stats.totalUsers || 1;
                                        const percentage = (role.count / totalUsers) * 100;

                                        return (
                                            <Box key={index} sx={{ mb: 3 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Avatar sx={{ width: 24, height: 24, bgcolor: `${roleColor}.main`, fontSize: '0.75rem' }}>
                                                            {(role._id || 'U').charAt(0).toUpperCase()}
                                                        </Avatar>
                                                        <Typography sx={{
                                                            textTransform: 'capitalize',
                                                            fontWeight: 600,
                                                            fontSize: '0.9rem'
                                                        }}>
                                                            {role._id || 'Unknown'}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {role.count} ({percentage.toFixed(1)}%)
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={percentage}
                                                    sx={{
                                                        height: 6,
                                                        borderRadius: 3,
                                                        bgcolor: 'grey.200',
                                                        '& .MuiLinearProgress-bar': {
                                                            bgcolor: `${roleColor}.main`,
                                                            borderRadius: 3
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        );
                                    })
                                ) : (
                                    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                                        No user data available
                                    </Typography>
                                )}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Publishing Activity */}
                    <Grid item xs={12} lg={6}>
                        <Paper elevation={0} sx={{
                            p: 4,
                            borderRadius: 4,
                            bgcolor: 'white',
                            border: '1px solid',
                            borderColor: 'divider'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <ShowChartIcon sx={{ mr: 2, color: 'info.main', fontSize: 28 }} />
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    Publishing Activity
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Daily article publication over the last 7 days
                            </Typography>
                            <Box>
                                {stats?.newsByDate && stats.newsByDate.length > 0 ? (
                                    stats.newsByDate.slice(0, 7).map((day, index) => {
                                        const maxCount = Math.max(...stats.newsByDate.map(d => d.count));
                                        const percentage = maxCount > 0 ? (day.count / maxCount) * 100 : 0;

                                        return (
                                            <Box key={index} sx={{ mb: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Typography sx={{
                                                        fontSize: '0.85rem',
                                                        fontWeight: 500,
                                                        color: 'text.secondary',
                                                        minWidth: 80
                                                    }}>
                                                        {new Date(day._id).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </Typography>
                                                    <Chip
                                                        label={day.count}
                                                        size="small"
                                                        color="primary"
                                                        sx={{ fontWeight: 700, height: 24 }}
                                                    />
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={percentage}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 4,
                                                        bgcolor: 'grey.200',
                                                        '& .MuiLinearProgress-bar': {
                                                            bgcolor: 'info.main',
                                                            borderRadius: 4
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        );
                                    })
                                ) : (
                                    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                                        No activity data available
                                    </Typography>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Trending & Featured Content */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, color: 'text.primary' }}>
                        Trending Content
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} lg={6}>
                            <Paper elevation={0} sx={{
                                p: 4,
                                borderRadius: 4,
                                bgcolor: 'white',
                                border: '1px solid',
                                borderColor: 'divider'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <WhatshotIcon sx={{ mr: 2, color: 'error.main', fontSize: 28 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                        Top Performing Articles
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Articles with highest engagement this week
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {stats?.trendingNews && stats.trendingNews.length > 0 ? (
                                        stats.trendingNews.slice(0, 5).map((article, index) => (
                                            <Box key={index} sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: 'grey.50',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    bgcolor: 'primary.light',
                                                    borderColor: 'primary.main',
                                                    transform: 'translateX(4px)'
                                                }
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{
                                                        bgcolor: 'primary.main',
                                                        width: 32,
                                                        height: 32,
                                                        fontSize: '0.875rem',
                                                        fontWeight: 700
                                                    }}>
                                                        {index + 1}
                                                    </Avatar>
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography sx={{
                                                            fontWeight: 600,
                                                            fontSize: '0.875rem',
                                                            mb: 0.5,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical'
                                                        }}>
                                                            {article.title}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {article.views || 0} views
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {article.likes || 0} likes
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                                            No trending articles available
                                        </Typography>
                                    )}
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} lg={6}>
                            <Paper elevation={0} sx={{
                                p: 4,
                                borderRadius: 4,
                                bgcolor: 'white',
                                border: '1px solid',
                                borderColor: 'divider'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <TimelineIcon sx={{ mr: 2, color: 'warning.main', fontSize: 28 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                        Content Pipeline
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Overview of your content workflow
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                                            <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.dark' }}>
                                                {stats?.todayNews || 0}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'success.dark', fontWeight: 600 }}>
                                                Published Today
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                                            <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.dark' }}>
                                                {stats?.top10Count || 0}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'warning.dark', fontWeight: 600 }}>
                                                Featured
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                                            <Typography variant="h4" sx={{ fontWeight: 800, color: 'info.dark' }}>
                                                {stats?.categoryStats?.length || 0}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'info.dark', fontWeight: 600 }}>
                                                Categories
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light', borderRadius: 2 }}>
                                            <Typography variant="h4" sx={{ fontWeight: 800, color: 'error.dark' }}>
                                                {stats?.totalComments || 0}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'error.dark', fontWeight: 600 }}>
                                                Comments
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
