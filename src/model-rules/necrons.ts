import type { Unit } from '@/types/unit';

export default {
  'Triarch Praetorian': (warband: Unit[], model: Unit) => {
    if (!warband.some(({ name }) => name === 'Triarch Judicator')) {
      const roles = Object.entries(model.roles).reduce((r, [k, v]) => {
        if (k !== 'Core') return { ...r, [k]: v };
        return r;
      }, {});

      return {
        ...model,
        roles,
      };
    }

    return model;
  },
};
