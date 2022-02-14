import { find, map, forEach } from "lodash";
import { update, onValue } from "firebase/database";
import * as dayjs from "dayjs";
import { v5 as uuidv5 } from "uuid";

import { AffiliatesRef, AffiliatesEdit } from './firebaseconfig'

const now = dayjs().format("YYYY-MM-DD");
const MY_NAMESPACE = "1b671a64-40d5-491e-99b0-da01ff1f3341";

export default {
  namespaced: true,
  state: {
    Affiliates: {},
    loading: false,
  },

  getters: {
    all: (state) => Object.keys(state.Affiliates).map(key => ({ key, ...state.Affiliates[key] })) || [],
    loading: (state) => state.loading,
  },

  mutations: {
    isLoading: (state) => {
      state.loading = !state.loading;
    },
    updateAffiliate(state, data) {
      state.Affiliates = data || {};
    },
  },

  actions: {
    deactivateAffiliates({ state, dispatch }) {
      map(state.Affiliates, (find) => {
        let dayUpdate = dayjs(find["UPDATE"]).isBefore(now, "day");
        if (dayUpdate) {
          const deactivate = { ...find };
          deactivate["NOVEDAD"] = "No Renovado";
          dispatch("createAffiliateRef", deactivate);
        }
      });
    },
    createAffiliateBulk({ dispatch }, payload) {
      forEach(payload, (datavalue) => {
        dispatch("createAffiliateRef", datavalue);
      });

      dispatch("deactivateAffiliates");
    },
    createAffiliateRef({ commit, state }, payload) {
      if (payload["CEDULA"]) payload["CEDULA"] = parseInt(payload["CEDULA"]);
      if (payload["TELEFONO"])
        payload["TELEFONO"] = parseInt(payload["TELEFONO"]);
      if (payload["VALOR_MENSUAL"])
        payload["VALOR_MENSUAL"] = parseInt(payload["VALOR_MENSUAL"]);
      payload["UPDATE"] = now;

      //NOVEDAD
      if (!payload["NOVEDAD"]) {
        const findAffiliate = find(state.Affiliates, [
          "CEDULA",
          payload["CEDULA"],
        ]);
        payload["NOVEDAD"] = [null, undefined].includes(findAffiliate)
          ? "Affiliate"
          : "Renovado";
      }

      const UUID = uuidv5(payload["CEDULA"].toString(), MY_NAMESPACE);
      return update(AffiliatesEdit(UUID), payload)
    },
    bindAffiliateRef({ state, commit }) {
      commit("isLoading");
      onValue(
        AffiliatesRef,
        (snapshot) => {
          commit("updateAffiliate", snapshot.val());
          commit("isLoading");
        },
        {
          //onlyOnce: true,
        }
      );
    },
  },
};
