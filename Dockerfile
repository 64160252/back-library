FROM node:18-buster

# ติดตั้ง dependencies สำหรับการคอมไพล์ bcrypt
RUN apt-get update && apt-get install -y python3 make g++

WORKDIR /usr/src/app

# คัดลอก package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์ทั้งหมดจากโปรเจกต์
COPY . .

# สร้างโปรเจกต์
RUN npm run build

# เปิดพอร์ต 3000 (ภายใน Container) แต่จะ Map กับ 8041 ใน docker-compose
EXPOSE 3000

# รันแอปใน production mode (หากต้องการให้รันใน development mode ใช้ npm run start:dev)
CMD ["npm", "run", "start:prod"]