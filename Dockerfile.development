FROM node:22-alpine as base
RUN apk add --no-cache g++ make py3-pip libc6-compat
RUN apk add --no-cache tzdata
ENV TZ=Asia/Bangkok
#RUN cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime
#RUN echo $TZ > /etc/timezone && dpkg-reconfigure tzdata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app
COPY package*.json ./
EXPOSE 3000

FROM base as builder
WORKDIR /app
COPY . .

# Public build-time environment variables
ARG NODE_ENV
ARG NEXT_PUBLIC_LIFE_ID
ARG NEXT_PUBLIC_API_AUTHORIZATION
ARG NEXT_PUBLIC_API_BASE_URL

ENV NODE_ENV=$NODE_ENV
ENV NEXT_PUBLIC_LIFE_ID=$NEXT_PUBLIC_LIFE_ID
ENV NEXT_PUBLIC_API_AUTHORIZATION=$NEXT_PUBLIC_API_AUTHORIZATION
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

RUN npm run build


FROM base as production
WORKDIR /app

ENV NODE_ENV=production
RUN npm ci

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs


COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

CMD npm start

FROM base as dev
ENV NODE_ENV=development
RUN npm install 
COPY . .
CMD npm run dev