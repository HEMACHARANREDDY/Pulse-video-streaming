# 🏗️ System Architecture Documentation

**Project:** Secure Video Streaming & AI Sensitivity Analysis  
**Developer:** Karrepu Chalapathi Reddy  
**Framework:** MERN Stack (MongoDB, Express, React, Node.js)

---

## 1. High-Level Overview
The system is built using a decoupled client-server architecture. It utilizes RESTful APIs for standard data operations and WebSockets (Socket.io) for real-time status notifications.



---

## 2. Component Breakdown

### **A. Frontend Layer (React.js)**
* **Vite:** Used as the build tool for high-performance development.
* **State Management:** Utilizes React Hooks (`useState`, `useEffect`) to manage video data and real-time UI updates.
* **Authentication:** Integrates Google OAuth 2.0 via `@react-oauth/google` and custom JWT storage in `localStorage`.
* **Socket.io-Client:** Maintains a persistent connection to the backend to listen for sensitivity analysis completion.

### **B. Backend Layer (Node.js & Express)**
* **REST API:** Handles user authentication, video metadata management, and "Like" interactions.
* **Streaming Engine:** Implements **HTTP Range Requests** to stream video files in chunks, allowing users to seek through videos without downloading the full file first.
* **Real-Time Engine:** Integrates **Socket.io** with the Express server to push "sensitivityStatus" updates directly to connected clients.
* **Multer Middleware:** Manages multi-part form data for secure video file uploads to the server's local storage.

### **C. Database Layer (MongoDB Atlas)**
* **User Collection:** Stores hashed credentials and Role-Based Access Control (RBAC) levels.
* **Video Collection:** Tracks video metadata, file paths, processing status, and an array of User IDs for the "One Like Per Account" feature.

---

## 3. Data Flow: Video Processing Pipeline

1.  **Upload Phase:** An authorized user (Admin/Editor) uploads a file via the `/api/videos/upload` endpoint.
2.  **Persistence Phase:** The file is saved to storage, and a database entry is created with `sensitivityStatus: "processing"`.
3.  **Simulated AI Phase:** A background process (5-second timer) simulates an AI model analyzing the content for safety.
4.  **Broadcast Phase:** Once the status is updated to `safe` or `flagged`, the server emits a `videoStatusUpdate` event.
5.  **Reactive Update:** The React frontend receives the event via Socket.io and updates the specific video card in the UI without a page refresh.

---

## 4. Security Architecture (RBAC)
The system enforces strict Role-Based Access Control:

| Layer | Security Measure |
| :--- | :--- |
| **Authentication** | JWT (JSON Web Tokens) and Google OAuth 2.0. |
| **Viewer Role** | Read-only access; can watch and like videos. |
| **Editor Role** | Can upload new content to the platform. |
| **Admin Role** | Full management permissions, including video deletion. |

---

## 5. Deployment & Scalability
* **Storage:** Currently uses local server storage (expandable to AWS S3).
* **Environment:** Managed via `.env` files to protect sensitive credentials like MongoDB URIs and JWT Secrets.