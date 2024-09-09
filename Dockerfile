FROM node:20.16-alpine AS sk-build
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm install --force
RUN npm run build

FROM node:20.16-alpine
WORKDIR /usr/src/app

COPY --from=sk-build /usr/src/app/package.json /usr/src/app/package.json
COPY --from=sk-build /usr/src/app/package-lock.json /usr/src/app/package-lock.json
RUN npm i --only=production

COPY --from=sk-build /usr/src/app/build /usr/src/app/build
COPY --from=sk-build /usr/src/app/server /usr/src/app/server

EXPOSE 3000
CMD ["npm", "run", "serveProd"]