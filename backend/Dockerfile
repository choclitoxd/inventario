# Stage 1: Build the Spring Boot application using Gradle
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Copy gradle wrapper and settings files
COPY gradle/ gradle/
COPY gradlew gradlew
COPY settings.gradle settings.gradle
COPY build.gradle build.gradle

# Grant execution rights on the gradlew script
RUN chmod +x gradlew

# Download dependencies (cache layer)
RUN ./gradlew dependencies --no-daemon

# Copy the source code
COPY src/ src/

# Build the executable JAR file without running tests
RUN ./gradlew bootJar -x test --no-daemon

# Stage 2: Create a minimal JRE image to run the application
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose backend port
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
