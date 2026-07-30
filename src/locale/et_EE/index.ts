import type { Locale } from '../types';

const locale: Locale = {
  "locale": "et",
  "global": {
    "placeholder": "Palun vali",
    "close": "Sulge",
    "show": "Näita",
    "hide": "Peida",
    "sortable": "sorteeritav"
  },
  "Table": {
    "filterTitle": "Filtri menüü",
    "filterConfirm": "OK",
    "filterReset": "Nulli",
    "filterEmptyText": "Filtreid pole",
    "filterCheckAll": "Vali kõik",
    "filterSearchPlaceholder": "Otsi filtritest",
    "emptyText": "Andmed puuduvad",
    "selectAll": "Vali kõik",
    "selectInvert": "Inverteeri valik",
    "selectNone": "Kustuta kõik andmed",
    "selectionAll": "Vali kõik andmed",
    "sortTitle": "Sorteeri",
    "expand": "Laienda rida",
    "collapse": "Ahenda rida",
    "triggerDesc": "Klõpsa kahanevalt sortimiseks",
    "triggerAsc": "Klõpsa kasvavalt sortimiseks",
    "cancelSort": "Klõpsa sortimise tühistamiseks"
  },
  "Modal": {
    "okText": "OK",
    "cancelText": "Tühista",
    "justOkText": "OK"
  },
  "Tour": {
    "Next": "Järgmine",
    "Previous": "Eelmine",
    "Finish": "Lõpetada"
  },
  "Popconfirm": {
    "okText": "OK",
    "cancelText": "Tühista"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Otsi siit",
    "itemUnit": "kogus",
    "itemsUnit": "kogused",
    "remove": "Eemalda",
    "selectCurrent": "Vali praegune leht",
    "removeCurrent": "Eemalda praegune leht",
    "selectAll": "Vali kõik",
    "removeAll": "Eemalda kõik andmed",
    "selectInvert": "Inverteeri valik",
    "deselectAll": "Tühista kõik andmed"
  },
  "Upload": {
    "uploading": "Üleslaadimine...",
    "removeFile": "Eemalda fail",
    "uploadError": "Üleslaadimise tõrge",
    "previewFile": "Faili eelvaade",
    "downloadFile": "Lae fail alla"
  },
  "Empty": {
    "description": "Andmed puuduvad"
  },
  "QRCode": {
    "expired": "QR-kood aegus",
    "refresh": "Värskenda",
    "scanned": "Skaneeritud"
  },
  "ColorPicker": {
    "presetEmpty": "Tühi",
    "transparent": "Läbipaistev",
    "singleColor": "Ühevärviline",
    "gradientColor": "Gradiendi värv"
  },
  "Text": {
    "edit": "Muuda",
    "copy": "Kopeeri",
    "copied": "Kopeeritud",
    "expand": "Laienda",
    "collapse": "Ahenda"
  },
  "Form": {
    "optional": "(valikuline)",
    "defaultValidateMessages": {
      "default": "${label} välja valideerimise viga",
      "required": "Palun sisesta ${label}",
      "enum": "${label} peab olema üks järgmistest: [${enum}]",
      "whitespace": "${label} ei saa olla tühi märk",
      "date": {
        "format": "${label} kuupäevavorming on kehtetu",
        "parse": "${label} ei saa kuupäevaks teisendada",
        "invalid": "${label} on vale kuupäev"
      },
      "types": {
        "string": "${label} ei ole kehtiv ${type}",
        "method": "${label} ei ole kehtiv ${type}",
        "array": "${label} ei ole kehtiv ${type}",
        "object": "${label} ei ole kehtiv ${type}",
        "number": "${label} ei ole kehtiv ${type}",
        "date": "${label} ei ole kehtiv ${type}",
        "boolean": "${label} ei ole kehtiv ${type}",
        "integer": "${label} ei ole kehtiv ${type}",
        "float": "${label} ei ole kehtiv ${type}",
        "regexp": "${label} ei ole kehtiv ${type}",
        "email": "${label} ei ole kehtiv ${type}",
        "url": "${label} ei ole kehtiv ${type}",
        "hex": "${label} ei ole kehtiv ${type}"
      },
      "string": {
        "len": "${label} peab koosnema ${len} tähemärgist",
        "min": "${label} peab olema vähemalt ${min} tähemärki",
        "max": "${label} peab olema kuni ${max} tähemärki",
        "range": "${label} peab olema vahemikus ${min}–${max} tähemärki"
      },
      "number": {
        "len": "${label} must be equal to ${len}",
        "min": "${label} peab olema vähemalt ${min}",
        "max": "${label} peab olema maksimaalne ${max}",
        "range": "${label} peab olema vahemikus ${min}–${max}"
      },
      "array": {
        "len": "Peab olema ${len} ${label}",
        "min": "Vähemalt ${min} ${label}",
        "max": "Maksimaalselt ${max} ${label}",
        "range": "${label} summa peab olema vahemikus ${min}–${max}"
      },
      "pattern": {
        "mismatch": "${label} ei vasta mustrile ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Vali kuupäev",
    "rangePlaceholder": [
      "Algus kuupäev",
      "Lõpu kuupäev"
    ]
  },
  "TimePicker": {
    "placeholder": "Vali aeg",
    "rangePlaceholder": [
      "Algusaeg",
      "Lõpuaeg"
    ]
  }
};

export default locale;
