FROM node:14-alpine
WORKDIR /opt/app
ADD package.json package.json
RUN npm install
ADD . .
RUN npm run build
RUN npm prune --production
EXPOSE 3000
CMD ["node", "./dist/src/main.js"]