# 프론트엔드 (React)
# Node.js 의존성 파일 복사 및 설치
FROM node:21 AS frontend
WORKDIR /src
COPY package.json package-lock.json* ./
RUN npm install && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs


# Node.js 의존성 파일 복사 및 설치
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

# 백엔드 (Spring Boot)
# JDK 설정
FROM openjdk:17 AS backend_builder
COPY . .

RUN ./gradlew build -x test

FROM openjdk:17 AS backend
# JAR 파일 복사 및 실행 설정
COPY build/libs/*.jar app.jar
EXPOSE 5050
ENTRYPOINT ["java","-jar","/app.jar"]
