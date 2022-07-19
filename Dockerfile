FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production --ignore-scripts
RUN npm rebuild bcrypt
RUN npm rebuild sharp

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]