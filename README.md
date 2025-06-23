🏥 HealthCareSystem Application
A Spring Boot-based backend API with JWT authentication and role-based access, supporting user registration (with profile image upload), login, and profile management. 
This backend is designed to work seamlessly with a React-based frontend.

📦 Tech Stack
Backend: Java, Spring Boot, Spring Security, JPA (Hibernate)

Database: MySQL

Authentication: JWT (JSON Web Token)

Frontend Integration: React (via CORS)

Image Storage: BLOB in MySQL (Profile pictures)

🚀 Features
✅ User Registration (multipart/form-data with profile image)

✅ Default profile image fallback if none uploaded

✅ JWT-based secure login

✅ Profile update (image, fullname, phone, password)

✅ Role-based access control (ROLE_HEALTH_USER, ROLE_HEALTH_ADMIN)

✅ Dashboard endpoint with auth validation

✅ React frontend CORS support

🛠️ Project Structure
swift
Copy
Edit
authapi/
├── src/main/java/com/healthcare/authapi/
│   ├── controller/AuthController.java
│   ├── entity/User.java
│   ├── model/LoginRequest.java
│   ├── repository/UserRepository.java
│   ├── service/JwtService.java
│   └── ...
├── src/main/resources/
│   └── static/images/default-profile.jpeg
├── application.properties
└── ...
⚙️ Configuration
application.properties
properties
Copy
Edit
# Application name
spring.application.name=HealthCareSystem

# Database Configuration
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/healthcare_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA & Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT Secret
jwt.secret=VGhpcy1pcy1hLXN1cGVyLXNlY3JldC1rZXktZm9yLUpXVC1zaWduaW5nIQ==

# CORS & Multipart
spring.servlet.multipart.enabled=true
spring.mvc.pathmatch.matching-strategy=ant_path_matcher
server.port=8080

📥 API Endpoints
🔐 /api/login – Login
http
Copy
Edit
POST /api/login
Content-Type: application/json

{
  "username": "john123",
  "password": "password123"
}
✅ Returns a JWT token.

📝 /api/register – Register
http
Copy
Edit
POST /api/register
Content-Type: multipart/form-data

Fields:
- fullname
- username
- phone
- email
- dob
- password
- profileImage (optional: JPEG only)
📸 If no image is uploaded, a default profile picture from resources/static/images/default-profile.jpeg is used.

👤 /api/user/profile – Get Profile
http
Copy
Edit
GET /api/user/profile
Headers: Authorization: Bearer <JWT>
🛠 /api/user/profile-update – Update Profile
http
Copy
Edit
POST /api/user/profile-update
Content-Type: multipart/form-data
Headers: Authorization: Bearer <JWT>

Fields:
- fullname
- phone
- password
- profileImage (optional)
📊 /api/Dashboard – Sample Dashboard Data
http
Copy
Edit
GET /api/Dashboard
Headers: Authorization: Bearer <JWT>
Returns basic mock metrics (customizable).

🖼️ Default Profile Image
Place a fallback image at:

swift
Copy
Edit
src/main/resources/static/images/default-profile.jpeg
It is used during registration when the user does not upload any image.

✅ Setup & Run
Start MySQL
Ensure MySQL is running and database healthcare_db is created.

Build & Run the App

bash
Copy
Edit
./mvnw clean spring-boot:run
React Frontend
Ensure it runs on http://localhost:3000 or update @CrossOrigin.

💡 Troubleshooting
Profile Image Load Error in WAR:
Use getInputStream() instead of getFile() when accessing classpath images.

MySQL connection issue:
Ensure MySQL is running, and application.properties has correct credentials.

System Error 5 (Windows):
Run terminal as Administrator to start MySQL:

sql
Copy
Edit
net start MySQL80
