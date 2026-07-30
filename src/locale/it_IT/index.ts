import type { Locale } from '../types';

const locale: Locale = {
  "locale": "it",
  "global": {
    "placeholder": "Selezionare",
    "close": "Chiudi",
    "show": "Mostra",
    "hide": "Nascondi",
    "sortable": "ordinabile"
  },
  "Table": {
    "filterTitle": "Menù Filtro",
    "filterConfirm": "OK",
    "filterReset": "Reset",
    "filterEmptyText": "Senza filtri",
    "filterCheckAll": "Seleziona tutti",
    "filterSearchPlaceholder": "Cerca nei filtri",
    "emptyText": "Senza dati",
    "selectAll": "Seleziona pagina corrente",
    "selectInvert": "Inverti selezione nella pagina corrente",
    "selectNone": "Deseleziona tutto",
    "selectionAll": "Seleziona tutto",
    "sortTitle": "Ordina",
    "expand": "Espandi riga",
    "collapse": "Comprimi riga ",
    "triggerDesc": "Clicca per ordinare in modo discendente",
    "triggerAsc": "Clicca per ordinare in modo ascendente",
    "cancelSort": "Clicca per eliminare l'ordinamento"
  },
  "Modal": {
    "okText": "OK",
    "cancelText": "Annulla",
    "justOkText": "OK"
  },
  "Tour": {
    "Next": "Successivo",
    "Previous": "Precedente",
    "Finish": "Termina"
  },
  "Popconfirm": {
    "okText": "OK",
    "cancelText": "Annulla"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Cerca qui",
    "itemUnit": "elemento",
    "itemsUnit": "elementi",
    "remove": "Elimina",
    "selectCurrent": "Seleziona la pagina corrente",
    "removeCurrent": "Rimuovi la pagina corrente",
    "selectAll": "Seleziona tutti i dati",
    "removeAll": "Rimuovi tutti i dati",
    "selectInvert": "Inverti la pagina corrente",
    "deselectAll": "Deseleziona tutti i dati"
  },
  "Upload": {
    "uploading": "Caricamento...",
    "removeFile": "Rimuovi il file",
    "uploadError": "Errore di caricamento",
    "previewFile": "Anteprima file",
    "downloadFile": "Scarica file"
  },
  "Empty": {
    "description": "Nessun dato"
  },
  "QRCode": {
    "expired": "Codice QR scaduto",
    "refresh": "Ricarica",
    "scanned": "Scansionato"
  },
  "ColorPicker": {
    "presetEmpty": "Vuoto",
    "transparent": "Trasparente",
    "singleColor": "Tinta unita",
    "gradientColor": "Gradiente"
  },
  "Text": {
    "edit": "modifica",
    "copy": "copia",
    "copied": "copia effettuata",
    "expand": "espandi",
    "collapse": "Crollo"
  },
  "Form": {
    "optional": "(opzionale)",
    "defaultValidateMessages": {
      "default": "Errore di convalida del campo ${label}",
      "required": "Si prega di inserire ${label}",
      "enum": "${label} deve essere uno di [${enum}]",
      "whitespace": "${label} non può essere un carattere vuoto",
      "date": {
        "format": "Il formato della data ${label} non è valido",
        "parse": "${label} non può essere convertito in una data",
        "invalid": "${label} non è una data valida"
      },
      "types": {
        "string": " ${label} non è un ${type} valido",
        "method": " ${label} non è un ${type} valido",
        "array": " ${label} non è un ${type} valido",
        "object": " ${label} non è un ${type} valido",
        "number": " ${label} non è un ${type} valido",
        "date": " ${label} non è un ${type} valido",
        "boolean": " ${label} non è un ${type} valido",
        "integer": " ${label} non è un ${type} valido",
        "float": " ${label} non è un ${type} valido",
        "regexp": " ${label} non è un ${type} valido",
        "email": " ${label} non è un ${type} valido",
        "url": " ${label} non è un ${type} valido",
        "hex": " ${label} non è un ${type} valido"
      },
      "string": {
        "len": "${label} deve avere ${len} caratteri",
        "min": "${label} deve contenere almeno ${min} caratteri",
        "max": "${label} deve contenere fino a ${max} caratteri",
        "range": "${label} deve contenere tra ${min}-${max} caratteri"
      },
      "number": {
        "len": "${label} deve essere uguale a ${len}",
        "min": "${label} valore minimo è ${min}",
        "max": "${label} valor e massimo è ${max}",
        "range": "${label} deve essere compreso tra ${min}-${max}"
      },
      "array": {
        "len": "Deve essere ${len} ${label}",
        "min": "Almeno ${min} ${label}",
        "max": "Massimo ${max} ${label}",
        "range": "Il totale di ${label} deve essere compreso tra ${min}-${max}"
      },
      "pattern": {
        "mismatch": "${label} non corrisponde al modello ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Selezionare la data",
    "rangePlaceholder": [
      "Data d'inizio",
      "Data di fine"
    ]
  },
  "TimePicker": {
    "placeholder": "Selezionare l'orario",
    "rangePlaceholder": [
      "Inizio orario",
      "Fine orario"
    ]
  }
};

export default locale;
