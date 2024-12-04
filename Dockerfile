# 베이스 이미지 선택
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# Next.js 빌드
RUN npm run build

# 앱 실행
CMD ["npm", "start"]
