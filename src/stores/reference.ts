import { defineStore } from 'pinia';
import { mande } from 'mande';
import type { Rule } from '@/types/reference';

interface State {
  searchTerms: string[],
  rules: Rule[]
}

const api = mande('/');

// eslint-disable-next-line import/prefer-default-export
export const useReferenceStore = defineStore('reference', {
  state: (): State => ({
    searchTerms: [],
    rules: [],
  }),

  getters: {
    searchRules: ({ rules }: State) => (queryString: string): Rule[] => {
      const searchTerms = queryString.split(' ').filter((s) => s > '');
      const match = new RegExp(searchTerms.map((s) => `${s}`).join('|'), 'i');

      return rules.filter(({ title }) => match.test(title));
    },

    matchingRules: ({ searchTerms, rules }) => {
      const match = new RegExp(searchTerms.map((s) => `${s}`).join('|'), 'i');
      return rules.filter(({ title }) => match.test(title));
    },
  },

  actions: {
    setSearch(queryString: string) {
      this.searchTerms = queryString?.split(' ').filter((s) => s > '');
    },
    async initialise() {
      this.rules = await api.get<Rule[]>('core_reference.json');
    },
  },
});
