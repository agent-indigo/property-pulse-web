FROM node:latest
WORKDIR /property-pulse-web
COPY .next/standalone/. .
EXPOSE 3000
CMD ["node", "server.js"]