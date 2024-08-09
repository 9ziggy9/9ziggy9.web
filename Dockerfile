FROM golang:1.22.5 AS go-builder

WORKDIR /app

COPY go.mod ./

RUN go mod download

COPY . .
RUN go build -o main .

FROM node:18 AS ts-builder

WORKDIR /app

COPY public/package.json public/package-lock.json ./

RUN npm install

COPY public/ .

RUN npm run build

FROM debian:bookworm-slim

COPY --from=go-builder /app/main /app/main

COPY --from=ts-builder /app/dist /app/public/dist

COPY .env /app/.env

WORKDIR /app

EXPOSE 9001

CMD ["/app/main"]
