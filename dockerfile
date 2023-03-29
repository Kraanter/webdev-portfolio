FROM node:18-alpine AS builder

COPY . .

FROM builder AS spaBuilder

WORKDIR /packages/SinglePageApplication

RUN ls -al
RUN yarn --prod
RUN yarn build 

FROM builder AS apiBuilder

WORKDIR /packages/RESTApi

RUN ls -al
RUN yarn
RUN yarn build

FROM nginx:alpine AS nginx
COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=spaBuilder ./packages/SinglePageApplication/dist /usr/share/nginx/html
COPY --from=apiBuilder ./packages/RESTApi/dist/src /usr/share/nginx/html/api

EXPOSE 80

CMD ["node", "/usr/share/nginx/html/api/index.js"]