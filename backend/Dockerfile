FROM node:20-alpine

WORKDIR /app

# Copy root and service package files
COPY package*.json ./
COPY gateway/package*.json ./gateway/
COPY services/auth/package*.json ./services/auth/
COPY services/chat/package*.json ./services/chat/
COPY services/agent/package*.json ./services/agent/

# Install dependencies across all services
RUN npm install --omit=dev
RUN cd gateway && npm install --omit=dev
RUN cd services/auth && npm install --omit=dev
RUN cd services/chat && npm install --omit=dev
RUN cd services/agent && npm install --omit=dev

# Copy all source files
COPY . .

# Default environment configuration
ENV NODE_ENV=production
ENV PORT=8000
ENV AUTH_PORT=8001
ENV CHAT_PORT=8002
ENV AGENT_PORT=8003
ENV AUTH_SERVICE=http://127.0.0.1:8001
ENV CHAT_SERVICE=http://127.0.0.1:8002
ENV AGENT_SERVICE=http://127.0.0.1:8003

EXPOSE 8000

CMD ["node", "start-all.js"]
