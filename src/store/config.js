import { find, map, forEach } from "lodash";
import { update, onValue } from "firebase/database";

import { ConfigRef } from "./firebaseconfig";

export default {
  namespaced: true,
  state: {
    Config: {
      AffiliatedFile: {},
      AffiliatedPlans: {},
      AffiliatedState: {},
    },
  },

  getters: {
    AffiliatedDefault: (state) => state.Config.AffiliatedDefault,
    AffiliatedPlans: (state) => state.Config.AffiliatedPlans,
    AffiliatedState: (state) => state.Config.AffiliatedState,
  },

  mutations: {
    updateConfig(state, data) {
      state.Config = data || state.Config;
    },
  },

  actions: {
    createConfigRef({}, payload) {
      return update(ConfigRef, payload);
    },
    bindConfigRef({ commit }) {
      onValue(ConfigRef, (snapshot) => {
        commit("updateConfig", snapshot.val());
      });
    },
  },
};
