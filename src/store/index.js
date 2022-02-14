import { store } from "quasar/wrappers";
import { createStore } from "vuex";

import afiliado from "./afiliado";
import config from "./config";

export default store(function () {
  return createStore({
    modules: {
      afiliado,
      config,
    },
    strict: process.env.DEBUGGING,
  });
});
