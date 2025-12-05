FROM alpine:latest

ARG PB_VERSION=0.22.21

RUN apk add --no-cache \
    unzip \
    ca-certificates

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# copy local migrations
COPY ./pb_migrations /pb/pb_migrations

# uncomment to copy local hooks if you have any
# COPY ./pb_hooks /pb/pb_hooks

EXPOSE 8090

# start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
