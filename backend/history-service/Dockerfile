# LTS version
FROM node:18

WORKDIR /usr/src/history

COPY package*.json ./

RUN npm install

# Uncomment following for production
# RUN npm ci --omit=dev

COPY . .

EXPOSE 8004

CMD ["node", "index.js"]
