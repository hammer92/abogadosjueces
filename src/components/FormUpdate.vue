<template>

  <q-btn style="margin: 0 10px" size="sm" color="accent" dense
         @click="prompt = !prompt" icon="edit"/>
  <q-dialog v-model="prompt">
    <q-card>
      <q-card-section>
        <div class="text-h6">Actualizar Afiliado</div>
      </q-card-section>

      <q-card-section class="q-pt-none">

        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
          <q-input
            filled
            v-model="model.CEDULA"
            label="Your name *"
            hint="Name and surname"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Por favor escriba algo']"
          />

          <div>
            <q-btn label="Guardar" type="submit" color="primary"/>
            <q-btn label="Cancelar" color="primary" flat class="q-ml-sm" @click="prompt = !prompt"/>
          </div>
        </q-form>

      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script>
import {useQuasar} from 'quasar'
import {defineComponent, ref, reactive} from "vue";
import {useStore} from "vuex";

export default defineComponent({
  name: "FormUpdate",
  props: {
    item: Object
  },
  setup(props, context) {
    const $q = useQuasar()

    const store = useStore();
    const name = ref(null)
    const age = ref(null)
    const accept = ref(false)

    const model = reactive({
      GRADO: "GRADO",
      NOMBRES_COMPLETO: "NOMBRES COMPLETO",
      CEDULA: "CEDULA",
      TELEFONO: "TELEFONO",
      VALOR_MENSUAL: "VALOR MENSUAL",
      FECHA_FILIACION: "FECHA AFILIACION",
      FECHA_TOKEN: "FECHA TOKEN",
      PRIMER_DESCUENTO: "PRIMER DESCUENTO",
      AÑOS: "AÑOS",
      DEPARTAMENTO: "DEPARTAMENTO",
      NOVEDAD: "NOVEDAD",
    });


    return {
      model,
      prompt: ref(false),

      onSubmit() {
        if (accept.value !== true) {
          $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'You need to accept the license and terms first'
          })
        } else {
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Submitted'
          })
        }
      },

      onReset() {
        name.value = null
        age.value = null
        accept.value = false
      }
    };
  },
});
</script>
