import type { Locale } from '../types';

const locale: Locale = {
  "locale": "ro",
  "global": {
    "placeholder": "Selectează",
    "close": "Închide",
    "show": "Arată",
    "hide": "Ascunde",
    "sortable": "sortabil"
  },
  "Table": {
    "filterTitle": "Filtrează",
    "filterConfirm": "OK",
    "filterReset": "Resetează",
    "filterEmptyText": "Fără filtre",
    "emptyText": "Nu există date",
    "selectAll": "Selectează pagina curentă",
    "selectInvert": "Inversează pagina curentă",
    "selectNone": "Șterge selecția",
    "selectionAll": "Selectează toate datele",
    "sortTitle": "Ordonează",
    "expand": "Extinde rândul",
    "collapse": "Micșorează rândul",
    "triggerDesc": "Apasă pentru ordonare descrescătoare",
    "triggerAsc": "Apasă pentru ordonare crescătoare",
    "cancelSort": "Apasă pentru a anula ordonarea",
    "filterCheckAll": "Selectați toate elementele",
    "filterSearchPlaceholder": "Caută în filtre"
  },
  "Modal": {
    "okText": "OK",
    "cancelText": "Anulare",
    "justOkText": "OK"
  },
  "Tour": {
    "Next": "Următorul",
    "Previous": "Înapoi",
    "Finish": "Finalizare"
  },
  "Popconfirm": {
    "okText": "OK",
    "cancelText": "Anulare"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Căutare",
    "itemUnit": "element",
    "itemsUnit": "elemente",
    "remove": "Șterge",
    "selectCurrent": "Selectează pagina curentă",
    "removeCurrent": "Șterge pagina curentă",
    "selectAll": "Selectează toate datele",
    "removeAll": "Șterge toate datele",
    "selectInvert": "Inversează pagina curentă",
    "deselectAll": "Deselectați toate datele"
  },
  "Upload": {
    "uploading": "Se transferă...",
    "removeFile": "Înlătură fișierul",
    "uploadError": "Eroare la upload",
    "previewFile": "Previzualizare fișier",
    "downloadFile": "Descărcare fișier"
  },
  "Empty": {
    "description": "Fără date"
  },
  "QRCode": {
    "expired": "Codul QR a expirat",
    "refresh": "Reîmprospătați",
    "scanned": "Scanat"
  },
  "ColorPicker": {
    "presetEmpty": "Gol",
    "transparent": "Transparent",
    "singleColor": "O singură culoare",
    "gradientColor": "Culoare gradient"
  },
  "Text": {
    "edit": "editează",
    "copy": "copiază",
    "copied": "copiat",
    "expand": "extinde",
    "collapse": "Colaps"
  },
  "Form": {
    "optional": "(opțional)",
    "defaultValidateMessages": {
      "default": "Eroare la validarea câmpului ${label}",
      "required": "Vă rugăm introduceți ${label}",
      "enum": "${label} trebuie să fie una din valorile [${enum}]",
      "whitespace": "${label} nu poate fi gol",
      "date": {
        "format": "${label} - data nu este în formatul corect",
        "parse": "${label} nu poate fi convertit la o dată",
        "invalid": "${label} este o dată invalidă"
      },
      "types": {
        "string": "${label} nu conține tipul corect (${type})",
        "method": "${label} nu conține tipul corect (${type})",
        "array": "${label} nu conține tipul corect (${type})",
        "object": "${label} nu conține tipul corect (${type})",
        "number": "${label} nu conține tipul corect (${type})",
        "date": "${label} nu conține tipul corect (${type})",
        "boolean": "${label} nu conține tipul corect (${type})",
        "integer": "${label} nu conține tipul corect (${type})",
        "float": "${label} nu conține tipul corect (${type})",
        "regexp": "${label} nu conține tipul corect (${type})",
        "email": "${label} nu conține tipul corect (${type})",
        "url": "${label} nu conține tipul corect (${type})",
        "hex": "${label} nu conține tipul corect (${type})"
      },
      "string": {
        "len": "${label} trebuie să conțină ${len} caractere",
        "min": "${label} trebuie să conțină cel puțin ${min} caractere",
        "max": "${label} trebuie să conțină cel mult ${max} caractere",
        "range": "${label} trebuie să conțină între ${min}-${max} caractere"
      },
      "number": {
        "len": "${label} trebuie să conțină ${len} cifre",
        "min": "${label} trebuie să fie minim ${min}",
        "max": "${label} trebuie să fie maxim ${max}",
        "range": "${label} trebuie să fie între ${min}-${max}"
      },
      "array": {
        "len": "${label} trebuie să conțină ${len} elemente",
        "min": "${label} trebuie să conțină cel puțin ${min} elemente",
        "max": "${label} trebuie să conțină cel mult ${max} elemente",
        "range": "${label} trebuie să conțină între ${min}-${max} elemente"
      },
      "pattern": {
        "mismatch": "${label} nu respectă șablonul ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Selectează data",
    "rangePlaceholder": [
      "Data start",
      "Data sfârșit"
    ]
  },
  "TimePicker": {
    "placeholder": "Selectează ora",
    "rangePlaceholder": [
      "Ora de început",
      "Ora de sfârșit"
    ]
  }
};

export default locale;
