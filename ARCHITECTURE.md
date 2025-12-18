Project Architecture and System Design
Developer: KARREPU HEMA CHARAN REDDY Project Name: Secure Multi-Tenant Video Streaming & AI Analysis Platform

1. System Architecture Overview
The application follows a full-stack MERN architecture with a strict separation between frontend and backend components to ensure modularity and scalability.

2. Backend Components (Node.js/Express)
2.1 Server Core (server.js)
Entry Point: Acts as the main entry point for the entire application.

Application Setup: Handles Express application configuration and HTTP server initialization with Socket.io.

Connectivity: Manages the MongoDB connection and registers all API routes and global middleware.

2.2 Routes
authRoutes.js: Manages all authentication endpoints including registration and login.

videoRoutes.js: Handles video management endpoints such as upload, stream, and like.

userRoutes.js: Dedicated endpoints for user management and role assignment.

2.3 Controllers
authController.js: Contains business logic for user registration, login, and fetching current user data.

videoController.js: Manages core video logic including upload, library listing, streaming, and deletion.

2.4 Models (Mongoose)
User.js: Defines the user schema including username, email, hashed password, and roles.

Video.js: Manages video metadata, file paths, processing status, and sensitivity results.

2.5 Middleware
auth.js: Implements JWT token verification and Role-Based Access Control (RBAC).

upload.js: Configures Multer for file validation, size limits, and storage destination.

socketAuth.js: Ensures WebSocket connections are authenticated via JWT.

2.6 Services and Handlers
videoProcessor.js: Contains logic for the video processing pipeline and simulated sensitivity analysis.

socketHandler.js: Manages WebSocket connection lifecycles, rooms, and event emissions.

3. Frontend Components (React.js)
3.1 Application Core
App.jsx: The main component defining the router configuration and global providers.

Context Providers: Includes AuthContext for state management and SocketContext for real-time connection handling.

3.2 Pages and UI
Auth Pages: Login.jsx and Register.jsx for secure user access.

Dashboard/Library: Home.jsx (VideoLibrary) for viewing, searching, and filtering content.

Management: UploadVideo.jsx for adding content and VideoPlayer.jsx for high-performance playback.

4. Security Architecture (RBAC)
The system utilizes a multi-layered security approach to protect data and resources.

Authentication: Uses JWT-based authentication with tokens stored in localStorage and passed via Authorization headers.

Authorization: Implements Role-Based Access Control (RBAC) with three distinct roles: viewer, editor, and admin.

Tenant Isolation: Data segregation is maintained at the database level using Tenant IDs in both User and Video models.

File Security: Enforces file type validation, size limits, and access control on stored media.

5. Data Flow and Real-Time Communication
5.1 Video Processing Flow
Upload: User selects a file; the backend Multer middleware stores it and creates a "processing" record.

Analysis: A 5-second simulated AI process evaluates content for safety.

Notification: Upon completion, the server emits a 'videoStatusUpdate' event via Socket.io.

Update: The React frontend receives the update and refreshes the video status badge instantly.

5.2 Video Streaming Flow
Request: Frontend requests a video; backend fetches metadata from MongoDB.

Stream: Backend utilizes HTTP 206 Partial Content to stream the file from the local file system in chunks.

6. Design Patterns and Scalability
MVC Pattern: Clear separation of Mongoose Models, React Views, and Express Controllers.

Middleware/Service Patterns: Decouples business logic from request handling.

Limitations: Current system uses local file storage and simulated processing; future versions will integrate Cloud Storage (S3) and a Load Balancer for global scalability.