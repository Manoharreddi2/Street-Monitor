# Street Monitor 🚦

A full-stack, civic-tech web application that empowers citizens to report, track, and upvote road-related infrastructure issues.

![Street Monitor Logo](./frontend/public/logo.png)

## 🚦 About the Project
**Street Monitor** is a civic-tech web application designed to bridge the gap between citizens and local authorities. 
It allows everyday users to instantly **report public infrastructure issues** (such as dangerous potholes, broken streetlights, or road hazards) by dropping a precise pin on an interactive map, providing a severity rating, and uploading photo evidence from their phone. Other citizens can **upvote** these issues to increase their visibility. 
Meanwhile, authorized **Administrators** have a dedicated dashboard where they can review the photo evidence, check the exact GPS coordinates, and update the live status of the issue (from *Reported* to *In Progress* to *Resolved*).

## 💻 The Tech Stack

### Frontend (The User Interface)
* **React & Vite:** For a lightning-fast, modern, single-page application experience.
* **React Router:** For seamless navigation between the map, login, and reporting pages.
* **React-Leaflet:** To render the live interactive maps and calculate precise GPS pins.
* **Google Identity Services:** To provide secure, one-click "Login with Google" OAuth for citizens.
* **Axios:** To communicate smoothly with the backend API.
* **Vercel:** Cloud platform hosting the live frontend website.

### Backend (The Server & Security)
* **Java 17 & Spring Boot (v3.2.3):** The robust core engine powering the API and business logic.
* **Spring Security:** Protecting the application with strict Role-Based Access Control (Admins vs Users).
* **JWT (JSON Web Tokens):** For secure, stateless authentication without session cookies.
* **Spring Data JPA / Hibernate:** To translate Java objects into database records seamlessly.
* **Docker:** Containerized to run consistently entirely inside isolated cloud environments.
* **Render:** Cloud platform hosting the live backend server.

### Database (The Storage)
* **MySQL:** A powerful relational database to permanently store users, issue coordinates, image URLs, and votes.
* **Aiven Cloud:** Highly secure, fully managed cloud database hosting.

---

## 🚀 Live Demo
* **Frontend:** [https://street-monitor.vercel.app](https://street-monitor.vercel.app)
* **Backend API:** [https://street-monitor-1.onrender.com](https://street-monitor-1.onrender.com)

---

## 🛠️ Local Development Setup

### 1. Database Setup
Create a MySQL instance and set up a database named `defaultdb`.

### 2. Backend Setup
1. `cd backend`
2. Configure your `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://YOUR_DB_URL
   spring.datasource.username=YOUR_USERNAME
   spring.datasource.password=YOUR_PASSWORD
   jwt.secret=YOUR_SUPER_SECRET_KEY
   ```
3. Run the Spring Boot application: `./mvnw spring-boot:run`

### 3. Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:8080/api
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   ```
4. `npm run dev`
