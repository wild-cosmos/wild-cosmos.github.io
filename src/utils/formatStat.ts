import isArray from 'lodash/isArray';
import isNil from 'lodash/isNil';

export default function formatStat(stat: number | number[] | undefined, suffix = '') : string {
  if (isNil(stat)) return '-';
  if (isArray(stat)) return stat.map((n) => formatStat(n, suffix)).join('/');
  return `${stat}${suffix}`;
}
