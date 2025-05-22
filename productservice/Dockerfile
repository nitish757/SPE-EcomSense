# Use a lightweight OpenJDK image as base
FROM eclipse-temurin:17-jdk-alpine

# Set the working directory
WORKDIR /app

# Create a non-root user
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy the JAR file
COPY target/productservice-0.0.1-SNAPSHOT.jar app.jar

# Expose the app port (adjust based on your service configuration)
EXPOSE 8082

# Optional: Add health check
HEALTHCHECK CMD curl -f http://localhost:8081/actuator/health || exit 1

# Start the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]