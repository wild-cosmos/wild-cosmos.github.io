import { isArray } from 'lodash-es';

export default (list: string | string[], delimiter = ', ') : string => (isArray(list) ? list : [list]).join(delimiter);
