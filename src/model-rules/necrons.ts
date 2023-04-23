import type { Unit } from '@/types/unit';

export default {
  'Triarch Praetorian': (warband: Unit[], model: Unit) => {
    if (warband.some(({ name }) => name === 'Triarch Judicator')) {
      return { 
        ...model,
        roles: { 
          ...model.roles,
          Core: { wargearList: null },
        }
      };
    }

    return model;
  },
};
