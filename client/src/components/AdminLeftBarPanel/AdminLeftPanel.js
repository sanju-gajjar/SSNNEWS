import React from 'react';
import { Card, CardMedia, Link, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import './AdminLeftPanel.css';
import Para from '../UI/Para';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';

let menu = [
    {name:'Dashboard',icon: <SpaceDashboardIcon/>, path:'/admin'},
    {name:'User Management',icon: <PeopleIcon/>, path:'/admin/users'},
    {name:'My Profile',icon: <AccountCircleIcon/>},
    {name:'Setting',icon: <SettingsIcon/>},    
    {name:'Logout',icon:<LogoutIcon/>}
]

function AdminLeftPanel() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userLocation');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    window.location.href = '/';
  };
  
  return (
    <>
        <Paper elevation={4} className='adminWrap'>
            <section className='logoAdmin'>
                      <img 
                        src='/logo152.png' 
                        alt='logo' 
                        style={{
                          width: '100%',
                          maxWidth: '100px',
                          height: 'auto',
                          objectFit: 'contain'
                        }}
                      />
            </section>
            <ul className='menuWrap'>
            {
                menu.map((e,index)=> (
                    <li key={index}>
                      {e.name === 'Logout' ? (
                        <Link onClick={handleLogout}> <span>{e.icon}</span>{e.name}</Link>
                      ) : e.path ? (
                        <Link onClick={() => navigate(e.path)} style={{cursor: 'pointer'}}> <span>{e.icon}</span>{e.name}</Link>
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