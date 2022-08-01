FROM node:18.7-alpine
RUN addgroup -S group && adduser -S user -G group
USER user

WORKDIR /app
ADD index.js .
ENTRYPOINT ["node", "index.js"]