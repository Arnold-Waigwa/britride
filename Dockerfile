FROM node:20-alpine
WORKDIR /app
RUN addgroup app && adduser app
COPY package*.json .
RUN npm install
COPY . .
CMD [ "npm", "start" ]
ENV DATABASE_URL="postgresql://arnoldwaigwa@localhost:5432/britride"
EXPOSE 3000