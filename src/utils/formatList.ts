import isArray from 'lodash/isArray';

export default (list: string | string[], delimiter = ', ') : string => (isArray(list) ? list : [list]).join(delimiter);
