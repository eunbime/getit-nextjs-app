FROM node:18

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY .env .env

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]