# Stage 1: Build frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build backend
FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY pom.xml ./
RUN mvn dependency:go-offline -B
COPY src/ ./src/
COPY --from=frontend-build /app/frontend/dist/ ./src/main/resources/static/
RUN mvn clean package -DskipTests

# Stage 3: Run
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
