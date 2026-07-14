FROM node:lts
WORKDIR /property-pulse-web
COPY .next/standalone/. .
COPY .next/static/. ./.next/static/
EXPOSE 3000
CMD ["node", "server.js"]