FROM node:20.16-alpine AS sk-build
WORKDIR /usr/src/app

ARG TZ=Europe/Stockholm
ARG PUBLIC_HELLO

COPY . /usr/src/app
RUN apk --no-cache add curl tzdata
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN npm install --force
RUN npm run build

FROM node:20.16-alpine
WORKDIR /usr/src/app

ARG TZ=Europe/Stockholm
RUN apk --no-cache add curl tzdata
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY --from=sk-build /usr/src/app/package.json /usr/src/app/package.json
COPY --from=sk-build /usr/src/app/package-lock.json /usr/src/app/package-lock.json
RUN npm i --only=production

COPY --from=sk-build /usr/src/app/build /usr/src/app/build
COPY --from=sk-build /usr/src/app/server /usr/src/app/server

EXPOSE 3000
CMD ["npm", "run", "start-prod"]