FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY engines/go/go.mod .
COPY engines/go .
RUN go build -o /app/triangle-solver ./cmd/solver

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/triangle-solver .
ENTRYPOINT ["./triangle-solver"]
