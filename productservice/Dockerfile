# Use a lightweight OpenJDK image as base
FROM eclipse-temurin:17-jdk-alpine

# Set the working directory
WORKDIR /app

# Copy the built JAR file into the container
COPY target/*.jar app.jar

# Expose the port your Spring Boot app runs on (default 8080)
EXPOSE 8082

# Run the application as a non-root user (optional but recommended)
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Start the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
