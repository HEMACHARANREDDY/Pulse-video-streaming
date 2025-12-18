import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Upload() {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Get Username from memory
        const uploader = localStorage.getItem('username') || 'Anonymous';

        // 2. Prepare Data (Files must be sent as FormData, not JSON)
        const formData = new FormData();
        formData.append('title', title);
        formData.append('video', file);
        formData.append('uploader', uploader);

        try {
            // 3. Send to Backend
            await axios.post('http://localhost:5000/api/videos/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('UPLOAD COMPLETE');
            navigate('/home'); // Go back to dashboard
        } catch (error) {
            console.error(error);
            alert('UPLOAD FAILED');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>// UPLOAD_TERMINAL //</h2>
                <p className="subtitle">TRANSMIT DATA TO SERVER</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Video_Title</label>
                        <input 
                            type="text" 
                            placeholder="Enter Title" 
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Select_File (.mp4)</label>
                        <input 
                            type="file" 
                            accept="video/*" 
                            onChange={handleFileChange} 
                            required 
                            style={{ padding: '10px', background: 'transparent', border: 'none' }}
                        />
                    </div>

                    <button type="submit" className="btn-primary">
                        [ INITIATE UPLOAD ]
                    </button>
                    
                    <button type="button" onClick={() => navigate('/home')} style={{
                        marginTop: '10px', background: 'transparent', border: 'none', color: '#00f3ff', cursor: 'pointer'
                    }}>
                        [ CANCEL ]
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Upload;