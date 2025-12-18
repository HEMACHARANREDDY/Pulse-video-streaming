Developer: KARREPU HEMA CHARAN REDDY Project Name: Multi-Tenant Video Streaming & AI Sensitivity Platform

1. System Architecture
The application is built using the MERN stack (MongoDB, Express, React, Node.js) with an event-driven layer for real-time processing.

Frontend Layer: Built with React.js, it handles user interactions, video playback, and maintains a WebSocket connection for live status updates.

Backend Layer: Powered by Node.js and Express, it manages JWT-based security, role-based access control, and the video streaming engine.

Database Layer: MongoDB Atlas stores persistent data including user profiles, hashed credentials, and video metadata.

Real-time Layer: Socket.io facilitates bi-directional communication to push processing results from the server to the client instantly.

2. API Specification
Base URL: http://localhost:5000/api

Authentication
POST /auth/register: Creates a new user account with designated roles (Viewer, Editor, or Admin).

POST /auth/login: Validates credentials and returns a JWT token for session management.

POST /auth/google: Authenticates users via Google OAuth 2.0 integration.

Video Management
POST /videos/upload: Secure endpoint for uploading video files; restricted to Admin and Editor roles.

GET /videos: Retrieves a list of all videos and their current sensitivity status.

GET /videos/stream/:filename: Provides chunked video delivery using HTTP 206 Partial Content.

PUT /videos/like/:id: Toggles a like for a specific video; limited to one like per unique user ID.

DELETE /videos/:id: Permanently removes a video; accessible only by Administrators.

3. Operational Data Flow
Video Streaming Sequence
User Action: The user selects a video in the React frontend, triggering a metadata request.

Server Processing: The backend verifies the file's existence and identifies the requested byte range.

Data Delivery: The server reads the file system and returns a partial content stream (HTTP 206) to the browser.

Sensitivity Analysis Pipeline
Upload: When a video is uploaded, its initial status is set to "processing".

Analysis: A background process simulates an AI scan for 5 seconds to determine content safety.

Broadcast: Upon completion, the server updates the database and emits a 'videoStatusUpdate' event via Socket.io.

UI Update: The frontend receives the event and updates the video's safety badge to "safe" or "flagged" immediately.

4. Security Architecture (RBAC)
The system utilizes Role-Based Access Control to manage permissions and ensure data security.

Viewer: Can watch, search, and like videos.

Editor: Can upload new content and manage processing tasks.

Admin: Possesses full system authority, including content moderation and permanent deletion of videos.

