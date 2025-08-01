FROM node:24-alpine

WORKDIR /sga_backend

COPY package.json yarn.lock ./
# COPY env ./.env
RUN yarn install --frozen-lockfile

COPY . .

RUN ["yarn", "generate"]
# RUN ["yarn", "migrate"]

EXPOSE 4003

CMD ["yarn", "start"]
