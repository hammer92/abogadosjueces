<template>
  <q-btn
    color="primary"
    icon-right="add"
    label="Crear"
    no-caps
    @click="ActiveModal"
  />
  <q-dialog v-model="prompt">
    <q-card style="width: 90vw">
      <q-card-section>
        <div class="text-h6">Crear Afiliado</div>
      </q-card-section>

      <q-separator />
      <q-form @submit="onSubmit">
        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="row">
            <div class="col-6 q-pa-sm">
              <q-input
                filled
                v-model="model.CEDULA"
                label="Nº Documento *"
                lazy-rules
              />
            </div>
            <div class="col-6 q-pa-sm">
              <q-input
                filled
                v-model="model.GRADO"
                label="Grado *"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Por favor escriba algo',
                ]"
              />
            </div>
            <div class="col-12 q-pa-sm">
              <q-input
                filled
                v-model="model.NOMBRES_COMPLETO"
                label="Nombre Completo *"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Por favor escriba algo',
                ]"
              />
            </div>
            <div class="col-6 q-pa-sm">
              <q-input filled v-model="model.TELEFONO" label="Telefono" />
            </div>
            <div class="col-6 q-pa-sm">
              <q-select
                filled
                :options="affiliatedPlans"
                v-model="model.PLAN_MENSUAL"
                label="Plan Mensual"
                option-value="FileName"
                option-label="Name"
                lazy-rules
              />
            </div>
            <div class="col-6 q-pa-sm">
              <q-input
                filled
                label="Fecha Afiliacion *"
                v-model="model.FECHA_AFILIACION"
                mask="date"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="model.FECHA_AFILIACION">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-6 q-pa-sm">
              <q-input
                filled
                label="Fecha Token *"
                v-model="model.FECHA_TOKEN"
                mask="date"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="model.FECHA_TOKEN">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-6 q-pa-sm">
              <q-input
                filled
                v-model="model.PRIMER_DESCUENTO"
                label="Primer Descuento *"
                lazy-rules
              />
            </div>
            <div class="col-6 q-pa-sm">
              <q-input filled v-model="model.ANOS" label="Año" lazy-rules />
            </div>
            <div class="col-6 q-pa-sm">
              <q-input
                filled
                v-model="model.DEPARTAMENTO"
                label="Departamento"
                lazy-rules
              />
            </div>
            <div class="col-6 q-pa-sm">
              <q-select
                filled
                :options="statusList"
                v-model="model.NOVEDAD"
                label="Novedad"
                lazy-rules
              />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
          <q-btn flat label="Actualizar" type="submit" color="primary" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, reactive, computed } from "vue";
import { useStore } from "vuex";
import { get, map } from "lodash";
import * as dayjs from "dayjs";


const now = dayjs().format("YYYY-MM-DD");

const initForm = {
  NOMBRES_COMPLETO: "",
  CEDULA: "",
  DIRECCION: "",
  CIUDAD: "",
  NUMERO_CONTRATO: "0",
  TELEFONO: "",
  EMAIL: "",
  GRADO: "",
  PRIMER_DESCUENTO: "",
  EMPRESA: "",
  PLAN_MENSUAL: "",
  FECHA_AFILIACION: now,
  NOVEDAD: "AfiliadoWeb",
  FECHA_TOKEN: "",
  ANOS: "",
  DEPARTAMENTO: "",
  PIN_PAGO: "",
  ESTADOCONTRATO: 0,
};
export default defineComponent({
  name: "FormAdd",
  setup() {
    const store = useStore();
    const prompt = ref(false);

    const statusList = computed(() => store.getters["config/AffiliatedState"]);
    const affiliatedPlans = computed(() => store.getters["config/AffiliatedPlans"]);
    const AffiliatedDefault = computed(
      () => store.getters["config/AffiliatedDefault"]
    );

    let model = reactive(initForm);

    const ActiveModal = () => {
      prompt.value = !prompt.value;
      model.GRADO = initForm.GRADO;
      model.NOMBRES_COMPLETO = initForm.NOMBRES_COMPLETO;
      model.CEDULA = initForm.CEDULA;
      model.NUMERO_CONTRATO = initForm.NUMERO_CONTRATO;
      model.TELEFONO = initForm.TELEFONO;
      model.VALOR_MENSUAL = initForm.VALOR_MENSUAL;
      model.FECHA_AFILIACION = initForm.FECHA_AFILIACION;
      model.FECHA_TOKEN = initForm.FECHA_TOKEN;
      model.PRIMER_DESCUENTO = initForm.PRIMER_DESCUENTO;
      model.ANOS = initForm.ANOS;
      model.DEPARTAMENTO = initForm.DEPARTAMENTO;
      model.ESTADOCONTRATO = initForm.ESTADOCONTRATO;
      model.PIN_PAGO = initForm.PIN_PAGO;
      model.NOVEDAD = get(AffiliatedDefault, "value.AddStatus");
    };
    const onSubmit = async () => {
      Object.keys(model).forEach(
        (key) => model[key] === undefined && delete model[key]
      );

      await store.dispatch("afiliado/createAffiliateRef", model);
     prompt.value = !prompt.value;

      /*$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'You need to accept the license and terms first'
          })*/
    };

    return {
      model,
      prompt,
      onSubmit,
      statusList,
      affiliatedPlans,
      ActiveModal,
    };
  },
});
</script>
