import { isArray, isNil } from 'lodash-es';

export default function formatStat(stat: number | number[] | undefined, suffix = '') : string {
  if (isNil(stat)) return '-';
  if (isArray(stat)) return stat.map((n) => formatStat(n, suffix)).join('/');
  return `${stat}${suffix}`;
}
