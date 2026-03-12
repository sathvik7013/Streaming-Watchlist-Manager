# Streaming Watchlist Manager

A full-stack web application to organize and manage movies and TV series across multiple streaming platforms.

## Tech Stack

**Backend**
- Java 17 + Spring Boot 3.2
- Spring Security + JWT Authentication
- Spring Data JPA + H2 Database
- Maven

**Frontend**
- React 18 + Vite
- React Router DOM
- Axios
- Static HTML/CSS/JS (also served directly from Spring Boot)

## Features

- User registration and login with JWT authentication
- Browse movies and series with search, filter by type, genre, and platform
- Add content to personal watchlist
- Track watch status: Plan to Watch, Watching, Completed, Dropped
- Rate content (1–10) and add personal notes
- Track episode progress for series
- Watchlist statistics dashboard
- 15 pre-seeded titles across Netflix, HBO Max, Disney+, Amazon Prime, and Hulu

## Project Structure

```
project/
├── pom.xml
├── src/main/java/com/watchlist/
│   ├── config/          # JWT, Security, CORS
│   ├── controller/      # REST API endpoints
│   ├── dto/             # Request/Response DTOs
│   ├── exception/       # Global error handling
│   ├── model/           # JPA entities
│   ├── repository/      # Spring Data repositories
│   └── service/         # Business logic
├── src/main/resources/
│   ├── application.properties
│   ├── data.sql          # Seed data
│   └── static/           # Built-in HTML/JS/CSS frontend
└── frontend/             # React + Vite frontend
    └── src/
        ├── pages/        # Home, Browse, Watchlist, Login, Register
        ├── components/   # Navbar
        ├── context/      # AuthContext
        └── services/     # Axios API client
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/content` | No | Get all content |
| GET | `/api/content/search?keyword=` | No | Search content |
| GET | `/api/content/type/{type}` | No | Filter by MOVIE/SERIES |
| GET | `/api/watchlist` | Yes | Get user watchlist |
| POST | `/api/watchlist` | Yes | Add to watchlist |
| PUT | `/api/watchlist/{id}` | Yes | Update watchlist item |
| DELETE | `/api/watchlist/{id}` | Yes | Remove from watchlist |
| GET | `/api/watchlist/stats` | Yes | Watchlist statistics |

## Running the Application

### Prerequisites
- Java 17+
- Node.js 18+

### Backend
```bash
./mvnw spring-boot:run
```
Backend runs on `http://localhost:8080`
Built-in frontend available at `http://localhost:8080`
H2 Console at `http://localhost:8080/h2-console`

### React Frontend (optional)
```bash
cd frontend
npm install
npm run dev
```
React frontend runs on `http://localhost:5173`
