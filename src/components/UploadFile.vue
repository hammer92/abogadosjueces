<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Cargar" icon-right="upload" color="primary" @click="open" />
  </div>
  <q-dialog v-model="prompt">
    <q-card>
      <q-card-section>
        <div class="text-h6">Cargar Archivos</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <vue-csv-import v-model="csv" :fields="fieldsImport">
          <vue-csv-errors />
          <vue-csv-input />
          <vue-csv-map />
        </vue-csv-import>
        <!-- <pre class="mt-15" v-if="csv"><code>{{ csv }}</code></pre> -->
      </q-card-section>

      <q-card-actions>
        <q-btn flat> Afiliados: {{ afiliadocount }} </q-btn>
        <q-btn flat> Renovados: {{ renovadocount }} </q-btn>
        <q-btn flat> No Renovados: {{ noRenovadoCount }} </q-btn>
      </q-card-actions>
      <q-card-actions align="right">
        <q-btn
          v-if="csv.length > 0"
          flat
          label="Cargar"
          color="primary"
          @click="CargarAfiliados"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, watch, computed } from "vue";
import { useStore } from "vuex";

const fieldsImport = {
  // NOMBRES_COMPLETO: { required: true, label: "NOMBRES COMPLETO *" },
  CEDULA: { required: true, label: "CEDULA *" },
  // DIRECCION: { required: false, label: "DIRECCION" },
  // CIUDAD: { required: false, label: "CIUDAD" },
  // TELEFONO: { required: false, label: "TELEFONO" },
  // EMAIL: { required: true, label: "EMAIL *" },
  // GRADO: { required: false, label: "GRADO" },
  PIN_PAGO: { required: false, label: "PIN_PAGO" },
  // EMPRESA: { required: false, label: "EMPRESA" },
  // PLAN_MENSUAL: { required: false, label: "PLAN_MENSUAL" },
  // FECHA_AFILIACION: { required: false, label: "FECHA AFILIACION" },
};

export default defineComponent({
  name: "UploadFile",
  setup() {
    const store = useStore();
    const csv = ref([]);
    const prompt = ref(false);

    const listNow = computed(() => store.getters["afiliado/allCedula"]);

    const afiliadocount = computed(() => {
      const listCedula = csv.value.map((m) => parseInt(m.CEDULA))
      return listCedula.filter((f) => !listNow.value.includes(f)).length;
    });

    const renovadocount = computed(() => {
      const listCedula = csv.value.map((m) => parseInt(m.CEDULA))
      return listCedula.filter((f) => listNow.value.includes(f)).length;
    });

     const noRenovadoCount = computed(() => {
      const listCedula = csv.value.map((m) => parseInt(m.CEDULA))
      return listNow.value.filter((f) => !listCedula.includes(f)).length;
    });

    const CargarAfiliados = () => {
      // csv.value.shift()
      store.dispatch("afiliado/createAffiliateBulk", csv.value);
    };
    const open = () => {
      prompt.value = !prompt.value;
      csv.value = [];
    };

    return {
      open,
      fieldsImport,
      CargarAfiliados,
      csv,
      prompt,
      afiliadocount,
      renovadocount,
      noRenovadoCount,
    };
  },
});
</script>
