<template>
  <q-btn
    color="primary"
    icon-right="add"
    label="Crear"
    no-caps
    @click="prompt = !prompt"
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
              <q-input
                filled
                v-model="model.VALOR_MENSUAL"
                label="Valor Mensual"
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
              <q-input
                filled
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
import { defineComponent, ref, reactive } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "FormAdd",
  setup() {
    const store = useStore();
    const prompt = ref(false);

    const model = reactive({
      GRADO: "",
      NOMBRES_COMPLETO: "",
      CEDULA: "",
      TELEFONO: "",
      VALOR_MENSUAL: "",
      FECHA_AFILIACION: "",
      FECHA_TOKEN: "",
      PRIMER_DESCUENTO: "",
      ANOS: "",
      DEPARTAMENTO: "",
      NOVEDAD: "",
    });

    const onSubmit = async () => {
      Object.keys(model).forEach(
        (key) => model[key] === undefined && delete model[key]
      );

      await store.dispatch("afiliado/createAffiliateRef", model);
      prompt.value = false;

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
    };
  },
});
</script>
