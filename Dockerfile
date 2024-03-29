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

# Metadata
WORKDIR /srv

HEALTHCHECK --interval=1m --timeout=3s CMD curl -f https://127.0.0.1/ || exit 1

# Copy yarn metadata
COPY .yarnrc.yml yarn.lock ./
COPY .yarn ./.yarn

# Install yarn workspace plugin
RUN yarn plugin import workspace-tools

# Install runtime dependencies
RUN yarn workspaces focus --production -A

# Delete unused files
RUN rm -r .yarn .yarnrc.yml yarn.lock

# Copy build output
COPY --from=build /src/dist ./dist


# Run server
CMD ["yarn", "start"]
