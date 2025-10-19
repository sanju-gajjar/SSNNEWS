import React from 'react';
import { 
    BottomNavigation, 
    BottomNavigationAction, 
    Paper, 
    Fab,
    Box
} from '@mui/material';
import { 
    Home as HomeIcon, 
    ArrowBack as ArrowBackIcon, 
    ArrowForward as ArrowForwardIcon,
    KeyboardArrowUp as ScrollTopIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

// Animations
const bounceIn = keyframes`
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderRadius: '20px 20px 0 0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 -10px 30px rgba(0,0,0,0.3)',
    animation: `${slideUp} 0.3s ease-out`,
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 40,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 2,
    }
}));

const StyledBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
    backgroundColor: 'transparent',
    padding: '8px 0 20px 0',
    '& .MuiBottomNavigationAction-root': {
        color: 'rgba(255,255,255,0.7)',
        '&.Mui-selected': {
            color: '#ffffff',
            '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                fontWeight: 600,
            }
        },
        '&:hover': {
            color: '#ffffff',
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out',
        },
        '& .MuiSvgIcon-root': {
            fontSize: '1.5rem',
            transition: 'all 0.2s ease-in-out',
        },
        '&.Mui-selected .MuiSvgIcon-root': {
            animation: `${pulse} 0.3s ease-in-out`,
        }
    }
}));

const ScrollToTopFab = styled(Fab)(({ theme }) => ({
    position: 'fixed',
    bottom: 90,
    right: 20,
    background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
    color: 'white',
    zIndex: 999,
    animation: `${bounceIn} 0.5s ease-out`,
    boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)',
    '&:hover': {
        background: 'linear-gradient(45deg, #FF8E53, #FF6B6B)',
        transform: 'scale(1.1)',
        boxShadow: '0 12px 35px rgba(255, 107, 107, 0.6)',
    },
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

const ModernBottomNav = ({ 
    onPrevious, 
    onNext, 
    onHome, 
    showScrollTop = true,
    currentPage = 'details',
    hasPrevious = true,
    hasNext = true 
}) => {
    const [value, setValue] = React.useState(1); // Home is center (index 1)
    const [showScroll, setShowScroll] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setShowScroll(window.pageYOffset > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleNavigation = (event, newValue) => {
        setValue(newValue);
        
        switch (newValue) {
            case 0:
                if (hasPrevious) onPrevious();
                break;
            case 1:
                onHome();
                break;
            case 2:
                if (hasNext) onNext();
                break;
            default:
                break;
        }
    };

    return (
        <>
            <StyledPaper elevation={10}>
                <StyledBottomNavigation
                    value={value}
                    onChange={handleNavigation}
                    showLabels
                >
                    <BottomNavigationAction
                        label="Previous"
                        icon={<ArrowBackIcon />}
                        disabled={!hasPrevious}
                        sx={{ 
                            opacity: hasPrevious ? 1 : 0.3,
                            minWidth: 'auto',
                            flex: 0.8
                        }}
                    />
                    <BottomNavigationAction
                        label="Home"
                        icon={<HomeIcon />}
                        sx={{ 
                            flex: 1.4,
                            '& .MuiSvgIcon-root': {
                                fontSize: '1.8rem !important',
                            }
                        }}
                    />
                    <BottomNavigationAction
                        label="Next"
                        icon={<ArrowForwardIcon />}
                        disabled={!hasNext}
                        sx={{ 
                            opacity: hasNext ? 1 : 0.3,
                            minWidth: 'auto',
                            flex: 0.8
                        }}
                    />
                </StyledBottomNavigation>
            </StyledPaper>

            {showScrollTop && showScroll && (
                <ScrollToTopFab
                    size="medium"
                    onClick={scrollToTop}
                    aria-label="scroll to top"
                >
                    <ScrollTopIcon />
                </ScrollToTopFab>
            )}

            {/* Bottom padding to prevent content overlap */}
            <Box sx={{ height: 90 }} />
        </>
    );
};

export default ModernBottomNav;