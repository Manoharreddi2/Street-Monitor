# Street Monitor 🚦

A full-stack, civic-tech web application that empowers citizens to report, track, and upvote road-related infrastructure issues (potholes, broken streetlights, road hazards, etc.) directly to their local authorities.

![Street Monitor Logo](./frontend/public/logo.png)

## 🌟 Key Features

### 👤 For Users (Citizens)
*   **Secure Authentication:** Sign up using an email/password or instantly log in using **Google OAuth**.
*   **Interactive Map Dashboard:** View all reported issues in your area on a live interactive map (powered by Leaflet).
*   **Report New Issues:** Seamlessly report an issue by dropping a pin on the map, providing a title, description, issue type, and severity scale (1-5).
*   **Photo Evidence:** Upload photo evidence of the issue directly from your device.
*   **Upvoting System:** Upvote issues reported by other citizens to increase their visibility and priority.
*   **Status Tracking:** Track the real-time status of your reported issues (`REPORTED` ➔ `IN PROGRESS` ➔ `RESOLVED`).

### 🛡️ For Administrators
*   **Role-Based Access Control:** Secure Admin-only dashboard ensuring only authorized personnel can access management features.
*   **Centralized Management:** View all reported issues in a highly organized, sortable data table.
*   **Review Detailed Evidence:** Open specific issues to view the exact GPS map coordinates and inspect attached photo evidence.
*   **Status Updates:** Instantly update the status of any issue (e.g., mark a pothole as "Resolved"), which updates live for all end-users.

---

## 🛠️ Technology Stack

### Frontend (User Interface)
*   **Framework:** React (built with Vite for lightning-fast performance)
*   **Routing:** React Router v6
*   **Styling:** Custom CSS with Glassmorphism UI components
*   **Map Integration:** React-Leaflet
*   **Authentication:** Google Identity Services (`@react-oauth/google`)
*   **HTTP Client:** Axios
*   **Deployment:** Vercel

### Backend (Server & API)
*   **Framework:** Spring Boot 3.2.3 (Java 17)
*   **Security:** Spring Security with stateless JWT (JSON Web Tokens)
*   **Data Access:** Spring Data JPA / Hibernate
*   **Database Integration:** MySQL Connector
*   **Containerization:** Docker (Multi-stage build)
*   **Deployment:** Render

### Database
*   **Engine:** MySQL
*   **Hosting:** Aiven Cloud

---

## 🚀 Live Demo
*   **Frontend:** [https://street-monitor.vercel.app](https://street-monitor.vercel.app)
*   **Backend API:** [https://street-monitor-1.onrender.com](https://street-monitor-1.onrender.com)

---

## 💻 Local Development Setup

### 1. Database Setup
Ensure you have a MySQL instance running (locally or on a cloud provider like Aiven).
Create a database named `defaultdb` (or update the properties file accordingly).

### 2. Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Configure your `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://YOUR_DB_URL
   spring.datasource.username=YOUR_USERNAME
   spring.datasource.password=YOUR_PASSWORD
   jwt.secret=YOUR_SUPER_SECRET_KEY
   ```
3. Run the Spring Boot application: `./mvnw spring-boot:run`

### 3. Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `frontend` folder:
   ```env
   VITE_API_URL=http://localhost:8080/api
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   ```
4. Start the development server: `npm run dev`

---

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
