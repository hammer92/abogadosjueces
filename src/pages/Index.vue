<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-table ref="table"
               class="my-sticky-header-column-table"
               title="Listado Afiliados"
               :rows="rows"
               :columns="columns"
               row-key="name"
               :visible-columns="visibleColumns"
               :loading="loading"
               :pagination="pagination"
      >
        <template v-slot:top="props">
          <div class="col-2 q-table__title">Listado Afiliados</div>

          <q-space/>
          <dowload-file :rows="rows"
                        :columns="columns" :visibleColumns="visibleColumns" :filter="filterValue"/>
          <upload-file/>

          <q-space/>
          <q-input dense outlined color="primary" v-model="filterValue" placeholder="Buscar">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>
          <q-space/>
          <q-select
            v-model="visibleColumns"
            multiple
            borderless
            dense
            options-dense
            display-value="Columnas"
            emit-value
            map-options
            :options="columns"
            option-value="name"
            style="min-width: 150px"
          />
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.value }}
              <q-btn v-if="col.name==='NOMBRES_COMPLETO'" style="margin: 0 10px" size="sm" color="accent" dense
                     @click="editAction(props.row)" icon="edit"/>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <form-update ref="formUpdate"/>

    </div>
  </q-page>
</template>

<script>
import {map, filter, lowerCase} from "lodash";
import {ref, computed} from "vue";

import {useStore} from "vuex";


import UploadFile from "src/components/UploadFile";
import DowloadFile from 'src/components/DowloadFile.vue';
import FormUpdate from "components/FormUpdate";

const columns = [
  {name: "NOMBRES_COMPLETO", label: "NOMBRES COMPLETO", field: "NOMBRES_COMPLETO", visible: true, required: true,},
  {name: "GRADO", label: "GRADO", field: "GRADO", visible: true},
  {name: "CEDULA", label: "CEDULA", field: "CEDULA", visible: true},
  {name: "TELEFONO", label: "TELEFONO", field: "TELEFONO", visible: true},
  {name: "VALOR_MENSUAL", label: "VALOR MENSUAL", field: "VALOR_MENSUAL", visible: true},
  {name: "FECHA_AFILIACION", label: "FECHA FECHA_AFILIACION", field: "FECHA_AFILIACION", visible: true},
  {name: "FECHA_TOKEN", label: "FECHA TOKEN", field: "FECHA_TOKEN", visible: false},
  {name: "UPDATE", label: "FECHA ACTUALIZACION", field: "UPDATE", visible: true},
  {name: "PRIMER_DESCUENTO", label: "PRIMER DESCUENTO", field: "PRIMER_DESCUENTO", visible: false},
  {name: "AÑOS", label: "AÑOS", field: "AÑOS", visible: false},
  {name: "DEPARTAMENTO", label: "DEPARTAMENTO", field: "DEPARTAMENTO", visible: false},
  {name: "NOVEDAD", label: "NOVEDAD", field: "NOVEDAD", visible: true},
];


export default {
  name: "PageIndex",
  components: {
    FormUpdate,
    UploadFile,
    DowloadFile,
  },
  setup() {
    const store = useStore();
    const filterValue = ref('')
    const formUpdate = ref(null)
    const modelEdit = ref({})

    store.dispatch("afiliado/bindAffiliateRef");

    const rows = store.getters["afiliado/all"];
    const loading = computed(() => store.getters["afiliado/loading"])

    const editAction = (itemEdit) =>{
      console.log(formUpdate.value);
      formUpdate.promptAction(itemEdit)
    }

    return {
      formUpdate,
      editAction,
      visibleColumns: ref(map(columns, "name")),
      columns,
      rows: computed(() => {
        return filter(rows, (item) => {
          if (filterValue.value === "") return true
          return lowerCase(item.NOMBRES_COMPLETO).indexOf(lowerCase(filterValue.value)) > -1 ||
            lowerCase(item.GRADO).indexOf(lowerCase(filterValue.value)) > -1 ||
            lowerCase(item.CEDULA).indexOf(lowerCase(filterValue.value)) > -1 ||
            lowerCase(item.TELEFONO).indexOf(lowerCase(filterValue.value)) > -1 ||
            lowerCase(item.VALOR_MENSUAL).indexOf(lowerCase(filterValue.value)) > -1 ||
            lowerCase(item.FECHA_FILIACION).indexOf(lowerCase(filterValue.value)) > -1 ||
            lowerCase(item.FECHA_TOKEN).indexOf(lowerCase(filterValue.value)) > -1 ||
            lowerCase(item.UPDATE).indexOf(lowerCase(filterValue.value)) > -1 ||
            lowerCase(item.PRIMER_DESCUENTO).indexOf(lowerCase(filterValue.value)) > -1 ||
            lowerCase(item.ANOS).indexOf(lowerCase(filterValue.value)) > -1 ||
            lowerCase(item.DEPARTAMENTO).indexOf(lowerCase(filterValue.value)) > -1 ||
            lowerCase(item.NOVEDAD).indexOf(lowerCase(filterValue.value)) > -1
        })
      }),
      modelEdit,
      filterValue,
      loading,
      pagination: {rowsPerPage: 50},

      saveItem: (value, initialValue) => {
        console.log(value, initialValue)
      },

    };
  },
};
</script>
<style lang="sass">
.my-sticky-header-column-table
  /* height or max-height is important */
  height: 80vh

  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  max-width: 96vw

  td:first-child
    /* bg color is important for td; just specify one */
    background-color: #c1f4cd !important

  tr th
    position: sticky
    /* higher than z-index for td below */
    z-index: 2
    /* bg color is important; just specify one */
    background: #fff

  /* this will be the loading indicator */


  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
    /* highest z-index */
    z-index: 3

  thead tr:first-child th
    top: 0
    z-index: 1

  tr:first-child th:first-child
    /* highest z-index */
    z-index: 3

  td:first-child
    z-index: 1

  td:first-child, th:first-child
    position: sticky
    left: 0
</style>

