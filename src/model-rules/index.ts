import necrons from './necrons';

// eslint-disable-next-line import/prefer-default-export
export const applyModelRules = (warband, model) => {
  if (model.name in necrons) {
    return necrons[model.name](warband, model);
  }

  return model;
};
