import type { SquadUnit, Unit } from '@/types/unit';
import { isArray } from 'lodash-es';

export const validRolesForModel = (unitType: Unit) => {
  if (!unitType) return [];
  const { roles } = unitType;
  if (typeof roles === 'string') return [roles];
  if (isArray(roles)) return roles;

  const options = Object.keys(roles);
  return options;
};

export const modelRoleAndType = (unit: SquadUnit) => {
  const { role, type } = unit;
  const roleAndType: string[] = [];
  if (role) roleAndType.push(role);
  if (isArray(type)) {
    roleAndType.push(...type);
  } else {
    roleAndType.push(type);
  }
  return roleAndType;
};
