import { Loader } from '@ghii/ghii';
import { camelCase, set, toPairs } from 'lodash';

type EnvsLoaderOptions = {
  envs: NodeJS.ProcessEnv;
  prefix?: string;
  buildJsonPath?: (groups: { [key: string]: string | undefined } | undefined) => string;
};

export const defaultBuildJsonPath: Required<EnvsLoaderOptions>['buildJsonPath'] = groups => {
  return toPairs(groups)
    .sort()
    .reduce((acc, e, i) => {
      if (i % 2 === 0) {
        acc[Math.trunc(i / 2)] = [e[1], undefined];
        return acc;
      }
      acc[Math.trunc(i / 2)] = [acc[Math.trunc(i / 2)][0], e[1]];
      return acc;
    }, [] as [string | undefined, string | undefined | never][])
    .filter((x): x is [string, string | undefined] => {
      return x[0] !== undefined;
    })
    .map(([name, index]) => `${camelCase(name.toLowerCase())}${index !== undefined ? `[${index}]` : ''}`)
    .join('.');
};

export function envsLoader({ envs, prefix, buildJsonPath }: EnvsLoaderOptions): Loader {
  const toJsonPath = buildJsonPath ?? defaultBuildJsonPath;
  const regex =
    /(?:^[A-Z0-9]+_)(?:(?<vl_1_i>[0-9]+)_)?(?<vl_1>[A-Z0-9]+(?:_[A-Z0-9]+)*)(?:__(?:(?<vl_2_i>[0-9]*)_)?(?<vl_2>[A-Z0-9]+(?:_[A-Z0-9]+)*))?(?:__(?:(?<vl_3_i>[0-9]*)_)?(?<vl_3>[A-Z0-9]+(?:_[A-Z0-9]+)*))?(?:__(?:(?<vl_4_i>[0-9]*)_)?(?<vl_4>[A-Z0-9]+(?:_[A-Z0-9]+)*))?(?:__(?:(?<vl_5_i>[0-9]*)_)?(?<vl_5>[A-Z0-9]+(?:_[A-Z0-9]+)*))?/;
  return async function () {
    return toPairs(envs)
      .filter(([key]) => (prefix ? key.startsWith(prefix) : true))
      .reduce((config, [str, value]) => {
        const match = regex.exec(str);
        if (match) {
          const path: string = toJsonPath(match.groups);
          set(config, path, value);
          return config;
        }
        return config;
      }, {} as { [key: string]: string | undefined });
  };
}
