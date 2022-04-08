<template>
  <q-page class="flex flex-center">
    <q-inner-loading
      :showing="loadingAction.status"
      :label="loadingAction.message"
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
    <div class="q-pa-md" v-show="!loadingAction.status">
      <q-table
        ref="table"
        class="my-sticky-header-column-table"
        title="Listado Afiliados"
        :rows="rows"
        :columns="columns"
        row-key="name"
        :visible-columns="visibleColumns"
        :pagination="pagination"
      >
        <template v-slot:top="props">
          <div class="col-2 q-table__title">Listado Afiliados</div>

          <q-space />
          <dowload-file
            :rows="rows"
            :visible="visibleColumns"
            :columns="columns"
          />
          <upload-file />

          <form-add />

          <q-space />
          <q-input
            dense
            outlined
            color="primary"
            v-model="filterValue"
            placeholder="Buscar"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-space />
          <q-select
            label="Filtro Novedad"
            v-model="filterState"
            borderless
            dense
            options-dense
            :options="affiliatedState"
            style="min-width: 150px"
          />
          <q-space />
          <q-select
            label="Columnas Visibles"
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
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
              <template v-if="col.name === 'NOMBRES_COMPLETO'">
                <q-btn-dropdown flat color="primary">
                  <template v-slot:label>
                    <div class="q-pa-md q-gutter-md">
                      <q-badge
                        v-if="props.row.ESTADOCONTRATO >= 1"
                        rounded
                        color="yellow"
                      />
                      <q-badge
                        v-if="props.row.ESTADOCONTRATO >= 2"
                        rounded
                        color="green"
                      />
                      <q-badge
                        v-if="props.row.ESTADOCONTRATO >= 3"
                        rounded
                        color="red"
                      />
                    </div>
                  </template>
                  <q-list>
                    <q-item
                      clickable
                      v-close-popup
                      @click="editAction(props.row)"
                    >
                      <q-item-section>
                        <q-item-label>Editar</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item
                      v-if="col.name === 'NOMBRES_COMPLETO'"
                      clickable
                      v-close-popup
                      @click="generateContract(props.row)"
                    >
                      <q-item-section>
                        <q-item-label>Generar Contrato</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-close-popup
                      @click="sendContract(props.row)"
                    >
                      <q-item-section>
                        <q-item-label>Enviar Contrato</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="sendContract(props.row)"
                    >
                      <q-item-section>
                        <q-item-label>Cargar Firma Contrato</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </template>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <form-update ref="formUpdate" />
    </div>
  </q-page>
</template>

<script>
import { map, filter, lowerCase, concat } from "lodash";
import { ref, computed } from "vue";
import axios from "axios";

import { useStore } from "vuex";
import { useQuasar } from "quasar";

import UploadFile from "src/components/UploadFile";
import DowloadFile from "src/components/DowloadFile.vue";
import FormUpdate from "components/FormUpdate";
import FormAdd from "components/FormAdd";

const columns = [
  {
    name: "NOMBRES_COMPLETO",
    label: "NOMBRES COMPLETO",
    field: "NOMBRES_COMPLETO",
    visible: true,
    required: true,
  },
  { name: "CEDULA", label: "CEDULA", field: "CEDULA", visible: true },
  {
    name: "NUMERO_CONTRATO",
    label: "Nº CONTRATO",
    field: "NUMERO_CONTRATO",
    visible: true,
  },
  { name: "DIRECCION", label: "DIRECCION", field: "DIRECCION", visible: true },
  { name: "CIUDAD", label: "CIUDAD", field: "CIUDAD", visible: true },
  { name: "TELEFONO", label: "TELEFONO", field: "TELEFONO", visible: true },
  { name: "EMAIL", label: "EMAIL", field: "EMAIL", visible: true },
  { name: "GRADO", label: "GRADO", field: "GRADO", visible: true },
  {
    name: "PRIMER_DESCUENTO",
    label: "PRIMER DESCUENTO",
    field: "PRIMER_DESCUENTO",
    visible: false,
  },
  {
    name: "EMPRESA",
    label: "EMPRESA ",
    field: "EMPRESA",
    visible: false,
  },
  {
    name: "PLAN_MENSUAL",
    label: "PLAN MENSUAL",
    field: function (item) {
      return (item.PLAN_MENSUAL || { Name: "Sin Plan" }).Name;
    },
    visible: true,
  },
  {
    name: "FECHA_AFILIACION",
    label: "FECHA AFILIACION",
    field: "FECHA_AFILIACION",
    visible: true,
  },
  { name: "NOVEDAD", label: "NOVEDAD", field: "NOVEDAD", visible: true },
  {
    name: "FECHA_TOKEN",
    label: "FECHA TOKEN",
    field: "FECHA_TOKEN",
    visible: false,
  },
  {
    name: "UPDATE",
    label: "FECHA ACTUALIZACION",
    field: "UPDATE",
    visible: true,
  },
  { name: "AÑOS", label: "AÑOS", field: "AÑOS", visible: false },
  {
    name: "DEPARTAMENTO",
    label: "DEPARTAMENTO",
    field: "DEPARTAMENTO",
    visible: false,
  },
];

function ValidateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
}
export default {
  name: "PageIndex",
  components: {
    FormAdd,
    FormUpdate,
    UploadFile,
    DowloadFile,
  },
  setup() {
    const store = useStore();
    const $q = useQuasar();

    const filterValue = ref("");
    const filterState = ref("");

    const formUpdate = ref(null);
    const modelEdit = ref({});
    const loadingAction = ref({
      status: false,
      message: "Cargando...",
    });

    store.dispatch("afiliado/bindAffiliateRef");

    const rows = computed(() => store.getters["afiliado/all"]);
    const loading = computed(() => store.getters["afiliado/loading"]);
    const affiliatedState = computed(() =>
      concat("Ver Todos", store.getters["config/AffiliatedState"])
    );

    const editAction = (itemEdit) => {
      formUpdate.value.promptAction(itemEdit);
    };

    const sendContract = ({ key, EMAIL }) => {
      if (!ValidateEmail(EMAIL)) {
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "correo electronico invalido",
        });
        return;
      }
      loadingAction.value.status = true;
      loadingAction.value.message = "enviado contrato por correo...";
      axios({
        url: "https://app.abogadosjueces.com.co/send-email",
        method: "POST",
        data: { key, EMAIL },
      })
        .then(async function ({ data }) {
          if (data.code === "Error") {
            $q.notify({
              color: "red-5",
              textColor: "white",
              icon: "warning",
              message: "No se ha generado un contrato para enviar",
            });
            loadingAction.value.status = false;

            return;
          }
          await store.dispatch("afiliado/statusContract", {
            UUID: key,
            status: 2,
          });
          loadingAction.value.status = false;
        })
        .catch(function (error) {
          $q.notify({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message: "Error intente mas tarde...",
          });
          loadingAction.value.status = false;
          console.error(error);
        });
    };

    const generateContract = (item) => {
      if (["", null, undefined].includes(item.PLAN_MENSUAL || "")) {
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "No tiene plan activo",
        });
        return;
      }

      loadingAction.value.status = true;
      loadingAction.value.message = "Generando contrato...";
      axios({
        url: "https://app.abogadosjueces.com.co/fill-data-pdfs",
        method: "POST",
        responseType: "blob", // Important
        data: item,
      })
        .then(async function (response) {
          if (response.status) {
            loadingAction.value.message = "Guardando contrato...";

            await store.dispatch("afiliado/uploadFile", {
              name: `${item.key}.pdf`,
              file: response.data,
            });
            await store.dispatch("afiliado/statusContract", {
              UUID: item.key,
              status: 1,
            });

            loadingAction.value.status = false;

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${item.key}.pdf`); //or any other extension
            document.body.appendChild(link);
            link.click();
          }
        })
        .catch(function (error) {
          $q.notify({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message: "Error intente mas tarde...",
          });
          loadingAction.value.status = false;
          console.error(error);
        });
    };

    return {
      generateContract,
      sendContract,
      loadingAction,
      formUpdate,
      editAction,
      visibleColumns: ref(map(filter(columns, "visible"), "name")),
      columns,
      rows: computed(() => {
        return filter(
          filter(rows.value, (f) => {
            if (filterState.value === "Ver Todos") return true;

            return (
              lowerCase(f.NOVEDAD).indexOf(lowerCase(filterState.value)) > -1
            );
          }),
          (item) => {
            if (filterValue.value === "") return true;
            return (
              lowerCase(item.NOMBRES_COMPLETO).indexOf(
                lowerCase(filterValue.value)
              ) > -1 ||
              lowerCase(item.GRADO).indexOf(lowerCase(filterValue.value)) >
                -1 ||
              lowerCase(item.CEDULA).indexOf(lowerCase(filterValue.value)) >
                -1 ||
              lowerCase(item.TELEFONO).indexOf(lowerCase(filterValue.value)) >
                -1
            );
          }
        );
      }),
      modelEdit,
      filterValue,
      loading,
      pagination: { rowsPerPage: 50 },
      affiliatedState,
      filterState,
      saveItem: (value, initialValue) => {
        console.log(value, initialValue);
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
