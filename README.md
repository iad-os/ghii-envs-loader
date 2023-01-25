# GHII - ENVS LOADER

envs loader is a ghii loader. it is used to load the configurations of a nodejs application by reading the right envs that are recognized thanks to the prefix.

## How to install:

```sh
npm install @ghii/envs-loader
```

ENVS:

```env
MYAPP_APP__VERSION=0.0.1
MYAPP_APP__NAME=ghii-test
MYAPP_CONFIGS__0_URL__PATH=/test
MYAPP_CONFIGS__0_URL__LOCAL=http://localhost
MYAPP_CONFIGS__0_URL__PORT=3000
MYAPP_CONFIGS__1_URL__PATH=/user
MYAPP_CONFIGS__1_URL__LOCAL=http://myapp
MYAPP_CONFIGS__1_URL__PORT=8080
MYAPP_ENV=development
```

Configuration in yaml:

```yaml

env: development
app:
  version: "0.0.1"
  name: "ghii-test"
configs:
  url:
    - path: "/test"
      local: "http://localhost"
      port: "3000"
    - path: "/user"
      local: "http://myapp"
      port: "8080"

```

in JSON:

```json
{
  "env": "development",
  "app": {
    "version": "0.0.1",
    "name": "ghii-test"
  }
  "configs": {
    "url": [
      {
        "path": "/test",
        "local": "http://localhost",
        "port": "3000"
      },
      {
        "path": "/user",
        "local": "http://myapp",
        "port": "8080"
      }
    ]
  }
}
```

## Usage example:

```TypeScript
import ghii from '@ghii/ghii';
import envsLoader from '@ghii/envs-loader';


const options = ghii((T) =>
  T.Object({
    env: T.Union([T.Literal("development"), T.Literal("production")], {
      default: "development",
    }),
    app: T.Object(
      {
        name: T.String({ default: "test" }),
        version: T.String(),
      },
      { additionalProperties: false, default: {} }
    ),
    configs: T.Object({
      url: T.Array(
        T.Object({ local: T.String(), path: T.String(), port: T.String() })
      ),
    }),
  })
).loader(envsLoader({ envs: process.env, prefix: 'MYAPP' }));
  //Load configurations via enviroment variables with the prefix MYAPP
```

## Related

- [ghii](https://github.com/iad-os/ghii)
- [ghii-yaml-loader](https://github.com/iad-os/ghii-yaml-loader)
- [ghii-http-loader](https://github.com/iad-os/ghii-http-loader)
- [ghii-package- json-loader](https://github.com/iad-os/ghii-package-json-loader)
