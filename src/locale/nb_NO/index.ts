import type { Locale } from '../types';

const locale: Locale = {
  "locale": "nb",
  "global": {
    "placeholder": "Vennligst velg",
    "close": "Lukk",
    "sortable": "sorterbar",
    "show": "Vis",
    "hide": "Skjul"
  },
  "Table": {
    "filterTitle": "Filtermeny",
    "filterConfirm": "OK",
    "filterReset": "Nullstill",
    "filterEmptyText": "Ingen filtre",
    "filterCheckAll": "Velg alle elementer",
    "filterSearchPlaceholder": "Søk i filtre",
    "emptyText": "Ingen data",
    "selectAll": "Velg alle",
    "selectInvert": "Inverter gjeldende side",
    "selectNone": "Fjern all data",
    "selectionAll": "Velg all data",
    "sortTitle": "Sorter",
    "expand": "Utvid rad",
    "collapse": "Skjul rad",
    "triggerDesc": "Sorter data i synkende rekkefølge",
    "triggerAsc": "Sorterer data i stigende rekkefølge",
    "cancelSort": "Klikk for å avbryte sorteringen"
  },
  "Modal": {
    "okText": "OK",
    "cancelText": "Avbryt",
    "justOkText": "OK"
  },
  "Tour": {
    "Next": "Neste",
    "Previous": "Forrige",
    "Finish": "Avslutt"
  },
  "Popconfirm": {
    "okText": "OK",
    "cancelText": "Avbryt"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Søk her",
    "itemUnit": "element",
    "itemsUnit": "elementer",
    "remove": "Fjern",
    "selectCurrent": "Velg gjeldende side",
    "removeCurrent": "Fjern gjeldende side",
    "selectAll": "Velg all data",
    "deselectAll": "Opphev valg av all data",
    "removeAll": "Fjern all data",
    "selectInvert": "Inverter gjeldende side"
  },
  "Upload": {
    "uploading": "Laster opp...",
    "removeFile": "Fjern fil",
    "uploadError": "Feil ved opplastning",
    "previewFile": "Forhåndsvisning",
    "downloadFile": "Last ned fil"
  },
  "Empty": {
    "description": "Ingen data"
  },
  "QRCode": {
    "expired": "QR-koden er utløpt",
    "refresh": "Oppdater",
    "scanned": "Skannet"
  },
  "ColorPicker": {
    "presetEmpty": "Tom",
    "transparent": "Gjennomsiktig",
    "singleColor": "Ensfarget",
    "gradientColor": "Gradient"
  },
  "Text": {
    "edit": "Rediger",
    "copy": "Kopier",
    "copied": "Kopiert",
    "expand": "Utvid",
    "collapse": "Skjul"
  },
  "Form": {
    "optional": "(valgfritt)",
    "defaultValidateMessages": {
      "default": "Feltvalideringsfeil ${label}",
      "required": "Vennligst skriv inn ${label}",
      "enum": "${label} må være en av [${enum}]",
      "whitespace": "${label} kan ikke være et blankt tegn",
      "date": {
        "format": "${label} datoformatet er ugyldig",
        "parse": "${label} kan ikke konverteres til en dato",
        "invalid": "${label} er en ugyldig dato"
      },
      "types": {
        "string": "${label} er ikke et gyldig ${type}",
        "method": "${label} er ikke et gyldig ${type}",
        "array": "${label} er ikke et gyldig ${type}",
        "object": "${label} er ikke et gyldig ${type}",
        "number": "${label} er ikke et gyldig ${type}",
        "date": "${label} er ikke et gyldig ${type}",
        "boolean": "${label} er ikke et gyldig ${type}",
        "integer": "${label} er ikke et gyldig ${type}",
        "float": "${label} er ikke et gyldig ${type}",
        "regexp": "${label} er ikke et gyldig ${type}",
        "email": "${label} er ikke et gyldig ${type}",
        "url": "${label} er ikke et gyldig ${type}",
        "hex": "${label} er ikke et gyldig ${type}"
      },
      "string": {
        "len": "${label} må være ${len} tegn",
        "min": "${label} må minst ha ${min} tegn",
        "max": "${label} opp til ${max} tegn",
        "range": "${label} må være mellom ${min}-${max} tegn"
      },
      "number": {
        "len": "${label} må være lik ${len}",
        "min": "${label} minimumsverdien er ${min}",
        "max": "${label} maksimumsverdien er ${max}",
        "range": "${label} må være mellom ${min}-${max}"
      },
      "array": {
        "len": "Må være ${len} ${label}",
        "min": "Må være minst ${min} ${label}",
        "max": "På det meste ${max} ${label}",
        "range": "Totalt av ${label} må være mellom ${min}-${max}"
      },
      "pattern": {
        "mismatch": "${label} stemmer ikke overens med mønsteret ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Velg dato",
    "rangePlaceholder": [
      "Startdato",
      "Sluttdato"
    ]
  },
  "TimePicker": {
    "placeholder": "Velg tid",
    "rangePlaceholder": [
      "Starttid",
      "Sluttid"
    ]
  }
};

export default locale;
