#  StreamOS API Documentation

[cite_start]**Project Name:** Video Upload, Sensitivity Processing, and Streaming Application [cite: 1]  
**Base URL:** `http://localhost:5000/api`  
**Developer:** KARREPU HEMA CHARAN REDDY

---

##  1. Authentication Module
[cite_start]Endpoints for managing user access and multi-tenant security[cite: 84].

### **Register Account**
* **Endpoint:** `POST /auth/register`
* **Description:** Creates a new user with a specific role.
* [cite_start]**Roles:** `viewer`, `editor`, `admin` .
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
[cite_start]Core logic for handling media uploads, storage, and retrieval[cite: 7].

### **Get Video Library**
* **Endpoint:** `GET /videos`
* [cite_start]**Description:** Returns a list of all videos with their current processing status[cite: 19].

### **Upload Video**
* **Endpoint:** `POST /videos/upload`
* [cite_start]**Access:** **Admin / Editor Only** [cite: 34-35].
* **Content-Type:** `multipart/form-data`
* [cite_start]**Logic:** Triggers the **Sensitivity Analysis Pipeline**[cite: 36, 39].

### **Interactive Likes**
* **Endpoint:** `PUT /videos/like/:id`
* **Description:** Toggles a like. Implements "One Like Per Account" by tracking User IDs in the database array.

---

## 3. Streaming & Real-Time Module
Advanced technical implementation for playback and live updates.

### **Video Streaming (Range Requests)**
* **Endpoint:** `GET /videos/stream/:filename`
* [cite_start]**Description:** Implements **HTTP Range Requests** for Netflix-style chunked streaming[cite: 11, 20].
* **Response Code:** `206 Partial Content`.

### **WebSocket Events (Socket.io)**
[cite_start]The system uses Socket.io to push real-time status updates[cite: 10, 22].



* **Event:** `videoStatusUpdate`
* [cite_start]**Description:** Emitted when the simulated AI finishes checking content for sensitivity[cite: 40, 61].
* **Payload Example:**
    ```json
    {
      "_id": "676288a1...",
      "sensitivityStatus": "safe" 
    }
    ```

---

##  4. Security & Roles (RBAC)
[cite_start]The API enforces user isolation and role-based permissions [cite: 30-31].

| Role | Permissions |
| :--- | :--- |
| **Viewer** | [cite_start]Read-only access to videos[cite: 33]. |
| **Editor** | [cite_start]Can upload and manage content[cite: 34]. |
| **Admin** | [cite_start]Full system access, including deletion of records[cite: 35]. |

---

##  5. Response Status Codes
* `200 OK`: Request successful.
* [cite_start]`201 Created`: Resource (Video/User) successfully created[cite: 113].
* [cite_start]`206 Partial Content`: Video chunk delivered successfully[cite: 116].
* [cite_start]`401 Unauthorized`: Valid authentication token missing[cite: 24].
* [cite_start]`403 Forbidden`: User role does not have permission for this action[cite: 31].