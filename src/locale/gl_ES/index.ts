import type { Locale } from '../types';

const locale: Locale = {
  "locale": "gl",
  "global": {
    "placeholder": "Escolla",
    "close": "Cerrar",
    "show": "Mostrar",
    "hide": "Ocultar",
    "sortable": "clasificable"
  },
  "Table": {
    "filterTitle": "Filtrar menú",
    "filterConfirm": "Aceptar",
    "filterReset": "Reiniciar",
    "selectAll": "Seleccionar todo",
    "selectInvert": "Invertir selección",
    "sortTitle": "Ordenar",
    "filterEmptyText": "Sen filtros",
    "filterCheckAll": "Selecciona todos os elementos",
    "filterSearchPlaceholder": "Busca en filtros",
    "emptyText": "Sen datos",
    "selectNone": "Borrar todos os datos",
    "selectionAll": "Seleccione todos os datos",
    "expand": "Expandir fila",
    "collapse": "Contraer fila",
    "triggerDesc": "Fai clic para ordenar descendente",
    "triggerAsc": "Fai clic para ordenar ascendente",
    "cancelSort": "Fai clic para cancelar a clasificación"
  },
  "Modal": {
    "okText": "Aceptar",
    "cancelText": "Cancelar",
    "justOkText": "Aceptar"
  },
  "Tour": {
    "Next": "Avanzar",
    "Previous": "Anterior",
    "Finish": "Finalizar"
  },
  "Popconfirm": {
    "okText": "Aceptar",
    "cancelText": "Cancelar"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Buscar aquí",
    "itemUnit": "elemento",
    "itemsUnit": "elementos",
    "remove": "Eliminar",
    "selectCurrent": "Seleccione a páxina actual",
    "removeCurrent": "Eliminar a páxina actual",
    "selectAll": "Seleccione todos os datos",
    "deselectAll": "Deseleccione todos os datos",
    "removeAll": "Elimina todos os datos",
    "selectInvert": "Inverte a páxina actual"
  },
  "Upload": {
    "uploading": "Subindo...",
    "removeFile": "Eliminar arquivo",
    "uploadError": "Error ao subir o arquivo",
    "previewFile": "Vista previa",
    "downloadFile": "Descargar arquivo"
  },
  "Empty": {
    "description": "Non hai datos"
  },
  "QRCode": {
    "expired": "O código QR caducou",
    "refresh": "Actualizar",
    "scanned": "Escaneado"
  },
  "ColorPicker": {
    "presetEmpty": "Baleiro",
    "transparent": "Transparente",
    "singleColor": "Cor única",
    "gradientColor": "Cor degradado"
  },
  "Text": {
    "edit": "editar",
    "copy": "copiar",
    "copied": "copiado",
    "expand": "expandir",
    "collapse": "Colapsar"
  },
  "Form": {
    "optional": "(opcional)",
    "defaultValidateMessages": {
      "default": "Error de validación do campo ${label}",
      "required": "Por favor complete ${label}",
      "enum": "${label} ten que ser un de [${enum}]",
      "whitespace": "${label} non pode ter ningún caracter en branco",
      "date": {
        "format": "O formato de data ${label} non é válido",
        "parse": "${label} non se pode convertir a unha data",
        "invalid": "${label} é unha data inválida"
      },
      "types": {
        "string": "${label} non é un ${type} válido",
        "method": "${label} non é un ${type} válido",
        "array": "${label} non é un ${type} válido",
        "object": "${label} non é un ${type} válido",
        "number": "${label} non é un ${type} válido",
        "date": "${label} non é un ${type} válido",
        "boolean": "${label} non é un ${type} válido",
        "integer": "${label} non é un ${type} válido",
        "float": "${label} non é un ${type} válido",
        "regexp": "${label} non é un ${type} válido",
        "email": "${label} non é un ${type} válido",
        "url": "${label} non é un ${type} válido",
        "hex": "${label} non é un ${type} válido"
      },
      "string": {
        "len": "${label} debe ter ${len} caracteres",
        "min": "${label} debe ter como mínimo ${min} caracteres",
        "max": "${label} debe ter ata ${max} caracteres",
        "range": "${label} debe ter entre ${min}-${max} caracteres"
      },
      "number": {
        "len": "${label} debe ser igual a ${len}",
        "min": "${label} valor mínimo é ${min}",
        "max": "${label} valor máximo é ${max}",
        "range": "${label} debe estar entre ${min}-${max}"
      },
      "array": {
        "len": "Debe ser ${len} ${label}",
        "min": "Como mínimo ${min} ${label}",
        "max": "Como máximo ${max} ${label}",
        "range": "O valor de ${label} debe estar entre ${min}-${max}"
      },
      "pattern": {
        "mismatch": "${label} non coincide co patrón ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Escolla data",
    "rangePlaceholder": [
      "Data inicial",
      "Data final"
    ]
  },
  "TimePicker": {
    "placeholder": "Escolla hora",
    "rangePlaceholder": [
      "Hora de inicio",
      "Hora de fin"
    ]
  }
};

export default locale;
