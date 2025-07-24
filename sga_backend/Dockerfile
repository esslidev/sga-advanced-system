FROM node:24-alpine

WORKDIR /sga_backend

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn generate

EXPOSE 4003

CMD ["yarn", "start"]
