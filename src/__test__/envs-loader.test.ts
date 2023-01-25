import { defaultBuildJsonPath, envsLoader } from '../envs-loader';

describe('Ghii Envs Loader', () => {
  it('export a function', () => {
    expect(typeof envsLoader).toBe('function');
  });

  describe('to create a loader', () => {
    it('create a file loader from env', async () => {
      const envs = {
        MYAPP_NAME__APP_VERSION: '0.0.1',
        MYAPP_CONFIGS__URL__PATH: '/test',
        MYAPP_CONFIGS__URL__LOCAL: 'http://localhost',
        MYAPP_CONFIGS__URL__PORT: '3000',
        MYAPP_ENV: 'development',
      };
      const envsLoaderLoader = envsLoader({ envs, prefix: 'MYAPP' });
      expect(typeof envsLoaderLoader).toBe('function');
    });
    it('empty envs', async () => {
      expect(await envsLoader({ envs: {}, prefix: 'MYAPP' })()).toStrictEqual({});
    });
    it('no match env', async () => {
      expect(await envsLoader({ envs: {}, prefix: 'MYAPP' })()).toStrictEqual({});
    });
    it('env no matching regex', async () => {
      const envs = {
        TEST: 'testttttt',
        TEST990__Q: '3000',
        TEST__F_3A: 'true',
        TEST__33: 'T453S',
      };
      expect(await envsLoader({ envs, prefix: 'MYPREFIX' })()).toStrictEqual({});
    });
    it('check version property configs', async () => {
      const envs = {
        MYAPP_NAME__APP_VERSION: '0.0.1',
        MYAPP_CONFIGS__URL__PATH: '/test',
        MYAPP_CONFIGS__URL__LOCAL: 'http://localhost',
        MYAPP_CONFIGS__URL__PORT: '3000',
        MYAPP_ENV: 'development',
      };
      const configs = (await envsLoader({ envs, prefix: 'MYAPP' })()) as {
        env: 'development' | 'production';
        name: {
          appVersion: string;
        };
        configs: {
          url: { local: string; path: string };
        };
      };

      expect(configs.name.appVersion).toBe('0.0.1');
    });
    it('check env property configs', async () => {
      const envs = {
        MYAPP_NAME__APP_VERSION: '0.0.1',
        MYAPP_CONFIGS__URL__PATH: '/test',
        MYAPP_CONFIGS__URL__LOCAL: 'http://localhost',
        MYAPP_CONFIGS__URL__PORT: '3000',
        MYAPP_ENV: 'development',
      };
      const configs = (await envsLoader({ envs, prefix: 'MYAPP' })()) as {
        env: 'development' | 'production';
        name: {
          appVersion: string;
        };
        configs: {
          url: { local: string; path: string };
        };
      };

      expect(configs.env).toBe('development');
    });
    it('matching final object', async () => {
      const envs = {
        MYAPP_NAME__APP_VERSION: '0.0.1',
        MYAPP_CONFIGS__URL__PATH: '/test',
        MYAPP_CONFIGS__URL__LOCAL: 'http://localhost',
        MYAPP_CONFIGS__URL__PORT: '3000',
        MYAPP_ENV: 'development',
      };
      const configs = (await envsLoader({ envs, prefix: 'MYAPP' })()) as {
        env: 'development' | 'production';
        name: {
          appVersion: string;
        };
        configs: {
          url: { local: string; path: string };
        };
      };

      expect(configs).toMatchObject({
        env: 'development',
        name: {
          appVersion: '0.0.1',
        },
        configs: {
          url: { local: 'http://localhost', path: '/test' },
        },
      });
    });
    it('matching final object with array', async () => {
      const envs = {
        MYAPP_NAME__APP_VERSION: '0.0.1',
        MYAPP_CONFIGS__0_URL__PATH: '/test',
        MYAPP_CONFIGS__0_URL__LOCAL: 'http://localhost',
        MYAPP_CONFIGS__0_URL__PORT: '3000',
        MYAPP_CONFIGS__1_URL__PATH: '/user',
        MYAPP_CONFIGS__1_URL__LOCAL: 'http://myapp',
        MYAPP_CONFIGS__1_URL__PORT: '8080',
        MYAPP_ENV: 'development',
      };
      const configs = (await envsLoader({ envs, prefix: 'MYAPP' })()) as {
        env: 'development' | 'production';
        name: {
          appVersion: string;
        };
        configs: {
          url: { local: string; path: string }[];
        };
      };

      expect(configs).toMatchObject({
        env: 'development',
        name: {
          appVersion: '0.0.1',
        },
        configs: {
          url: [
            { local: 'http://localhost', path: '/test', port: '3000' },
            { local: 'http://myapp', path: '/user', port: '8080' },
          ],
        },
      });
    });
    it('matching final object with array index 0-6', async () => {
      const envs = {
        MYAPP_NAME__APP_VERSION: '0.0.1',
        MYAPP_CONFIGS__0_URL__PATH: '/test',
        MYAPP_CONFIGS__0_URL__LOCAL: 'http://localhost',
        MYAPP_CONFIGS__0_URL__PORT: '3000',
        MYAPP_CONFIGS__6_URL__PATH: '/user',
        MYAPP_CONFIGS__6_URL__LOCAL: 'http://myapp',
        MYAPP_CONFIGS__6_URL__PORT: '8080',
        MYAPP_ENV: 'development',
      };
      const configs = (await envsLoader({ envs, prefix: 'MYAPP' })()) as {
        env: 'development' | 'production';
        name: {
          appVersion: string;
        };
        configs: {
          url: { local: string; path: string }[];
        };
      };

      expect(configs).toMatchObject({
        env: 'development',
        name: {
          appVersion: '0.0.1',
        },
        configs: {
          url: [
            { local: 'http://localhost', path: '/test', port: '3000' },
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            { local: 'http://myapp', path: '/user', port: '8080' },
          ],
        },
      });
    });

    it('matching final object with array length 101', async () => {
      const envs = {
        MYAPP_NAME__APP_VERSION: '0.0.1',
        MYAPP_CONFIGS__0_URL__PATH: '/test',
        MYAPP_CONFIGS__0_URL__LOCAL: 'http://localhost',
        MYAPP_CONFIGS__0_URL__PORT: '3000',
        MYAPP_CONFIGS__100_URL__PATH: '/user',
        MYAPP_CONFIGS__100_URL__LOCAL: 'http://myapp',
        MYAPP_CONFIGS__100_URL__PORT: '8080',
        MYAPP_ENV: 'development',
      };
      const configs = (await envsLoader({ envs, prefix: 'MYAPP' })()) as {
        env: 'development' | 'production';
        name: {
          appVersion: string;
        };
        configs: {
          url: { local: string; path: string }[];
        };
      };

      expect(configs.configs.url.length).toBe(101);
    });
    it('matching final object with array length 101', async () => {
      const envs = {
        MYAPP_NAME__APP_VERSION: '0.0.1',
        MYAPP_CONFIGS__0_URL__PATH: '/test',
        MYAPP_CONFIGS__0_URL__LOCAL: 'http://localhost',
        MYAPP_CONFIGS__0_URL__PORT: '3000',
        MYAPP_CONFIGS__100_URL__PATH: '/user',
        MYAPP_CONFIGS__100_URL__LOCAL: 'http://myapp',
        MYAPP_CONFIGS__100_URL__PORT: '8080',
        MYAPP_ENV: 'development',
      };
      const configs = (await envsLoader({ envs, prefix: 'MYAPP', buildJsonPath: defaultBuildJsonPath })()) as {
        env: 'development' | 'production';
        name: {
          appVersion: string;
        };
        configs: {
          url: { local: string; path: string }[];
        };
      };

      expect(configs.configs.url.length).toBe(101);
    });
    it('matching final object with array index', async () => {
      const envs = {
        MYAPP_NAME__APP_VERSION: '0.0.1',
        MYAPP_CONFIGS__0_URL__PATH: '/test',
        MYAPP_CONFIGS__0_URL__LOCAL: 'http://localhost',
        MYAPP_CONFIGS__0_URL__PORT: '3000',
        MYAPP_CONFIGS__9_URL__PATH: '/user',
        MYAPP_CONFIGS__9_URL__LOCAL: 'http://myapp',
        MYAPP_CONFIGS__9_URL__PORT: '8080',
        MYAPP_ENV: 'development',
      };
      const configs = (await envsLoader({ envs, prefix: 'MYAPP' })()) as {
        env: 'development' | 'production';
        name: {
          appVersion: string;
        };
        configs: {
          url: { local: string; path: string }[];
        };
      };

      expect(configs.configs.url[5]).toBeUndefined();
      expect(configs.configs.url[6]).toBeUndefined();
      expect(configs.configs.url[7]).toBeUndefined();
      expect(configs.configs.url[8]).toBeUndefined();
    });
    it('prefix with one underscore', async () => {
      const envs = {
        MY_APP_APP__VERSION: '0.0.1',
        MY_APP_APP__NAME: 'ghii-test',
        MY_APP_ENV: 'development',
      };
      const configs = await envsLoader({ envs, prefix: 'MY_APP' })();
      expect(configs).toMatchObject({ app: { version: '0.0.1', name: 'ghii-test' }, env: 'development' });
    });
    it('prefix with more underscore', async () => {
      const envs = {
        MY_APP_PREFIX_APP__VERSION: '0.0.1',
        MY_APP_PREFIX_APP__NAME: 'ghii-test',
        MY_APP_PREFIX_ENV: 'development',
      };
      const configs = await envsLoader({ envs, prefix: 'MY_APP_PREFIX' })();
      expect(configs).toMatchObject({ app: { version: '0.0.1', name: 'ghii-test' }, env: 'development' });
    });
    it('prefix with double underscore', async () => {
      const envs = {
        MY__PREFIX_APP__VERSION: '0.0.1',
        MY__PREFIX_APP__NAME: 'ghii-test',
        MY__PREFIX_ENV: 'development',
      };
      const configs = await envsLoader({ envs, prefix: 'MY__PREFIX' })();
      expect(configs).toMatchObject({ app: { version: '0.0.1', name: 'ghii-test' }, env: 'development' });
    });
  });

  describe('to get object path', () => {
    it('object simple path', () => {
      const groups = {
        vl_1_i: undefined,
        vl_1: 'HI_IAM_ENV',
        vl_2_i: undefined,
        vl_2: undefined,
        vl_3_i: undefined,
        vl_3: undefined,
        vl_4_i: undefined,
        vl_4: undefined,
        vl_5_i: undefined,
        vl_5: undefined,
      };
      expect(defaultBuildJsonPath(groups)).toBe('hiIamEnv');
    });
    it('empty gropus', () => {
      expect(defaultBuildJsonPath(undefined)).toBe('');
    });
    it('more gropus', () => {
      const groups = {
        vl_1_i: undefined,
        vl_1: 'CONF_APP',
        vl_2_i: undefined,
        vl_2: 'LOGGER',
        vl_3_i: undefined,
        vl_3: 'LEVEL',
        vl_4_i: undefined,
        vl_4: undefined,
        vl_5_i: undefined,
        vl_5: undefined,
      };
      expect(defaultBuildJsonPath(groups)).toBe('confApp.logger.level');
    });
    it('more gropus', () => {
      const groups = {
        vl_1_i: '0',
        vl_1: 'CONF_APP',
        vl_2_i: undefined,
        vl_2: 'LOGGER',
        vl_3_i: undefined,
        vl_3: 'LEVEL',
        vl_4_i: undefined,
        vl_4: undefined,
        vl_5_i: undefined,
        vl_5: undefined,
      };
      expect(defaultBuildJsonPath(groups)).toBe('confApp[0].logger.level');
    });
  });
});
