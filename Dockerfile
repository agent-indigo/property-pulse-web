FROM node:latest
WORKDIR /property-pulse
COPY . .
RUN npm i --production
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]