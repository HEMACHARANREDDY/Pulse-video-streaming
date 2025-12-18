import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; 

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // NORMAL LOGIN
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', res.data.user.username);
            localStorage.setItem('role', res.data.user.role);

            navigate('/home'); 
        } catch (error) {
            alert('LOGIN FAILED: ' + (error.response?.data?.message || 'Server Error'));
        }
    };

    // --- GOOGLE LOGIN SUCCESS ---
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            console.log("Google Credential:", credentialResponse);
            // Send the Google Token to your Backend
            const res = await axios.post('http://localhost:5000/api/auth/google', {
                token: credentialResponse.credential
            });

            // Save Data & Redirect
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', res.data.user.username);
            localStorage.setItem('role', res.data.user.role);
            
            alert('GOOGLE LOGIN SUCCESSFUL');
            navigate('/home');
        } catch (error) {
            console.error(error);
            alert('GOOGLE LOGIN FAILED: ' + (error.response?.data?.message || 'Server Error'));
        }
    };

    // --- MOCK FORGOT PASSWORD ---
    const handleForgotPassword = () => {
        const email = prompt("Please enter your email address to reset password:");
        if (email) {
            alert(`[SYSTEM]: Password reset link has been sent to ${email}`);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>// SYSTEM_LOGIN //</h2>
                
                {/* --- GOOGLE BUTTON --- */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => {
                            console.log('Login Failed');
                            alert('Google Login Failed');
                        }}
                        theme="filled_black"
                        shape="pill"
                    />
                </div>
                
                <p style={{textAlign: 'center', margin: '10px 0', opacity: 0.5}}>-- OR --</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" type="email" placeholder="user@network.com" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input name="password" type="password" placeholder="********" onChange={handleChange} required />
                    </div>
                    
                    <button type="submit" className="btn-primary">[ ACCESS SYSTEM ]</button>
                </form>

                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button 
                        onClick={handleForgotPassword}
                        style={{ background: 'transparent', border: 'none', color: '#00f3ff', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
                    >
                        [ FORGOT PASSWORD? ]
                    </button>

                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>OR</p>

                    <button 
                        onClick={() => navigate('/register')}
                        className="btn-primary"
                        style={{ background: 'transparent', border: '1px solid #00f3ff' }}
                    >
                        [ CREATE NEW ACCOUNT ]
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Login;