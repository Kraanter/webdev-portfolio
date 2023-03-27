FROM node:18-alpine AS builder

WORKDIR /

COPY . .

RUN yarn
RUN yarn lerna bootstrap
RUN yarn lerna run build

FROM nginx:alpine AS nginx
COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder ./packages/SinglePageApplication/dist /usr/share/nginx/html
COPY --from=builder ./packages/RESTApi/dist/src /usr/share/nginx/html/api

RUN sudo apt install chromium-browser

EXPOSE 80

CMD ["node", "PUPPETEER_SKIP_DOWNLOAD", "/usr/share/nginx/html/api/index.js"]
