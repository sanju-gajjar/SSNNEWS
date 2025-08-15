import React from 'react';
import { Card, CardMedia, Link, Paper } from '@mui/material';
import logo from '../../images/log1.png';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import './AdminLeftPanel.css';
import Para from '../UI/Para';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

let menu = [
    {name:'Dashboard',icon: <SpaceDashboardIcon/>},
    {name:'My Profile',icon: <AccountCircleIcon/>},
    {name:'Setting',icon: <SettingsIcon/>},    
    {name:'Logout',icon:<LogoutIcon/>}
]

function AdminLeftPanel() {
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userLocation');
    window.location.href = '/';
  };
  return (
    <>
        <Paper elevation={4} className='adminWrap'>
            <section className='logoAdmin'>
                      <img src={logo} alt='logo' className='' />
            </section>
            <ul className='menuWrap'>
            {
                menu.map((e,index)=> (
                    <li key={index}>
                      {e.name === 'Logout' ? (
                        <Link onClick={handleLogout}> <span>{e.icon}</span>{e.name}</Link>
                      ) : (
                        <Link> <span>{e.icon}</span>{e.name}</Link>
                      )}
                    </li>
                ))
            }
            </ul>
        </Paper>
    </>
  )
}

export default AdminLeftPanel