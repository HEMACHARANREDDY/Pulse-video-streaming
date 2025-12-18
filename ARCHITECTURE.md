#  Architecture & Component Design
**Lead Developer:** KARREPU HEMA CHARAN REDDY  
**System Type:** Multi-Tenant Video Streaming & AI Analysis Platform

---

## 1. High-Level System Architecture

The application follows a decoupled MERN stack architecture (MongoDB, Express, React, Node.js) designed for real-time data flow and role-based security.



---

## 2. Component Architecture

### **A. Backend Components (Node.js/Express)**
1.  **Server (`server.js`):** The central entry point that initializes the Express application, manages the MongoDB connection via Mongoose, and binds the HTTP server with Socket.io for real-time event handling.
2.  **Routes:**
    * **auth.js:** Manages User Registration, Login, and Google OAuth 2.0 integration.
    * **video.js:** Handles video metadata, streaming logic, and interaction endpoints.
3.  **Models (Mongoose):**
    * **User.js:** Defines roles (`admin`, `editor`, `viewer`) and stores hashed credentials.
    * **Video.js:** Stores file metadata, processing status, and an array of User IDs in the `likes` field to enforce a "one-like-per-account" rule.
4.  **Middleware:**
    * **auth.js:** A custom security layer that verifies JWT tokens and enforces Role-Based Access Control (RBAC).
    * **multer:** Handles multipart file uploads to secure local server storage.

### **B. Frontend Components (React.js)**
1.  **Main Components:**
    * **Login.jsx / Register.jsx:** Secure forms for user authentication and account creation.
    * **Home.jsx:** The primary dashboard featuring a real-time video grid, search capabilities, and interactive elements.
    * **Upload.jsx:** Restricted interface for adding new content, accessible only by users with Admin or Editor roles.
2.  **State & Real-time:**
    * **Socket.io-client:** Establishes a persistent link with the backend to listen for `videoStatusUpdate` events, updating the UI instantly without page refreshes.

---

## 3. Data Flow Diagrams

### **Video Upload & AI Processing Flow**
```text
User (Admin/Editor) -> Selects Video -> POST /api/videos/upload
    │
    ▼
Backend -> Saves file to Storage -> Creates DB record (status: "processing")
    │
    ▼
Background Process -> 5s Timer (Simulated AI Analysis)
    │
    ▼
Analysis Finish -> Database Updates (status: "safe" OR "flagged")
    │
    ▼
Socket.io -> Emit 'videoStatusUpdate' to all connected Clients
    │
    ▼
Frontend -> Receives Event -> Re-renders Video Badge instantly

Streaming Flow (HTTP Range Requests)
User -> Clicks Play -> Request GET /api/videos/stream/:filename
    │
    ▼
Backend -> Detects 'Range' Header -> Reads specific file chunk
    │
    ▼
Response -> HTTP 206 Partial Content -> Buffer starts for seamless playback
To finalize your project documentation, here is the full Markdown code for your ARCHITECTURE_OVERVIEW.md. This file is formatted exactly as you requested, incorporating your specific implementation details, your name KARREPU HEMA CHARAN REDDY, and the technical architecture of your MERN stack application.

Markdown

# 🏗️ Architecture & Component Design
**Lead Developer:** KARREPU HEMA CHARAN REDDY  
**System Type:** Multi-Tenant Video Streaming & AI Analysis Platform

---

## 1. High-Level System Architecture

The application follows a decoupled MERN stack architecture (MongoDB, Express, React, Node.js) designed for real-time data flow and role-based security.



---

## 2. Component Architecture

### **A. Backend Components (Node.js/Express)**
1.  **Server (`server.js`):** The central entry point that initializes the Express application, manages the MongoDB connection via Mongoose, and binds the HTTP server with Socket.io for real-time event handling.
2.  **Routes:**
    * **auth.js:** Manages User Registration, Login, and Google OAuth 2.0 integration.
    * **video.js:** Handles video metadata, streaming logic, and interaction endpoints.
3.  **Models (Mongoose):**
    * **User.js:** Defines roles (`admin`, `editor`, `viewer`) and stores hashed credentials.
    * **Video.js:** Stores file metadata, processing status, and an array of User IDs in the `likes` field to enforce a "one-like-per-account" rule.
4.  **Middleware:**
    * **auth.js:** A custom security layer that verifies JWT tokens and enforces Role-Based Access Control (RBAC).
    * **multer:** Handles multipart file uploads to secure local server storage.

### **B. Frontend Components (React.js)**
1.  **Main Components:**
    * **Login.jsx / Register.jsx:** Secure forms for user authentication and account creation.
    * **Home.jsx:** The primary dashboard featuring a real-time video grid, search capabilities, and interactive elements.
    * **Upload.jsx:** Restricted interface for adding new content, accessible only by users with Admin or Editor roles.
2.  **State & Real-time:**
    * **Socket.io-client:** Establishes a persistent link with the backend to listen for `videoStatusUpdate` events, updating the UI instantly without page refreshes.

---

## 3. Data Flow Diagrams

### **Video Upload & AI Processing Flow**
```text
User (Admin/Editor) -> Selects Video -> POST /api/videos/upload
    │
    ▼
Backend -> Saves file to Storage -> Creates DB record (status: "processing")
    │
    ▼
Background Process -> 5s Timer (Simulated AI Analysis)
    │
    ▼
Analysis Finish -> Database Updates (status: "safe" OR "flagged")
    │
    ▼
Socket.io -> Emit 'videoStatusUpdate' to all connected Clients
    │
    ▼
Frontend -> Receives Event -> Re-renders Video Badge instantly
Streaming Flow (HTTP Range Requests)
Plaintext

User -> Clicks Play -> Request GET /api/videos/stream/:filename
    │
    ▼
Backend -> Detects 'Range' Header -> Reads specific file chunk
    │
    ▼
Response -> HTTP 206 Partial Content -> Buffer starts for seamless playback
4. Security Architecture
Role-Based Access Control (RBAC)
The system enforces strict route-level security to maintain data integrity:

Viewer: Read-only access to view and like videos.

Editor: Permission to upload and view videos.

Admin: Unrestricted access, including the ability to delete any video record.

Authentication
JWT: JSON Web Tokens are generated upon successful login and required for all write operations.

Google OAuth 2.0: Secure external authentication via Google Identity Services using Client ID 89178432xxxx-m6unitau6l264ii62qt7to7g5vglu758.apps.googleusercontent.com.
5. Real-Time Communication
WebSocket Events
Event Name,Direction,Payload
videoStatusUpdate,Server ➔ Client,"`{ _id, sensitivityStatus: ""safe"""}
To finalize your project, here is the complete, integrated code for your ARCHITECTURE_OVERVIEW.md. This document follows the professional structure you requested, featuring your name KARREPU HEMA CHARAN REDDY, and detailed technical diagrams of your MERN stack system.

Markdown

# 🏗️ Architecture & Component Design
**Lead Developer:** KARREPU HEMA CHARAN REDDY  
**System Type:** Multi-Tenant Video Streaming & AI Analysis Platform

---

## 1. High-Level System Architecture

The application is built on a decoupled MERN stack architecture (MongoDB, Express, React, Node.js), optimized for real-time data synchronization and role-based security.



---

## 2. Component Architecture

### **A. Backend Components (Node.js/Express)**
1.  **Server (`server.js`):** The primary entry point that initializes the Express application, establishes the MongoDB connection, and integrates the HTTP server with Socket.io for bi-directional communication.
2.  **Routes:**
    * **auth.js:** Handles Registration, Login, and Google OAuth 2.0 flows.
    * **video.js:** Manages video metadata, the streaming engine, and interaction endpoints.
3.  **Models (Mongoose):**
    * **User.js:** Defines the schema for authentication and Role-Based Access Control (RBAC).
    * **Video.js:** Tracks video metadata and implements a "one-like-per-user" policy via an array of User ObjectIds.
4.  **Middleware:**
    * **auth.js:** Validates JWT tokens and enforces specific role permissions (Viewer, Editor, Admin).
    * **multer:** Facilitates secure multipart file uploads to local server storage.

### **B. Frontend Components (React.js)**
1.  **Main Components:**
    * **Login.jsx / Register.jsx:** User-facing interfaces for secure system access.
    * **Home.jsx:** The central dashboard providing a real-time video grid and search functionality.
    * **Upload.jsx:** Restricted interface for adding content, protected by RBAC logic.
2.  **Real-time Integration:**
    * **Socket.io-client:** Establishes a WebSocket connection to receive 'videoStatusUpdate' events directly from the server.

---

## 3. Data Flow Diagrams

### **Video Upload & AI Processing Flow**
```text
User (Admin/Editor) -> Selects Video -> POST /api/videos/upload
    │
    ▼
Backend -> Persists File -> Creates DB record (status: "processing")
    │
    ▼
Background Process -> 5-Second Simulated AI Analysis
    │
    ▼
Status Update -> Database Updated to "safe" or "flagged"
    │
    ▼
Socket.io -> Emits 'videoStatusUpdate' to Frontend
    │
    ▼
Frontend -> Updates Video Badge instantly without page refresh
Streaming Flow (HTTP Range Requests)
Plaintext

User -> Clicks Play -> Request GET /api/videos/stream/:filename
    │
    ▼
Backend -> Detects 'Range' Header -> Streams Video in Chunks
    │
    ▼
Response -> HTTP 206 Partial Content -> Continuous Playback Starts
4. Security Architecture
Role-Based Access Control (RBAC)
The platform enforces strict security at the route level:

Viewer: Read-only access; can view and like videos.

Editor: Permission to upload and view videos.

Admin: Unrestricted management, including content deletion.

Authentication
JWT: Bearer tokens used for session persistence and API authorization.

Google OAuth 2.0: Secure login via Client ID 891784327014-m6unitau6l264ii62qt7to7g5vglu758.apps.googleusercontent.com.

5. Real-Time Communication
WebSocket Events
Event Name	Direction	Data Payload
videoStatusUpdate	Server ➔ Client	{ _id, sensitivityStatus }

Export to Sheets

6. Database Schema (MongoDB)
Video Collection
JavaScript

{
  _id: ObjectId,
  title: String,
  videoUrl: String,
  uploader: String,
  sensitivityStatus: String ("processing", "safe", "flagged"),
  likes: Array (ObjectIds), // Enforces one like per account
  createdAt: Date
}
7. Design Patterns
MVC (Model-View-Controller): Structured separation of concerns.

Observer Pattern: Implemented via Socket.io for real-time reactivity.

Middleware Pattern: For centralized auth and file handling.