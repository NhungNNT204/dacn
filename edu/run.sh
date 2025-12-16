#!/bin/bash
# Script chạy ứng dụng Spring Boot (skip tests)

echo "============================================"
echo "Running Spring Boot Application..."
echo "============================================"

mvn spring-boot:run -DskipTests
