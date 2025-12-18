import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

function Home() {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // GET USER ROLE
  const userRole = localStorage.getItem('role') || 'viewer'; 

  // --- 1. FETCH VIDEOS & POLLING ---
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/videos');
        setVideos(res.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };
    fetchVideos();

    // Fallback Polling
    const interval = setInterval(fetchVideos, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- 2. REAL-TIME SOCKET LISTENER ---
  useEffect(() => {
    const socket = io('http://localhost:5000', {
        transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
        console.log("✅ Frontend Connected to Socket");
    });

    socket.on('videoStatusUpdate', (updatedVideo) => {
      console.log('⚡ Received Live Update:', updatedVideo);
      setVideos(prevVideos => 
        prevVideos.map(vid => vid._id === updatedVideo._id ? updatedVideo : vid)
      );
    });

    return () => socket.disconnect();
  }, []);

  // --- 3. DELETE FUNCTION (Admin Only) ---
  const handleDelete = async (id) => {
    if (userRole !== 'admin') {
      alert('ACCESS DENIED: Admins only.');
      return;
    }

    if (window.confirm('WARNING: DELETE DATA? This cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/api/videos/${id}`);
        setVideos(videos.filter(video => video._id !== id));
      } catch (err) {
        alert('DELETE FAILED: ' + (err.response?.data?.message || 'Server Error'));
      }
    }
  };

  // --- 4. LIKE FUNCTION (Fixed for Array Count) ---
  const handleLike = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Please Login to Like videos!");
        return;
    }

    try {
      const config = {
        headers: {
            'x-auth-token': token
        }
      };
      
      const res = await axios.put(`http://localhost:5000/api/videos/like/${id}`, {}, config);
      
      // Update state with new likes array
      setVideos(videos.map(video => (video._id === id ? { ...video, likes: res.data } : video)));
    } catch (err) {
      console.error(err);
    }
  };

  // --- 5. FILTER LOGIC ---
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '20px', background: '#050505', color: '#fff' }}>
      
      {/* --- NAVBAR --- */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid #00f3ff', paddingBottom: '15px', marginBottom: '30px',
        flexWrap: 'wrap', gap: '15px' 
      }}>
        <h2 style={{ margin: 0, fontFamily: 'monospace', color: '#00f3ff' }}>
          // VIDEO_FEED [{userRole.toUpperCase()}] //
        </h2>
        
        {/* SEARCH BAR */}
        <input 
          type="text" 
          placeholder="[ SEARCH_DATABASE... ]" 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px', width: '300px', background: '#000', border: '1px solid #00f3ff',
            color: '#00f3ff', fontFamily: 'monospace', outline: 'none'
          }}
        />

        <div>
            {/* ROLE CHECK: Hide Upload button if user is a Viewer */}
            {userRole !== 'viewer' && (
                <button className="btn-primary" style={{ width: 'auto', padding: '8px 20px', marginRight: '10px' }} 
                  onClick={() => navigate('/upload')}>
                  [ UPLOAD ]
                </button>
            )}

            <button className="btn-primary" style={{ width: 'auto', padding: '8px 20px', background: 'transparent', border: '1px solid #00f3ff' }} 
              onClick={() => {
                localStorage.clear();
                navigate('/');
              }}>
              [ LOGOUT ]
            </button>
        </div>
      </nav>

      {/* --- VIDEO GRID --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
        
        {filteredVideos.length === 0 ? (
          <div style={{ width: '100%', textAlign: 'center', gridColumn: '1 / -1', marginTop: '50px' }}>
            <p style={{ color: '#00f3ff', opacity: 0.7, fontSize: '1.2rem', fontFamily: 'monospace' }}>
              [ SYSTEM STATUS: NO MATCHING DATA ]
            </p>
          </div>
        ) : (
          filteredVideos.map((video) => (
            <div key={video._id} className="auth-card" style={{ padding: '0', overflow: 'hidden', clipPath: 'none', textAlign: 'left', position: 'relative' }}>
              
              {/* STATUS BADGE */}
              <div style={{
                  position: 'absolute', top: '10px', left: '10px', zIndex: 10,
                  padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
                  backgroundColor: video.sensitivityStatus === 'safe' ? '#00ff88' : 
                                  video.sensitivityStatus === 'flagged' ? '#ff0055' : '#ffcc00',
                  color: '#000',
                  fontFamily: 'monospace'
              }}>
                [{video.sensitivityStatus ? video.sensitivityStatus.toUpperCase() : 'PROCESSING'}]
              </div>

              {/* DELETE BUTTON (Admin Only) */}
              {userRole === 'admin' && (
                  <button 
                    onClick={() => handleDelete(video._id)}
                    style={{
                      position: 'absolute', top: '10px', right: '10px', zIndex: 10,
                      background: 'rgba(0,0,0,0.8)', color: '#ff0055', border: '1px solid #ff0055',
                      cursor: 'pointer', padding: '5px 10px', fontSize: '0.8rem', fontWeight: 'bold',
                      borderRadius: '4px'
                    }}
                  >
                    [ X ]
                  </button>
              )}

              {/* VIDEO PLAYER */}
              {video.sensitivityStatus === 'flagged' ? (
                  <div style={{ height: '200px', background: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #ff0055', color: '#ff0055', gap: '10px' }}>
                      <span style={{ fontSize: '2rem' }}>⚠️</span>
                      <span style={{ fontFamily: 'monospace' }}>[ CONTENT REMOVED ]</span>
                      <span style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>VIOLATION DETECTED</span>
                  </div>
              ) : (
                  <video 
                    width="100%" 
                    height="200" 
                    controls 
                    style={{ backgroundColor: '#000', borderBottom: '1px solid #00f3ff' }}
                  >
                    <source src={`http://localhost:5000/api/videos/stream/${video.videoUrl}`} type="video/mp4" />
                  </video>
              )}

              {/* INFO SECTION */}
              <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '5px', fontFamily: 'sans-serif' }}>
                    {video.title}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#00f3ff', opacity: 0.8, fontFamily: 'monospace' }}>
                    // UPLOADED_BY: {video.uploader}
                  </p>
                </div>
                
                {/* LIKE BUTTON (Count Fix Included) */}
                <button 
                  onClick={() => handleLike(video._id)}
                  style={{
                    background: 'rgba(0, 243, 255, 0.1)', border: '1px solid #00f3ff', color: '#00f3ff',
                    padding: '8px 12px', borderRadius: '5px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', fontWeight: 'bold'
                  }}
                >
                  ❤️ {video.likes ? video.likes.length : 0}
                </button>
              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default Home;