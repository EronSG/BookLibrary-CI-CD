FROM node:22.20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts && npm cache clean --force
COPY server.js ./server.js
COPY public ./public
ENV NODE_ENV=production PORT=3001
EXPOSE 3001
USER node
CMD ["node", "server.js"]
