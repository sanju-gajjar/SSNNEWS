import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Alert,
    Chip,
    Stack
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import axiosInstance from '../api/axiosInstance';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [newUser, setNewUser] = useState({
        userName: '',
        email: '',
        password: '',
        role: 'user',
        location: ''
    });

    const locations = [
        '', 'AHMADABAD', 'AMRELI', 'ANAND', 'ARAVALLI', 'BANASKANTHA',
        'BHARUCH', 'BHAVNAGAR', 'BOTAD', 'CHHOTA UDEPUR', 'DAHOD',
        'DANGS', 'DEVBHUMI DWARKA', 'GANDHINAGAR', 'GIR SOMNATH',
        'JAMNAGAR', 'JUNAGADH', 'KACHCHH', 'KHEDA', 'MAHESANA',
        'MAHISAGAR', 'MORBI', 'NARMADA', 'NAVSARI', 'PANCHMAHALS',
        'PATAN', 'PORBANDAR', 'RAJKOT', 'SABARKANTHA', 'SURAT',
        'SURENDRANAGAR', 'TAPI', 'VADODARA', 'VALSAD'
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/user/users');
            setUsers(response.data.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            setMessage({ type: 'error', text: 'Failed to fetch users' });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async () => {
        if (!newUser.userName || !newUser.email || !newUser.password) {
            setMessage({ type: 'error', text: 'Please fill all required fields' });
            return;
        }

        try {
            const response = await axiosInstance.post('/user/create-user', newUser);
            setMessage({ type: 'success', text: response.data.message });
            setOpenDialog(false);
            setNewUser({ userName: '', email: '', password: '', role: 'user', location: '' });
            fetchUsers();
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.error || 'Failed to create user' 
            });
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axiosInstance.put(`/user/users/${userId}/role`, { role: newRole });
            setMessage({ type: 'success', text: 'User role updated successfully' });
            fetchUsers();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update user role' });
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'error';
            case 'reporter': return 'warning';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        User Management
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenDialog(true)}
                    >
                        Create User
                    </Button>
                </Box>

                {message.text && (
                    <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage({ type: '', text: '' })}>
                        {message.text}
                    </Alert>
                )}

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Username</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Location</strong></TableCell>
                                <TableCell><strong>Role</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Created</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.location || '-'}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={user.role} 
                                            color={getRoleColor(user.role)} 
                                            size="small" 
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={user.isActive ? 'Active' : 'Inactive'} 
                                            color={user.isActive ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <FormControl size="small" sx={{ minWidth: 120 }}>
                                            <Select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            >
                                                <MenuItem value="user">User</MenuItem>
                                                <MenuItem value="reporter">Reporter</MenuItem>
                                                <MenuItem value="admin">Admin</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Create User Dialog */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <TextField
                                label="Username"
                                fullWidth
                                required
                                value={newUser.userName}
                                onChange={(e) => setNewUser({ ...newUser, userName: e.target.value })}
                            />
                            <TextField
                                label="Email"
                                type="email"
                                fullWidth
                                required
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
                            <TextField
                                label="Password"
                                type="password"
                                fullWidth
                                required
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    label="Role"
                                >
                                    <MenuItem value="user">User</MenuItem>
                                    <MenuItem value="reporter">Reporter</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>Location</InputLabel>
                                <Select
                                    value={newUser.location}
                                    onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
                                    label="Location"
                                >
                                    {locations.map((loc) => (
                                        <MenuItem key={loc} value={loc}>
                                            {loc || 'None'}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button onClick={handleCreateUser} variant="contained">
                            Create User
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Box>
    );
};

export default UserManagement;
