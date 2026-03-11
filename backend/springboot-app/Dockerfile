# ─── Etapa 1: Compilar el proyecto ──────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copiar pom.xml primero para cachear dependencias
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar el código fuente
COPY src ./src

# Compilar y empaquetar (sin tests para agilizar)
RUN mvn clean package -DskipTests -B

# ─── Etapa 2: Imagen liviana para correr ────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar solo el jar generado
COPY --from=builder /app/target/*.jar app.jar

# Puerto del backend
EXPOSE 8080

# Variable de entorno requerida en producción
ENV ANTHROPIC_API_KEY=""

# Arrancar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]