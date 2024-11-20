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
FROM openjdk:17-jdk AS backend

# 작업 디렉토리 설정
WORKDIR /app

# JAR 파일 복사
COPY build/libs/KoBo_Proceed-0.0.1-SNAPSHOT.jar app.jar

# 컨테이너 시작 시 실행할 명령어
ENTRYPOINT ["java", "-jar", "app.jar"]

# 애플리케이션 포트 설정
EXPOSE 5050

RUN ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime



