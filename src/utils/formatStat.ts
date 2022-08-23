import isArray from 'lodash/isArray'

export default function formatStat(stat: [number, Array<number>], suffix = '') {
  if (!stat) return '-';
  if (isArray(stat)) return stat.map((n) => `${n}${suffix}`).join('/');
  return `${stat}${suffix}`;
}
