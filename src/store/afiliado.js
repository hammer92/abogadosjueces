import { find, map, forEach, identity } from "lodash";
import { update, onValue } from "firebase/database";
import * as dayjs from "dayjs";
import { v5 as uuidv5 } from "uuid";

import { AffiliatesRef, DbRef, uploadFile } from './firebaseconfig'

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
    createAffiliateBulk({state, dispatch }, payload) {
      forEach(payload, (datavalue) => {
        const UUID = uuidv5(datavalue["CEDULA"].toString(), MY_NAMESPACE);
        const existe = state.Affiliates[UUID]

        if(existe){
          Object.keys(existe).forEach((key) => {
            if(!datavalue.hasOwnProperty(key)){
              datavalue[key] = existe[key];
            }
          });
        }
        dispatch("createAffiliateRef", datavalue);
      });

      dispatch("deactivateAffiliates");
    },
    createAffiliateRef({ commit, state, rootGetters  }, payload) {
      let ContractNumber = rootGetters['config/AffiliateContractNumber']
      const AffiliatedDefault = rootGetters['config/AffiliatedDefault']

      console.log("payload",payload)
      if (payload["CEDULA"]) payload["CEDULA"] = parseInt(payload["CEDULA"]);
      
      if (payload["TELEFONO"])
        payload["TELEFONO"] = parseInt(payload["TELEFONO"]);
     
        payload["UPDATE"] = now;

      //NOVEDAD
      if (!payload["NOVEDAD"]) {
        const findAffiliate = find(state.Affiliates, [
          "CEDULA",
          payload["CEDULA"],
        ]);
        payload["NOVEDAD"] = [null, undefined].includes(findAffiliate)
          ? AffiliatedDefault.AddStatus
          : AffiliatedDefault.ActiveStatus;
      }
      console.log(typeof payload.PLAN_MENSUAL)

      if([0, "0"].includes(payload["NUMERO_CONTRATO"])){
         payload["NUMERO_CONTRATO"] = ContractNumber
         ContractNumber = ContractNumber + 1      
        }

      const UUID = uuidv5(payload["CEDULA"].toString(), MY_NAMESPACE);
      

      const updatesData = {};
      updatesData[`Affiliates/${UUID}`] = payload;
      updatesData["Config/AffiliateContractNumber"] = ContractNumber;
      
      console.log(updatesData)
      
      return update(DbRef, updatesData)
    },
    statusContract({}, payload){
      const updatesData = {};
      updatesData[`Affiliates/${payload.UUID}/ESTADOCONTRATO`] = payload.status;
      console.log(updatesData)
      return update(DbRef, updatesData)
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

    uploadFile({ state, commit }, payload){
      return uploadFile(payload)
    }
  },
};
