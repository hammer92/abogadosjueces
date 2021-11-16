import {findIndex, find, map, forEach} from 'lodash'
import {initializeApp} from "firebase/app";
import {getDatabase, ref, update, onChildAdded, onChildChanged, onChildRemoved, onValue} from "firebase/database";
import * as dayjs from 'dayjs'

const firebaseConfig = {
  apiKey: "AIzaSyC-6FopE204jTiJ7JIFw2qMDIH5qViw3zs",
  authDomain: "abogadosjueces.firebaseapp.com",
  databaseURL: "https://abogadosjueces-default-rtdb.firebaseio.com",
  projectId: "abogadosjueces",
  storageBucket: "abogadosjueces.appspot.com",
  messagingSenderId: "310826167969",
  appId: "1:310826167969:web:c59b339c61f8c6fe1d8ae0",
  measurementId: "G-NS6DZVFKHQ"
};

const app = initializeApp(firebaseConfig)
const db = getDatabase(app);
// const AffiliatesRef = ref(db, 'Affiliates')
const Affiliates = "Affiliates"
const AffiliatesRef = ref(db, Affiliates)
const now = dayjs().format('YYYY-MM-DD')


export default {
  namespaced: true,
  state: {
    Affiliates: [],
    loading:true
  },

  getters: {
    all: (state) => state.Affiliates || [],
    loading: (state) => state.loading
  },

  mutations: {
    isLoading: (state) => {
      state.loading = !state.loading
    },
    addAffiliate: (state, {data, key}) => {
      const index = findIndex(state.Affiliates, ['CEDULA', key])
      if (index < 0) {
        state.Affiliates.push(data)
      } else {
        state.Affiliates[index] = data
      }
    }
  },

  actions: {
    deactivateAffiliates({state, dispatch}) {
      map(state.Affiliates, (find) => {
        let dayUpdate = dayjs(find['UPDATE']).isBefore(now, 'day')
        if (dayUpdate) {
          const deactivate = {...find}
          deactivate['NOVEDAD'] = "No Renovado"
          dispatch("createAffiliateRef", deactivate)
        }
      })
    },
    createAffiliateBulk({dispatch}, payload) {
      forEach(payload, (datavalue) => {
        dispatch("createAffiliateRef", datavalue);
      });

      dispatch("deactivateAffiliates");
    },
    createAffiliateRef({commit, state}, payload) {
      if (payload['CEDULA']) payload['CEDULA'] = parseInt(payload['CEDULA'])
      if (payload['TELEFONO']) payload['TELEFONO'] = parseInt(payload['TELEFONO'])
      if (payload['VALOR_MENSUAL']) payload['VALOR_MENSUAL'] = parseInt(payload['VALOR_MENSUAL'])
      payload['UPDATE'] = now

      //NOVEDAD
      if (!payload['NOVEDAD']) {
        const findAffiliate = find(state.Affiliates, ['CEDULA', payload['CEDULA']]);
        payload['NOVEDAD'] = ([null, undefined].includes(findAffiliate)) ? "Affiliate" : "Renovado"
      }

      return update(ref(db, `${Affiliates}/` + payload['CEDULA']), payload).then(() => {
        commit('addAffiliate', {data: payload, key: payload['CEDULA']})
      });
    },
    bindAffiliateRef({commit}) {
      onValue(AffiliatesRef, (snapshot) => {
        forEach(snapshot.val(), (data, key) => {
          commit('addAffiliate', {data, key})
        });
        commit('isLoading')
      }, {
        onlyOnce: true
      })
    },
  },
}
