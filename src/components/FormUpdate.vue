<template>
  <q-dialog v-model="prompt">
    <q-card style="width: 90vw">
      <q-card-section>
        <div class="text-h6">Actualizar Afiliado</div>
      </q-card-section>

      <q-separator />
      <q-form @submit="onSubmit">
        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="row">
            <div class="col-4 q-pa-sm">
              <q-input filled v-model="model.CEDULA" label="Nº Documento *" />
            </div>
            <div class="col-8 q-pa-sm">
              <q-input
                filled
                v-model="model.NOMBRES_COMPLETO"
                label="Nombre Completo *"
              />
            </div>
            <div class="col-4 q-pa-sm">
              <q-input filled v-model="model.TELEFONO" label="Telefono" />
            </div>
            <div class="col-8 q-pa-sm">
              <q-input
                filled
                v-model="model.EMAIL"
                label="Correo Electronico"
              />
            </div>

            <div class="col-4 q-pa-sm">
              <q-input filled v-model="model.CIUDAD" label="Ciudad" />
            </div>
            <div class="col-8 q-pa-sm">
              <q-input filled v-model="model.DIRECCION" label="Direccion" />
            </div>

            <div class="col-4 q-pa-sm">
              <q-input filled v-model="model.GRADO" label="Grado" />
            </div>
            <div class="col-8 q-pa-sm">
              <q-input filled v-model="model.EMPRESA" label="Empresa" />
            </div>

            <div class="col-4 q-pa-sm">
              <q-input filled v-model="model.PIN_PAGO" label="Pin Pago" />
            </div>
            <div class="col-8 q-pa-sm">
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
            <div class="col-4 q-pa-sm">
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
            <div class="col-4 q-pa-sm">
              <q-input
                filled
                v-model="model.NUMERO_CONTRATO"
                label="Nº Contrato"
              />
            </div>
            <div class="col-4 q-pa-sm">
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
const initForm = {
  NOMBRES_COMPLETO: "",
  CEDULA: "",
  DIRECCION: "",
  NUMERO_CONTRATO: "0",
  CIUDAD: "",
  TELEFONO: "",
  EMAIL: "",
  GRADO: "",
  PIN_PAGO: "",
  EMPRESA: "",
  PLAN_MENSUAL: "",
  FECHA_AFILIACION: "",
  NOVEDAD: "Afiliado",
  ESTADOCONTRATO: 0,
};
export default defineComponent({
  name: "FormUpdate",
  setup() {
    const store = useStore();
    const prompt = ref(false);
    const statusList = computed(() => store.getters["config/AffiliatedState"]);
    const affiliatedPlans = computed(() => store.getters["config/AffiliatedPlans"]);

    let model = reactive(initForm);

    const promptAction = (item) => {
    
    Object.keys(item).forEach(key =>{
       model[key] = item[key]
     })

      prompt.value = !prompt.value;
    };

    /*const ;*/

    return {
      promptAction,
      model,
      prompt,
      statusList,
      affiliatedPlans,
      onSubmit() {
        Object.keys(model).forEach(
          (key) => model[key] === undefined && delete model[key]
        );
        console.log(model);

        store.dispatch("afiliado/createAffiliateRef", model);
        prompt.value = false;

        /*$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'You need to accept the license and terms first'
          })*/
      },
    };
  },
});
</script>
