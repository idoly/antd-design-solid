import type { Locale } from '../types';

const locale: Locale = {
  "locale": "lt",
  "global": {
    "placeholder": "Pasirinkite",
    "close": "Uždaryti",
    "show": "Rodyti",
    "hide": "Slėpti",
    "sortable": "rūšiuojami"
  },
  "Table": {
    "filterTitle": "Filtras",
    "filterConfirm": "Gerai",
    "filterReset": "Atstatyti",
    "filterEmptyText": "Be filtrų",
    "filterCheckAll": "Pasirinkti visus",
    "filterSearchPlaceholder": "Ieškoti filtruose",
    "emptyText": "Nėra duomenų",
    "selectAll": "Pasirinkti viską",
    "selectInvert": "Apversti pasirinkimą",
    "selectNone": "Išvalyti visus",
    "selectionAll": "Rinktis visus",
    "sortTitle": "Rikiavimas",
    "expand": "Išskleisti",
    "collapse": "Suskleisti",
    "triggerDesc": "Spustelėkite norėdami rūšiuoti mažėjančia tvarka",
    "triggerAsc": "Spustelėkite norėdami rūšiuoti didėjančia tvarka",
    "cancelSort": "Spustelėkite, kad atšauktumėte rūšiavimą"
  },
  "Modal": {
    "okText": "Taip",
    "cancelText": "Atšaukti",
    "justOkText": "Gerai"
  },
  "Tour": {
    "Next": "Kitas",
    "Previous": "Ankstesnis",
    "Finish": "Baigti"
  },
  "Popconfirm": {
    "okText": "Taip",
    "cancelText": "Atšaukti"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Paieška",
    "itemUnit": "vnt.",
    "itemsUnit": "vnt.",
    "remove": "Pašalinti",
    "selectCurrent": "Pasirinkti dabartinį puslapį",
    "removeCurrent": "Ištrinti dabartinį puslapį",
    "selectAll": "Pasirinkti viską",
    "removeAll": "Ištrinti viską",
    "selectInvert": "Apversti pasirinkimą",
    "deselectAll": "Panaikinkite visų duomenų pasirinkimą"
  },
  "Upload": {
    "uploading": "Įkeliami duomenys...",
    "removeFile": "Ištrinti failą",
    "uploadError": "Įkeliant įvyko klaida",
    "previewFile": "Failo peržiūra",
    "downloadFile": "Atsisiųsti failą"
  },
  "Empty": {
    "description": "Nėra duomenų"
  },
  "QRCode": {
    "expired": "QR kodo galiojimas baigėsi",
    "refresh": "Atnaujinti",
    "scanned": "Nuskaityta"
  },
  "ColorPicker": {
    "presetEmpty": "Tuščia",
    "transparent": "Permatomas",
    "singleColor": "Vieno spalvos",
    "gradientColor": "Gradientas"
  },
  "Text": {
    "edit": "Redaguoti",
    "copy": "Kopijuoti",
    "copied": "Nukopijuota",
    "expand": "Plačiau",
    "collapse": "Sutraukti"
  },
  "Form": {
    "optional": "(neprivaloma)",
    "defaultValidateMessages": {
      "default": "Klaida laukelyje ${label}",
      "required": "Prašome įvesti ${label}",
      "enum": "${label} turi būti vienas iš [${enum}]",
      "whitespace": "${label} negali likti tuščias",
      "date": {
        "format": "${label} neteisingas datos formatas",
        "parse": "${label} negali būti konvertuotas į datą",
        "invalid": "${label} neatitinka datos formato"
      },
      "types": {
        "string": "${label} neatitinka tipo ${type}",
        "method": "${label} neatitinka tipo ${type}",
        "array": "${label} neatitinka tipo ${type}",
        "object": "${label} neatitinka tipo ${type}",
        "number": "${label} neatitinka tipo ${type}",
        "date": "${label} neatitinka tipo ${type}",
        "boolean": "${label} neatitinka tipo ${type}",
        "integer": "${label} neatitinka tipo ${type}",
        "float": "${label} neatitinka tipo ${type}",
        "regexp": "${label} neatitinka tipo ${type}",
        "email": "${label} neatitinka tipo ${type}",
        "url": "${label} neatitinka tipo ${type}",
        "hex": "${label} neatitinka tipo ${type}"
      },
      "string": {
        "len": "${label} turi būti ${len} simbolių",
        "min": "${label} turi būti bent ${min} simbolių",
        "max": "${label} turi būti ne ilgesnis nei ${max} simbolių",
        "range": "Laukelio ${label} reikšmės ribos ${min}-${max} simbolių"
      },
      "number": {
        "len": "${label} turi būti lygi ${len}",
        "min": "${label} turi būti lygus arba didesnis už ${min}",
        "max": "${label} turi būti lygus arba mažesnis už ${max}",
        "range": "${label} turi būti tarp ${min}-${max}"
      },
      "array": {
        "len": "Pasirinktas kiekis ${label} turi būti lygus ${len}",
        "min": "Pasirinktas kiekis ${label} turi būti bent ${min}",
        "max": "Pasirinktas kiekis ${label} turi būti ne ilgesnis nei ${max}",
        "range": "Pasirinktas ${label} kiekis turi būti tarp ${min}-${max}"
      },
      "pattern": {
        "mismatch": "${label} neatitinka modelio ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Pasirinkite datą",
    "rangePlaceholder": [
      "Pradžios data",
      "Pabaigos data"
    ]
  },
  "TimePicker": {
    "placeholder": "Pasirinkite laiką",
    "rangePlaceholder": [
      "Pradžios laikas",
      "Pabaigos laikas"
    ]
  }
};

export default locale;
