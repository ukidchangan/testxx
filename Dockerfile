FROM node:22.11.0-alpine AS base

# setup docker image to install all node packages
FROM base AS dependencies

WORKDIR /app

COPY ./app/package.json ./app/yarn.lock* ./

RUN yarn install


# setup docker image for next.js build
FROM base AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY ./app .

ENV NEXT_TELEMETRY_DISABLED=1

RUN yarn run build

# setup docker image to hold build, static and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME="0.0.0.0"

COPY --from=build /app/public ./public

RUN mkdir .next

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

CMD ["node", "server.js"]