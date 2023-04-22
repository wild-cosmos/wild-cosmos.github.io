import type { Warband } from '@/types/warband';
import type { Unit } from '@/types/unit';
import necrons from './necrons';
import tyranids from './tyranids';

const modelRules: { [key:string]: Function } = { ...necrons, ...tyranids };

// eslint-disable-next-line import/prefer-default-export
export const applyModelRules = (warband: Warband, model: Unit) => {
  if (model.name in modelRules) {
    return modelRules[model.name](warband, model);
  }

  return model;
};
