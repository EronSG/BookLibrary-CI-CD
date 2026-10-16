FROM node:22.20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts && npm cache clean --force
COPY server.js ./server.js
ENV NODE_ENV=production PORT=3002
EXPOSE 3002
USER node
CMD ["node", "server.js"]
