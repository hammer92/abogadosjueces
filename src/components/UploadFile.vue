<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Cargar Archivos" color="primary" @click="prompt = !prompt"/>
  </div>
  <q-dialog v-model="prompt">
    <q-card>
      <q-card-section>
        <div class="text-h6">Cargar Archivos</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <vue-csv-import v-model="csv" :fields="fieldsImport">
          <vue-csv-errors/>
          <vue-csv-input/>
          <vue-csv-map/>
          <vue-csv-submit/>
        </vue-csv-import>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="OK"
          color="primary"
          @click="CargarAfiliados"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {defineComponent, ref} from "vue";
import {useStore} from "vuex";

const fieldsImport = {
  GRADO: {label: "GRADO"},
  NOMBRES_COMPLETO: {label: "NOMBRES COMPLETO"},
  CEDULA: {label: "CEDULA"},
  TELEFONO: {label: "TELEFONO"},
  VALOR_MENSUAL: {label: "VALOR MENSUAL"},
  FECHA_FILIACION: {label: "FECHA AFILIACION"},
  FECHA_TOKEN: {label: "FECHA TOKEN"},
  PRIMER_DESCUENTO: {label: "PRIMER DESCUENTO"},
  AÑOS: {label: "AÑOS"},
  DEPARTAMENTO: {label: "DEPARTAMENTO"},
  NOVEDAD: {label: "NOVEDAD"},
};

export default defineComponent({
  name: "UploadFile",
  setup() {
    const store = useStore();
    const csv = ref([]);
    const csvImport = ref();

    const CargarAfiliados = () => {
      store.dispatch("afiliado/createAffiliateBulk", csv.value);
    };

    return {
      csvImport,
      fieldsImport,
      CargarAfiliados,
      csv,
      prompt: ref(false),
    };
  },
});
</script>
