# MUKMUK

Mukmuk is an easy to use solution for json mocks ready to be started as a docker container in any project.
It's a wrapper over dyson and fake-json-schema that let devs to build mock servers easily.

## Functionalities

- file-based routing
- random response based on jsonschema
- request validation (anticorruption layer?)
- static-data response as default
- fallback to non-mocked real services

## Usage

#### Standalone

- clone
- put your mocks in the mocks folder
- `npm i`
- `npm start`

mukmuk will serve on port 3000 by default (it can be changed in the package.json config)

#### Docker compose

- create a folder and fill it with your mock jsons
- add to docker-compose.yml
```
version: "3.5"
services:
  mukmuk:
    build: https://github.com/PRDeving/mukmuk.git
    volumes:
      - ./mocks:/mukmuk/mocks # load local /mocks folder as volume for container /mukmuk/mocks folder
    environment:
      - fallback=https://pre.myserver.com:1234 # Optional fallback functionality, explained below
    ports:
      - 3000:3000
```

## Directory structure

API paths are represented with the directory structure by using a file-system based router just [like nextjs does](https://nextjs.org/docs/routing/introduction)

the root for the router is the mock directory inside the src folder, this can be changed with the mockRoot property in the package.json config (route is relative to /api/mainn.js).

Each level in the structure can have either more directories (sub routes) or .json files representing endpoints

The json files prefix is used as the endpoint name, example:

```
+mocks
|-health.data.json
|+hello
||-schemadata.response.json
||-staticdata.response.json
```

this structure will register 3 endpoints:

- /health

- /hello/schemadata

- /hello/staticdata

## Endpoints

Endpoint configuration are expresed in json files, each endpoint can have 3 different json files:

- **<endpoint_name>.data.json** (Optional)

This is a custom json data file, if an endpoint has a .data.json file, every request will recieve the content of said file as response.
Static data is the default behaivour, .response.json will be ignored for endpoints that already have a .data.json

- **<endpoint_name>.response.json** (Optional)

This is a JSONSchema file that defines the endpoint response, if there's no .data.json file, an automatic random response will be generated from the json schema when requests occurs

- **<endpoint_name>.request.json (Optional)** (NOT IMPLEMENTED YET)

This is a JSONSchema file that defines the endpoint request, if the mockserver receives a request that doesnt comply with it, a 400 error will be send instead any data


** Either .data.json or .response.json files must be present or the endpoint will not be available **

## Fallbacks

A fallback can be configured so requests that are not mocked gets redirected to another service

An URL can be added as `fallback` property in the package.json config

```
"fallback": "http://pre.myservice.com:1337"
```

In docker environments a env variable `fallback` can be passed to the container on startup to set the fallback
