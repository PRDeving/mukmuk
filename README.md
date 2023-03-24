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

- <endpoint_name>.data.json (Optional)

This is a custom json data file, if an endpoint has a .data.json file, every request will recieve the content of said file as response.

- <endpoint_name>.response.json (Optional)

This is a JSONSchema file that defines the endpoint response, if there's no .data.json file, an automatic random response will be generated from the json schema when requests occurs

- <endpoint_name>.request.json (Optional) (NOT IMPLEMENTED YET)

This is a JSONSchema file that defines the endpoint request, if the mockserver receives a request that doesnt comply with it, a 400 error will be send instead any data


** Either .data.json or .response.json files must be present or the endpoint will not be available **
