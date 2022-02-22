import { update, onValue } from "firebase/database";

import { ConfigRef } from "./firebaseconfig";

export default {
  namespaced: true,
  state: {
    Config: {
      AffiliateContractNumber: 0,
      AffiliatedFile: {},
      AffiliatedPlans: {},
      AffiliatedState: {},
    },
  },

  getters: {
    AffiliateContractNumber: (state) => state.Config.AffiliateContractNumber,
    AffiliatedDefault: (state) => state.Config.AffiliatedDefault,
    AffiliatedPlans: (state) => state.Config.AffiliatedPlans,
    AffiliatedState: (state) => state.Config.AffiliatedState,
  },

  mutations: {
    updateConfig(state, data) {
      state.Config = data || state.Config;
    },
    addAffiliateContractNumber (state, data){
      state.Config.AffiliateContractNumber += 1 
    }
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
