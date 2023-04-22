import type { Unit } from '@/types/unit';

const isLeader = ({ role }: Unit) => role === 'Leader';
const hasFlying = ({ abilities }: Unit) => abilities.includes('Flying');

export default {
  'Tyranid Warrior': (warband: Unit[], model: Unit) => {
    if (warband.filter(isLeader).some(({ name }) => (name === 'Tyranid Warrior' || name === 'Tyranid Shrike'))) {
      const newRoles = { ...model.roles, Core: {} };
      return {
        ...model,
        roles: newRoles,
      };
    }
    return model;
  },
  'Genestealer': (warband: Unit[], model: Unit) => {
    if (warband.filter(isLeader).some(({ name }) => (name === 'Genestealer' || name === 'Broodlord'))) {
      const newRoles = { ...model.roles, Core: {} };
      return {
        ...model,
        roles: newRoles,
      };
    }
    return model;
  },
  'Gargoyle': (warband: Unit[], model: Unit) => {
    if (warband.filter(isLeader).some(hasFlying)) {
      return {
        ...model,
        roles: model.roles.concat(['Core']),
      };
    }
    return model;
  },
};
