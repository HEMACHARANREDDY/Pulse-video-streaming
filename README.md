1. Project Overview
Project Title: Secure Multi-Tenant Video Streaming & AI Analysis Platform

Lead Developer: KARREPU HEMA CHARAN REDDY

Core Technology Stack: MongoDB, Express.js, React, Node.js (MERN)

Real-time Layer: Socket.io for live processing notifications

Security: Role-Based Access Control (RBAC) and JWT Authentication

2. Technical Architecture
The system follows a decoupled architecture where the React frontend communicates with the Node.js backend via RESTful APIs and persistent WebSocket connections.

Frontend (React): Handles the UI/UX, video playback using HTTP Range Requests, and real-time state updates via Socket.io-client.

Backend (Node.js/Express): Manages business logic, file uploads via Multer, and the streaming engine.

Database (MongoDB): Stores persistent user data, roles, and video metadata.

Real-time Communication: Uses Socket.io to push "Sensitivity Status" updates from the server to the client without page refreshes.

3. API Specification
Base URL: http://localhost:5000/api

Authentication
POST /auth/register: Creates a new user with roles: viewer, editor, or admin.

POST /auth/login: Validates credentials and returns a JWT token for secure sessions.

POST /auth/google: Implements Google OAuth 2.0 using the verified Client ID.

Video Management
POST /videos/upload: Restricted to Admin/Editor roles; initiates the processing pipeline.

GET /videos/stream/:filename: Streams video using HTTP 206 Partial Content for efficient buffering.

PUT /videos/like/:id: Toggles a like; logic ensures only one like per unique User ID.

DELETE /videos/:id: Restricted to Admin role; permanently removes content and files.

4. Operational Data Flow
Video Processing Pipeline
Ingestion: An authorized user uploads a video file.

Simulation: The backend triggers a 5-second simulated AI analysis to check for sensitivity.

Broadcast: Upon completion, the server emits a videoStatusUpdate event.

Reaction: The frontend receives the event and updates the video's safety badge to "safe" or "flagged" immediately.

Streaming Mechanism
The server detects the Range header in the browser request.

It reads only the requested byte chunk from the local file system.

It returns an HTTP 206 Partial Content response, allowing the user to skip to different parts of the video instantly.

5. Security Architecture (RBAC)
The application implements strict Role-Based Access Control to maintain data security:

Viewer: Can watch, search, and like videos.

Editor: Authorized to upload and manage the processing of new content.

Admin: Full privileges, including the moderation and deletion of any video on the platform.
