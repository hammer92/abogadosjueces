<template>
  <div class="q-pa-sm">
    <div class="row justify-center">
      <div class="col-4" v-for="(item, key) in affiliatedPlans" :key="key">
        <q-card
          class="q-ma-md cursor-pointer"
          :class="
            model.PLAN_MENSUAL.Name === item.Name
              ? 'bg-primary text-white'
              : 'basico'
          "
          @click="model.PLAN_MENSUAL = item"
        >
          <q-video
            src="https://www.youtube.com/embed/-RkQDlUV4Fc"
            style="height: 40vh"
          />

          <q-card-section>
            <div class="text-h6">{{ item.Name }}</div>
            <div class="text-subtitle2">{{ item.Value }}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            {{ item.Description }}
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row justify-center">
      <div class="col-8">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            filled
            v-model="model.NOMBRES_COMPLETO"
            label="Nombre y Apellidos *"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <q-input
            filled
            v-model="model.CEDULA"
            label="Nº Identificación C.C *"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <q-input
            filled
            v-model="model.DIRECCION"
            label="Direccion Recidencia "
            lazy-rules
          />

          <q-input
            filled
            v-model="model.EMAIL"
            label="Correo Electrónico *"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <q-input
            filled
            v-model="model.TELEFONO"
            label="Celular *"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <q-input filled v-model="model.GRADO" label="Grado " />

          <q-input
            filled
            v-model="model.PIN_PAGO"
            label="Pin Desprendible de Pago "
          />

          <div class="flex flex-center">
            <q-btn label="Submit" type="submit" color="accent" />
          </div>
        </q-form>
      </div>
    </div>
  </div>

  <!-- <div id="wrapper">
  
    <div id="main">
      <div class="inner">
        <section id="planes">
          <div class="title">
            <p>ELIGE LA MEJOR OPCIÓN</p>
          </div>
          <div class="section-planes">
            <div
              class="card-planes basico cursor-pointer"
              :class="model.PLAN_MENSUAL.Name === item.Name ? 'plan-pro' : 'basico'"
              v-for="(item, key) in affiliatedPlans"
              :key="key"
              @click="model.PLAN_MENSUAL = item"
            >
              <p>
                {{
                  model.PLAN_MENSUAL.Name === item.Name
                    ? "Plan Seleccionado"
                    : "Plan"
                }}
              </p>
              <div class="line"></div>
              <p class="valor">{{ item.Value }}</p>
              <p class="contenido">{{ item.Name }}</p>
            </div>
         <div class="card-planes plan-pro">
              <p>PLAN PRO</p>
              <div class="line"></div>
              <p class="valor">$36.600 + IVA</p>
              <p class="contenido">Asesoría Jirídica</p>
            </div> 
          </div>
        </section>
        <form id="ajaxForm" v-on:submit.prevent="onSubmit()">
          <div class="form-inputs">
            <p class="title">AFÍLIATE CON NOSOTROS</p>
            <p class="subtitle">
              Nuestro BUFETE DE ABOGADOS, cuenta con el mejor grupo de abogados,
              todos a su servicio.
            </p>
            <div class="">
              <div class="col-50">
                <label for="">Nombre y Apellidos</label>
                <input type="text" v-model="model.NOMBRES_COMPLETO" />
              </div>
              <div class="col-50">
                <label for="">Nº Identificación C.C</label>
                <input type="text" v-model="model.CEDULA" />
              </div>
              <div class="col-50">
                <label for="">Direccion Recidencia</label>
                <input type="text" v-model="model.DIRECCION" />
              </div>

              <div class="col-50">
                <label for="">Correo Electrónico</label>
                <input type="text" v-model="model.EMAIL" />
              </div>
              <div class="col-50">
                <label for="">Celular</label>
                <input type="text" v-model="model.TELEFONO" />
              </div>

              <div class="col-50">
                <label for="">Grado</label>
                <input type="text" v-model="model.GRADO" />
              </div>
              <div class="col-50">
                <label for="">Pin Desprendible de Pago</label>
                <input type="text" v-model="model.PIN_PAGO" />
              </div>

              <div class="flex-center">
                <button class="btn-yellow">Enviar</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div> -->
</template>

<script>
import { defineComponent, reactive, computed } from "vue";
import { useQuasar } from 'quasar'
import { useReCaptcha } from "vue-recaptcha-v3";

import { useStore } from "vuex";
import { get } from "lodash";
import * as dayjs from "dayjs";

const now = dayjs().format("YYYY-MM-DD");

export default defineComponent({
  name: "formPublic",
  setup() {
    const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

    const store = useStore();
    const $q = useQuasar()

    const affiliatedPlans = computed(
      () => store.getters["config/AffiliatedPlans"]
    );

    const AffiliatedDefault = computed(
      () => store.getters["config/AffiliatedDefault"]
    );

    const model = reactive({
      NOMBRES_COMPLETO: "",
      CEDULA: "",
      DIRECCION: "",
      NUMERO_CONTRATO: "0",
      ESTADOCONTRATO: 0,
      CIUDAD: "",
      TELEFONO: "",
      EMAIL: "",
      GRADO: "",
      PIN_PAGO: "",
      EMPRESA: "",
      PLAN_MENSUAL: "",
      FECHA_AFILIACION: now,
      NOVEDAD: get(AffiliatedDefault, "value.AddStatus"),
    });

    const onSubmit = async () => {
      // (optional) Wait until recaptcha has been loaded.
      await recaptchaLoaded();

      // Execute reCAPTCHA with action "login".
      const token = await executeRecaptcha("login");

      console.log(token);

      Object.keys(model).forEach(
        (key) => model[key] === undefined && delete model[key]
      );

      if([null, undefined, ""].includes(model.PLAN_MENSUAL)) return $q.dialog({
        title: "Selecciona un Plan",
        message: "",
      })

      await store.dispatch("afiliado/createAffiliateRef", model);

      // Do stuff with the received token.
      $q.dialog({
        title: "Gracias por Registrarte",
        message: "pronto estaremos en contacto",
      })
        .onOk(() => {
          // console.log('OK')
          onReset();
        })
    };

    const onReset = () => {
      model.NOMBRES_COMPLETO = "";
      model.CEDULA = "";
      model.DIRECCION = "";
      model.NUMERO_CONTRATO = "0";
      model.ESTADOCONTRATO = 0;
      model.CIUDAD = "";
      model.TELEFONO = "";
      model.EMAIL = "";
      model.GRADO = "";
      model.PIN_PAGO = "";
      model.EMPRESA = "";
      model.PLAN_MENSUAL = "";
      model.FECHA_AFILIACION = now;
      model.NOVEDAD = get(AffiliatedDefault, "value.AddStatus");
    };

    return {
      model,
      onSubmit,
      affiliatedPlans,
    };
  },
});
</script>

<style lang="sass" scoped>
.plan-pro
  background: #071129
  color: #fff
</style>