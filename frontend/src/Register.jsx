import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({ 
        username: '', email: '', password: '', role: 'viewer' 
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            alert('REGISTRATION SUCCESSFUL');
            navigate('/'); // Redirect to Login
        } catch (error) {
            alert('ERROR: ' + (error.response?.data?.message || 'Registration Failed'));
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>// NEW_USER_REGISTRY //</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input name="username" placeholder="Codename" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" type="email" placeholder="user@network.com" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input name="password" type="password" placeholder="********" onChange={handleChange} required />
                    </div>
                    
                    {/* ROLE SELECTION */}
                    <div className="form-group">
                        <label>Select Role</label>
                        <select 
                            name="role" 
                            onChange={handleChange} 
                            style={{ width: '100%', padding: '10px', background: '#000', color: '#00f3ff', border: '1px solid #00f3ff' }}
                        >
                            <option value="viewer">Viewer (Read Only)</option>
                            <option value="editor">Editor (Can Upload)</option>
                            <option value="admin">Admin (Full Control)</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-primary">[ REGISTER ID ]</button>
                </form>

                {/* --- BACK BUTTON --- */}
                <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '15px' }}>
                    <button 
                        onClick={() => navigate('/')}
                        className="btn-primary"
                        style={{ background: 'transparent', border: '1px solid #00f3ff', width: '100%' }}
                    >
                        [ BACK TO LOGIN ]
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Register;