# Use official OpenJDK image for production
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the JAR (adjust name if needed)
COPY target/*.jar app.jar

# Expose application port
EXPOSE 8083

# Run as non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

ENTRYPOINT ["java", "-jar", "app.jar"]
