// Debug script to test admin login
const axios = require('axios');

const API_URL = 'https://ssnnewsserver.onrender.com';

async function testAdminLogin() {
    try {
        console.log('Testing admin login...');
        
        const response = await axios.post(`${API_URL}/login`, {
            email: 'sanjug@yopmail.com',
            password: 'your_password_here' // Replace with actual password
        });
        
        console.log('Login Response:');
        console.log('- Message:', response.data.message);
        console.log('- User Name:', response.data.userName);
        console.log('- User Location:', response.data.userLocation);
        console.log('- User Role:', response.data.userRole);
        console.log('- Token Present:', !!response.data.token);
        
        if (response.data.userRole === 'admin') {
            console.log('✅ Admin role detected correctly!');
        } else {
            console.log('❌ Admin role not detected. Current role:', response.data.userRole);
        }
        
    } catch (error) {
        console.error('Login Error:');
        console.error('- Status:', error.response?.status);
        console.error('- Message:', error.response?.data?.message);
        console.error('- Full Error:', error.message);
    }
}

testAdminLogin();