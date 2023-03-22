import type { SquadUnit, Wargear } from '@/types/unit';
import { isArray } from 'lodash-es';

export default {
  'Quantum Shielding': (model: SquadUnit, item: Wargear) => {
    // Quantum Shielding: use the second cost if the model already has an invulnerable save
    if (isArray(model.df)) {
      return {
        ...item,
        cost: 2,
      };
    }

    return item;
  },
};
