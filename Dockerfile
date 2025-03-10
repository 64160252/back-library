# ใช้ base image ของ Node.js
FROM node:18-buster AS build-stage

# ติดตั้ง dependencies สำหรับการคอมไพล์ bcrypt
RUN apt-get update && apt-get install -y python3 make g++

# กำหนด working directory
WORKDIR /usr/src/app

# รับค่า ENV_MODE เป็น argument
ARG ENV_MODE=development
ENV NODE_ENV=$ENV_MODE

# คัดลอก package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์ทั้งหมดจากโปรเจกต์
COPY . .

# ถ้าเป็น production ให้ build
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

# ใช้ base image เบากว่าสำหรับ production
FROM node:18-buster AS production-stage
WORKDIR /usr/src/app

# รับค่า ENV_MODE เป็น argument
ARG ENV_MODE=development
ENV NODE_ENV=$ENV_MODE

# คัดลอกไฟล์จาก build-stage
COPY --from=build-stage /usr/src/app /usr/src/app

# เปิดพอร์ต 3000 (ภายใน Container)
EXPOSE 3000

# รันแอปตามโหมด
CMD sh -c "if [ \"$NODE_ENV\" = \"development\" ]; then npm run start:dev; else npm run start:prod; fi"
