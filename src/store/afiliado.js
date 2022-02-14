import { find, map, forEach } from "lodash";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, onValue } from "firebase/database";
import * as dayjs from "dayjs";
import { v5 as uuidv5 } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyC-6FopE204jTiJ7JIFw2qMDIH5qViw3zs",
  authDomain: "abogadosjueces.firebaseapp.com",
  databaseURL: "https://abogadosjueces-default-rtdb.firebaseio.com",
  projectId: "abogadosjueces",
  storageBucket: "abogadosjueces.appspot.com",
  messagingSenderId: "310826167969",
  appId: "1:310826167969:web:c59b339c61f8c6fe1d8ae0",
  measurementId: "G-NS6DZVFKHQ",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
// const AffiliatesRef = ref(db, 'Affiliates')
const Affiliates = "Affiliates";
const AffiliatesRef = ref(db, Affiliates);
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

      const UUID = uuidv5(payload["CEDULA"], MY_NAMESPACE);
      return update(ref(db, `${Affiliates}/${UUID}`), payload).then(() => {
        commit("addAffiliate", { data: payload, key: payload["CEDULA"] });
      });
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
