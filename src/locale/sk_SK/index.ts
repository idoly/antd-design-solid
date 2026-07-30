import type { Locale } from '../types';

const locale: Locale = {
  "locale": "sk",
  "global": {
    "placeholder": "Prosím vyber",
    "close": "Zavrieť",
    "show": "Zobraziť",
    "hide": "Skryť",
    "sortable": "zoradiť"
  },
  "Table": {
    "filterTitle": "Filter",
    "filterConfirm": "OK",
    "filterReset": "Obnoviť",
    "filterEmptyText": "Žiadne filtre",
    "filterCheckAll": "Vyber všetky položky",
    "filterSearchPlaceholder": "Vyhľadaj vo filtroch",
    "emptyText": "Žiadne dáta",
    "selectAll": "Označ všetky položky",
    "selectInvert": "Opačný výber položiek",
    "selectNone": "Odznač všetko",
    "selectionAll": "Označ všetko",
    "sortTitle": "Zoradiť",
    "expand": "Rozbaliť riadok",
    "collapse": "Zbaliť riadok",
    "triggerDesc": "Kliknutím zoradíš zostupne",
    "triggerAsc": "Kliknutím zoradíš vzostupne",
    "cancelSort": "Kliknutím zrušíš zoradenie"
  },
  "Modal": {
    "okText": "OK",
    "cancelText": "Zrušiť",
    "justOkText": "OK"
  },
  "Tour": {
    "Next": "Ďalej",
    "Previous": "Späť",
    "Finish": "Dokončiť"
  },
  "Popconfirm": {
    "okText": "OK",
    "cancelText": "Zrušiť"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Vyhľadávanie",
    "itemUnit": "položka",
    "itemsUnit": "položiek",
    "remove": "Odstráň",
    "selectCurrent": "Vyber aktuálnu stranu",
    "removeCurrent": "Zmaž aktuálnu stranu",
    "selectAll": "Označ všetko",
    "removeAll": "Odznač všetko",
    "selectInvert": "Opačný výber",
    "deselectAll": "Zrušte výber všetkých údajov"
  },
  "Upload": {
    "uploading": "Nahrávanie...",
    "removeFile": "Odstrániť súbor",
    "uploadError": "Chyba pri nahrávaní",
    "previewFile": "Zobraziť súbor",
    "downloadFile": "Stiahnuť súbor"
  },
  "Empty": {
    "description": "Žiadne dáta"
  },
  "QRCode": {
    "expired": "Platnosť QR kódu vypršala",
    "refresh": "Obnoviť",
    "scanned": "Naskenované"
  },
  "ColorPicker": {
    "presetEmpty": "Prázdny",
    "transparent": "Transparentné",
    "singleColor": "Jednofarebné",
    "gradientColor": "Farba prechodu"
  },
  "Text": {
    "edit": "Upraviť",
    "copy": "Kopírovať",
    "copied": "Skopírované",
    "expand": "Zväčšiť",
    "collapse": "kolaps"
  },
  "Form": {
    "optional": "(nepovinné)",
    "defaultValidateMessages": {
      "default": "Validačná chyba poľa pre ${label}",
      "required": "Prosím vlož ${label}",
      "enum": "${label} musí byť jeden z [${enum}]",
      "whitespace": "${label} nemôže byť prázdny znak",
      "date": {
        "format": "${label} formát dátumu je neplatný",
        "parse": "${label} nie je možné konvertovať na dátum",
        "invalid": "${label} je neplatný dátum"
      },
      "types": {
        "string": "${label} nie je platný ${type}",
        "method": "${label} nie je platný ${type}",
        "array": "${label} nie je platný ${type}",
        "object": "${label} nie je platný ${type}",
        "number": "${label} nie je platný ${type}",
        "date": "${label} nie je platný ${type}",
        "boolean": "${label} nie je platný ${type}",
        "integer": "${label} nie je platný ${type}",
        "float": "${label} nie je platný ${type}",
        "regexp": "${label} nie je platný ${type}",
        "email": "${label} nie je platný ${type}",
        "url": "${label} nie je platný ${type}",
        "hex": "${label} nie je platný ${type}"
      },
      "string": {
        "len": "${label} musí byť ${len} znakov",
        "min": "${label} musí byť aspoň ${min} znakov",
        "max": "${label} musí byť do ${max} znakov",
        "range": "${label} musí byť medzi ${min}-${max} znakmi"
      },
      "number": {
        "len": "${label} musí byť rovnaký ako ${len}",
        "min": "${label} musí byť minimálne ${min}",
        "max": "${label} musí byť maximálne ${max}",
        "range": "${label} musí byť medzi ${min}-${max}"
      },
      "array": {
        "len": "Musí byť ${len} ${label}",
        "min": "Aspoň ${min} ${label}",
        "max": "Najviac ${max} ${label}",
        "range": "Počet ${label} musí byť medzi ${min}-${max}"
      },
      "pattern": {
        "mismatch": "${label} nezodpovedá vzoru ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Vybrať dátum",
    "rangePlaceholder": [
      "Od",
      "Do"
    ]
  },
  "TimePicker": {
    "placeholder": "Vybrať čas",
    "rangePlaceholder": [
      "Čas začiatku",
      "Čas konca"
    ]
  }
};

export default locale;
