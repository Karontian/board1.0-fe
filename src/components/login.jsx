import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newUser, setNewUser] = useState(false);
    const [newUserName, setNewUserName] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const navigate = useNavigate();
    const location = useLocation();

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log('Authenticator: handleSubmit');

        try {
            if (newUser) {
                // Handle sign-up logic
                const req = await axios.post(`http://localhost:3001/newUser`, { newUserName, newPassword });
                if(req){
                    
                    console.log('SignUp successful', req);
                    toast.success('Sign-up successful!');
                    setNewUser(false); // Switch back to login form
                    setNewUserName(''); // Clear username field
                    setNewPassword(''); // Clear password field
                    navigate('/'); // Navigate to login page after sign-up

                }
            } else {
              
                    const req = await axios.put(`http://localhost:3001/login`, { username, password });
                    console.log('Login successful', req);
                            // Check if the user is authenticated
                            if (req.data.user.isAuthenticated) {
                                toast.success('Login successful!');
                                if (username === 'admin') {
                                    console.log('Navigating to: /admin');
                                    navigate('/admin', { state: { username, user: req.data.user } }); // Navigate to the admin page
                                } else {
                                    const from = location.state?.from?.pathname || '/mainBoard';
                                    console.log('Navigating to:', from);
                                    navigate(from, { state: { username, user: req.data.user } }); // Navigate to the main board after login
                                }
                            } else {
                                toast.error('Login failed: User not authenticated');
                            }           
                    }

        } catch (error) {
            toast.error('Login failed: User not authenticated');
            console.error('Error during authentication:', error);
        }
    };

    const onSignUp = (e) => {
        e.preventDefault();
        setNewUser(true);
        console.log('SignUp: onSignUp');
    };

    const onLogin = (e) => {
        e.preventDefault();
        setNewUser(false);
        console.log('Login: onLogin');
    };

    return (
        <>
        <form>
            {!newUser ? (
                <>
                    <div>
                        <h2>Please login:</h2>
                        <label>Username:</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div>
                        <button type='button' onClick={onSubmit}>Login</button>
                        <h3>New to the system?</h3>
                        <button type='button' onClick={onSignUp}>Sign Up!!</button>
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <h2>Please Create a new User:</h2>
                        <label>Username:</label>
                        <input type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div>
                        <button type='button' onClick={onSubmit}>Sign Up</button>
                        <h3>Already have an account?</h3>
                        <button type='button' onClick={onLogin}>Login</button>
                    </div>
                </>
            )}
        </form>
        <ToastContainer />
        </>
    );
};

export default Login;