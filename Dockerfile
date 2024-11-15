# AI (Flask)
FROM python:3.11.9 AS flask
WORKDIR /app
ENV FLASK_APP=./app/app.py
ENV FLASK_RUN_HOST=127.0.0.1
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs
EXPOSE 8080

# 프론트엔드 (React)
# Node.js 의존성 파일 복사 및 설치
FROM node:21 AS frontend
WORKDIR /src
COPY package.json package-lock.json* ./
RUN npm installRUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
apt-get install -y nodejs

# Node.js 의존성 파일 복사 및 설치
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["flask", "run", "--debug"]

# 백엔드 (Spring Boot)
# JDK 설정
FROM openjdk:17 AS backend
WORKDIR /src/main

# JAR 파일 복사 및 실행 설정
COPY build/libs/KoBo_Proceed-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 5050
ENTRYPOINT ["java", "-jar", "app.jar"]

