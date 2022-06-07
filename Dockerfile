# syntax=docker/dockerfile:1
FROM node:16-alpine AS build

WORKDIR /src

# Copy source
COPY . .

# Install Dependencies
RUN yarn install 

# Build
RUN yarn build


FROM node:16-alpine AS runtime
WORKDIR /srv

# Copy build output
COPY --from=build ["/src/dist", "./dist"]

# Copy server files
COPY ["staging-server.cjs", "package.json", "./"]

# Install runtime dependencies
RUN npm install --only=prod

EXPOSE 3000

# Run server
CMD ["npm", "start"]