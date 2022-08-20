FROM node:18-alpine

WORKDIR /app
ADD index.js .
ENTRYPOINT ["node", "index.js"]
