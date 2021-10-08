# GHII - ENVS LOADER
## How to install:
```sh
npm install @ghii/envs-loader
```
ENVS:
```env
MYAPP_NAME__APP_VERSION=0.0.1
MYAPP_CONFIGS__0_URL__PATH: '/test',
MYAPP_CONFIGS__0_URL__LOCAL: 'http://localhost',
MYAPP_CONFIGS__0_URL__PORT: '3000',
MYAPP_CONFIGS__1_URL__PATH: '/user',
MYAPP_CONFIGS__1_URL__LOCAL: 'http://myapp',
MYAPP_CONFIGS__1_URL__PORT: '8080',
MYAPP_ENV=development
```
Configuration in yaml:
```yaml

env: development
name:
  appVersion: "0.0.1"
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
  "name": {
    "appVersion": "0.0.1"
  },
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


const options = ghii<{
  env: 'development' | 'production';
  name: {
    appVersion: string;
  };
  configs: {
    url: { local: string; path: string }[];
  };
}>()
  .section('env', {
    validator: joi => joi.string().allow('development', 'production'),
    defaults: 'production',
  })
  .section('name', {
    defaults: {
      appVersion: '0.0.1',
    },
    validator: joi =>
      joi.object({
        appVersion: joi.string(),
      }),
  })
  .section('configs', {
    validator: joi =>
      joi.object({
        url: joi.array().items(
          joi.object({
            local: joi.string().required(),
            path: joi.string().required(),
            port: joi.string().required(),
          })
        ),
      }),
  })
  .loader(envsLoader({ envs: process.env, prefix: 'MYAPP' }));
  //Load configurations via enviroment variables with the prefix MYAPP
```