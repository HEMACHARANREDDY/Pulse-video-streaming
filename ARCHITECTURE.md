Architecture Overview
Developer: KARREPU HEMA CHARAN REDDY Project Name: Pulse Video Streaming & Sensitivity Analysis Platform

The Pulse Video Streaming Application follows a robust full-stack architecture with clear separation between frontend and backend components, ensuring high modularity and real-time responsiveness.
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   UI     │  │  State   │  │  Socket  │  │  HTTP    │   │
│  │ Components│ │ Management│ │  Client  │  │  Client  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │ WebSocket (Socket.io)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Node.js/Express)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Routes  │  │Controllers│ │Middleware │  │ Services │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Models  │  │  Socket  │  │   Auth   │  │ Processor│   │
│  │ (Mongoose)│ │  Handler │  │ (JWT)    │  │ (Video)  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database (MongoDB)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │  Users   │  │  Videos  │  │          │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    File Storage (Local Storage)              │
│  ┌──────────┐  ┌──────────┐                                │
│  │  Uploads │  │ Processed│                                │
│  └──────────┘  └──────────┘                                │
└─────────────────────────────────────────────────────────────┘
Component Architecture
Backend Components
1. Server Core (server.js)
Main Entry Point: Handles the initialization of the Express application.

Integration: Sets up the HTTP server with Socket.io for real-time communication.

Configuration: Manages MongoDB connection, route registration, and global middleware setup.

2. Routes
authRoutes.js: Dedicated endpoints for user registration, login, and Google OAuth 2.0.

videoRoutes.js: Core endpoints for video metadata management and interaction.

userRoutes.js: Endpoints for role-based user management.

3. Controllers
authController.js: Logic for identity verification and token generation.

videoController.js: Business logic for video library management, uploads, and deletions.

4. Models (Mongoose)
User.js: Defines the structure for accounts, including email, hashed password, and roles.

Video.js: Tracks metadata, file paths, and processing status.

5. Middleware
auth.js: Verifies JWT tokens and enforces Role-Based Access Control (RBAC).

upload.js: Configures Multer for secure multi-part file uploads and validation.

6. Services & Socket Handler
videoProcessor.js: Orchestrates the 5-second simulated AI sensitivity analysis pipeline.

socketHandler.js: Manages real-time event emission for status updates.

Frontend Components
1. App (App.jsx)
The root component configuring the React Router and global state providers.

2. Context Providers
AuthContext.jsx: Manages user authentication state and JWT persistence.

SocketContext.jsx: Establishes and maintains the WebSocket connection to the backend.

3. Pages & UI
Login.jsx / Register.jsx: Secure entry points for user access.

VideoLibrary.jsx (Home.jsx): The main dashboard for viewing and searching videos.

UploadVideo.jsx: Interface for editors and admins to submit content.

VideoPlayer.jsx: High-performance playback engine using HTTP Range Requests.

Data Flow
Video Upload & Processing Flow
Selection: User submits a video via the UploadVideo component.

Ingestion: Backend saves the file and marks status as "processing" in MongoDB.

Analysis: The videoProcessor triggers a 5-second simulated AI scan.

Broadcast: Server emits videoStatusUpdate via Socket.io.

Reaction: Frontend updates the safety badge to "safe" or "flagged" immediately.

Video Streaming Flow
Request: User initiates playback; the VideoPlayer requests metadata.

Streaming: Backend utilizes HTTP 206 Partial Content to stream data in chunks from local storage.

Security Architecture
Authentication: JWT-based verification with tokens stored in localStorage.

Authorization: Role-Based Access Control (RBAC) distinguishing between Viewer, Editor, and Admin.

Isolation: Data segregation enforced at the database level.

File Security: Strict file type validation and size limits.

Database Schema
User Collection
JavaScript

{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  role: String (viewer | editor | admin),
  createdAt: Date
}
Video Collection
JavaScript

{
  _id: ObjectId,
  title: String,
  videoUrl: String,
  uploader: String,
  sensitivityStatus: String (processing | safe | flagged),
  likes: Array (ObjectIds),
  createdAt: Date
}
Design Patterns
MVC Pattern: Separation of Models (Mongoose), Views (React), and Controllers (Express).

Middleware Pattern: Decoupled security and upload logic.

Observer Pattern: Real-time updates via Socket.io.