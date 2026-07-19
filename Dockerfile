# Base image
FROM node:20-alpine

# Working directory di dalam container
WORKDIR /app

# Copy package.json & package-lock.json dulu (biar cache layer install lebih efisien)
COPY package*.json ./

# Install dependency production saja
RUN npm install --omit=dev

# Copy seluruh source code
COPY . .

# Port yang dipakai aplikasi
EXPOSE 3000

# Perintah menjalankan aplikasi
CMD ["node", "src/index.js"]