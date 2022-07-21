FROM node:16 as build

COPY . /build

WORKDIR /build

RUN yarn workspace @myhill-cycling/astra-web.api install
RUN yarn workspace @myhill-cycling/astra-web.api build

# To enable ssh & remote debugging on app service change the base image to the one below
# FROM mcr.microsoft.com/azure-functions/node:4-node16-appservice
FROM mcr.microsoft.com/azure-functions/node:4-node16

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

COPY --from=build /build/api /home/site/wwwroot
