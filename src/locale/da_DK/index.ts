import type { Locale } from '../types';

const locale: Locale = {
  "locale": "da",
  "global": {
    "close": "Luk",
    "show": "Vis",
    "hide": "Skjul",
    "placeholder": "Vælg venligst",
    "sortable": "sorterbar"
  },
  "Table": {
    "filterTitle": "Filtermenu",
    "filterConfirm": "OK",
    "filterReset": "Nulstil",
    "filterEmptyText": "Ingen filtre",
    "emptyText": "Ingen data",
    "selectAll": "Vælg alle",
    "selectNone": "Ryd alt data",
    "selectInvert": "Invertér valg",
    "selectionAll": "Vælg alt data",
    "sortTitle": "Sortér",
    "expand": "Udvid række",
    "collapse": "Flet række",
    "triggerDesc": "Klik for at sortere faldende",
    "triggerAsc": "Klik for at sortere stigende",
    "cancelSort": "Klik for at annullere sortering",
    "filterCheckAll": "Vælg alle elementer",
    "filterSearchPlaceholder": "Søg i filtre"
  },
  "Modal": {
    "okText": "OK",
    "cancelText": "Afbryd",
    "justOkText": "OK"
  },
  "Tour": {
    "Next": "Næste",
    "Previous": "Forrige",
    "Finish": "Færdiggørelse"
  },
  "Popconfirm": {
    "okText": "OK",
    "cancelText": "Afbryd"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Søg her",
    "itemUnit": "element",
    "itemsUnit": "elementer",
    "remove": "Fjern",
    "selectCurrent": "Vælg den aktuelle side",
    "removeCurrent": "Fjern den aktuelle side",
    "selectAll": "Vælg alle data",
    "deselectAll": "Fravælg alle data",
    "removeAll": "Fjern alle data",
    "selectInvert": "Inverter den aktuelle side"
  },
  "Upload": {
    "uploading": "Uploader...",
    "removeFile": "Fjern fil",
    "uploadError": "Fejl ved upload",
    "previewFile": "Forhåndsvisning",
    "downloadFile": "Download fil"
  },
  "Empty": {
    "description": "Ingen data"
  },
  "QRCode": {
    "expired": "QR-koden er udløbet",
    "refresh": "Opdater",
    "scanned": "Scannet"
  },
  "ColorPicker": {
    "presetEmpty": "Tom",
    "transparent": "Gennemsigtig",
    "singleColor": "Enkelt farve",
    "gradientColor": "Gradient farve"
  },
  "Text": {
    "edit": "Rediger",
    "copy": "Kopiér",
    "copied": "Kopieret",
    "expand": "Udvid",
    "collapse": "Kollaps"
  },
  "Form": {
    "optional": "(valgfrit)",
    "defaultValidateMessages": {
      "default": "Feltvalideringsfejl ${label}",
      "required": "Indtast venligst ${label}",
      "enum": "${label} skal være en af [${enum}]",
      "whitespace": "${label} kan ikke være et tomt tegn",
      "date": {
        "format": "${label} Datoformatet er ugyldigt",
        "parse": "${label} kan ikke konverteres til en dato",
        "invalid": "${label} er en ugyldig dato"
      },
      "types": {
        "string": "${label} er ikke en gyldig ${type}",
        "method": "${label} er ikke en gyldig ${type}",
        "array": "${label} er ikke en gyldig ${type}",
        "object": "${label} er ikke en gyldig ${type}",
        "number": "${label} er ikke en gyldig ${type}",
        "date": "${label} er ikke en gyldig ${type}",
        "boolean": "${label} er ikke en gyldig ${type}",
        "integer": "${label} er ikke en gyldig ${type}",
        "float": "${label} er ikke en gyldig ${type}",
        "regexp": "${label} er ikke en gyldig ${type}",
        "email": "${label} er ikke en gyldig ${type}",
        "url": "${label} er ikke en gyldig ${type}",
        "hex": "${label} er ikke en gyldig ${type}"
      },
      "string": {
        "len": "${label} skal være ${len} tegn",
        "min": "${label} mindst ${min} tegn",
        "max": "${label} op til ${max} tegn",
        "range": "${label} skal være mellem ${min} og ${max} tegn"
      },
      "number": {
        "len": "${label} skal være lig med ${len}",
        "min": "${label} Minimumsværdien er ${min}",
        "max": "${label} maksimal værdi er ${max}",
        "range": "${label} skal være mellem ${min}-${max}"
      },
      "array": {
        "len": "Skal være ${len} ${label}",
        "min": "Mindst  ${min} ${label}",
        "max": "Højst ${max} ${label}",
        "range": "Mængden af ${label} skal være mellem ${min}-${max}"
      },
      "pattern": {
        "mismatch": "${label} stemmer ikke overens med mønsteret ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Vælg dato",
    "rangePlaceholder": [
      "Startdato",
      "Slutdato"
    ]
  },
  "TimePicker": {
    "placeholder": "Vælg tid",
    "rangePlaceholder": [
      "Starttidspunkt",
      "Sluttidspunkt"
    ]
  }
};

export default locale;
