<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn
      color="primary"
      icon-right="download"
      label="Exportar"
      no-caps
      @click="exportTable"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { exportFile, useQuasar } from "quasar";
import { filter } from "lodash";

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}

export default defineComponent({
  name: "DowloadFile",
  props: {
    columns: Array,
    visible: Array,
    rows: Array,
  },
  setup(props, context) {
    const $q = useQuasar();
    const exportTable = () => {

      const columns = filter(props.columns, (item) => props.visible.includes(item.field));
      const rows = props.rows;
      
      const content = [columns.map(col => wrapCsvValue(col.label))].concat(
          rows.map(row => columns.map(col => wrapCsvValue(
            typeof col.field === 'function'
              ? col.field(row)
              : row[ col.field === void 0 ? col.name : col.field ],
            col.format
          )).join(','))
        ).join('\r\n')

      const status = exportFile(
        'table-export.csv',
        content,
        'text/csv'
      )

       if (status !== true) {
         $q.notify({
           message: 'Browser denied file download...',
           color: 'negative',
           icon: 'warning'
         })
       }
    };

    return {
      exportTable,
    };
  },
});
</script>
