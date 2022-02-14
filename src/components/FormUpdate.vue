<template>
  <q-btn
    style="margin: 0 10px"
    size="sm"
    color="accent"
    dense
    @click="prompt = !prompt"
    icon="edit"
  />
  <q-dialog v-model="prompt">
    <q-card style="width: 90vw">
      <q-card-section>
        <div class="text-h6">Actualizar Afiliado</div>
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
                :rules="[
                  (val) =>
                    val.match(/^[0-9]+$/) || 'Por favor escriba solo numero',
                ]"
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
  name: "FormUpdate",
  props: {
    item: Object,
  },
  setup(props) {
    const store = useStore();
    const prompt = ref(false);

    const model = reactive({
      GRADO: props.item.GRADO,
      NOMBRES_COMPLETO: props.item.NOMBRES_COMPLETO,
      CEDULA: props.item.CEDULA,
      TELEFONO: props.item.TELEFONO,
      VALOR_MENSUAL: props.item.VALOR_MENSUAL,
      FECHA_AFILIACION: props.item.FECHA_AFILIACION,
      FECHA_TOKEN: props.item.FECHA_TOKEN,
      PRIMER_DESCUENTO: props.item.PRIMER_DESCUENTO,
      ANOS: props.item.ANOS,
      DEPARTAMENTO: props.item.DEPARTAMENTO,
      NOVEDAD: props.item.NOVEDAD,
    });

    return {
      model,
      prompt,
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
