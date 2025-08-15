import React from 'react'
import PropTypes from 'prop-types'
import { Badge, Grid, Icon, Paper } from '@mui/material'
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Para from '../UI/Para';
import {useTheme} from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import './AdminHeaderPanel.css'

function AdminHeaderPanel(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const theme = useTheme();
    const handleLogout = () => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userName');
      localStorage.removeItem('userLocation');
      window.location.href = '/';
    };
  return (
    <>
        <Paper elevation={3} sx={{ mt: 2, textAlign: 'right', p: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', justifyContent:'end' }}>
        <Badge badgeContent={4} color="secondary">
  <NotificationsIcon color="action" />
</Badge>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width:30, height:30,backgroundColor:`${theme.palette.primary.main}`,mx:1, fontSize:'15px' }}>L</Avatar>
            <Para variant='subtitle1'>Lynda Dsaag</Para>

          </IconButton>
        </Tooltip>
      </Box>
      {/* <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem>
       
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={() => { handleLogout(); handleClose(); }}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
        </Menu> */}

        </Paper>
    </>
  )
}

AdminHeaderPanel.propTypes = {}

export default AdminHeaderPanel
