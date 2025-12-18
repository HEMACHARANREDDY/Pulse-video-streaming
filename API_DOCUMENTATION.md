#  StreamOS API Documentation

**Project Name:** Video Upload, Sensitivity Processing, and Streaming Application 
**Base URL:** `http://localhost:5000/api`  
**Developer:** KARREPU HEMA CHARAN REDDY

---

##  1. Authentication Module
Endpoints for managing user access and multi-tenant security.

### **Register Account**
* **Endpoint:** `POST /auth/register`
* **Description:** Creates a new user with a specific role.
* **Roles:** `viewer`, `editor`, `admin` .
* **Payload:**
    ```json
    {
      "username": "example_user",
      "email": "user@network.com",
      "password": "password123",
      "role": "viewer"
    }
    ```

### **Google OAuth Login**
* **Endpoint:** `POST /auth/google`
* **Description:** Authenticates user via Google Identity Services.
* **Payload:** `{ "token": "GOOGLE_JWT_TOKEN" }`

---

##  2. Video Management Module
Core logic for handling media uploads, storage, and retrieval.

### **Get Video Library**
* **Endpoint:** `GET /videos`
* **Description:** Returns a list of all videos with their current processing status.

### **Upload Video**
* **Endpoint:** `POST /videos/upload`
* **Access:** **Admin / Editor Only**.
* **Content-Type:** `multipart/form-data`
* **Logic:** Triggers the **Sensitivity Analysis Pipeline**.

### **Interactive Likes**
* **Endpoint:** `PUT /videos/like/:id`
* **Description:** Toggles a like. Implements "One Like Per Account" by tracking User IDs in the database array.

---

## 3. Streaming & Real-Time Module
Advanced technical implementation for playback and live updates.

### **Video Streaming (Range Requests)**
* **Endpoint:** `GET /videos/stream/:filename`
* **Description:** Implements **HTTP Range Requests** for Netflix-style chunked streaming.
* **Response Code:** `206 Partial Content`.

### **WebSocket Events (Socket.io)**
The system uses Socket.io to push real-time status updates.



* **Event:** `videoStatusUpdate`
* **Description:** Emitted when the simulated AI finishes checking content for sensitivity.
* **Payload Example:**
    ```json
    {
      "_id": "676288a1...",
      "sensitivityStatus": "safe" 
    }
    ```

---

##  4. Security & Roles (RBAC)
The API enforces user isolation and role-based permissions .

| Role | Permissions |
| :--- | :--- |
| **Viewer** | Read-only access to videos. |
| **Editor** | Can upload and manage content. |
| **Admin** | Full system access, including deletion of records. |

---

##  5. Response Status Codes
* `200 OK`: Request successful.
* `201 Created`: Resource (Video/User) successfully created.
* `206 Partial Content`: Video chunk delivered successfully.
* `401 Unauthorized`: Valid authentication token missing.
* `403 Forbidden`: User role does not have permission for this action.