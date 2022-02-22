import { boot } from "quasar/wrappers";
import { VueReCaptcha } from "vue-recaptcha-v3";

export default boot(({ app }) => {
  app.use(VueReCaptcha, {
    siteKey: "6Le3q5UeAAAAAMiXUPADQXDC20M8_ikMcd3elV3k",
  });
});
