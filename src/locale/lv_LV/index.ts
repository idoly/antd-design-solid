import type { Locale } from '../types';

const locale: Locale = {
  "locale": "lv",
  "global": {
    "close": "Aizvērt",
    "show": "Rādīt",
    "hide": "Slēpt",
    "placeholder": "Lūdzu, atlasiet",
    "sortable": "šķirojams"
  },
  "Table": {
    "filterTitle": "Filtrēšanas izvēlne",
    "filterConfirm": "OK",
    "filterReset": "Atiestatīt",
    "selectAll": "Atlasiet pašreizējo lapu",
    "selectInvert": "Pārvērst pašreizējo lapu",
    "filterEmptyText": "Nav filtru",
    "filterCheckAll": "Atlasiet visus vienumus",
    "filterSearchPlaceholder": "Meklēt filtros",
    "emptyText": "Nav datu",
    "selectNone": "Notīrīt visus datus",
    "selectionAll": "Atlasiet visus datus",
    "sortTitle": "Kārtot",
    "expand": "Izvērst rindu",
    "collapse": "Sakļaut rindu",
    "triggerDesc": "Noklikšķiniet, lai kārtotu dilstošā secībā",
    "triggerAsc": "Noklikšķiniet, lai kārtotu augošā secībā",
    "cancelSort": "Noklikšķiniet, lai atceltu kārtošanu"
  },
  "Modal": {
    "okText": "OK",
    "cancelText": "Atcelt",
    "justOkText": "OK"
  },
  "Tour": {
    "Next": "Nākamais",
    "Previous": "Iepriekšējais",
    "Finish": "Pabeigt"
  },
  "Popconfirm": {
    "okText": "OK",
    "cancelText": "Atcelt"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Meklēt šeit",
    "itemUnit": "vienumu",
    "itemsUnit": "vienumus",
    "remove": "Noņemt",
    "selectCurrent": "Atlasiet pašreizējo lapu",
    "removeCurrent": "Noņemt pašreizējo lapu",
    "selectAll": "Atlasiet visus datus",
    "deselectAll": "Noņemiet visu datu atlasi",
    "removeAll": "Noņemiet visus datus",
    "selectInvert": "Apgriezt pašreizējo lapu"
  },
  "Upload": {
    "uploading": "Augšupielāde...",
    "removeFile": "Noņemt failu",
    "uploadError": "Augšupielādes kļūda",
    "previewFile": "Priekšskatiet failu",
    "downloadFile": "Lejupielādēt failu"
  },
  "Empty": {
    "description": "Nav datu"
  },
  "QRCode": {
    "expired": "QR kods ir beidzies",
    "refresh": "Atsvaidzināt",
    "scanned": "Skenēts"
  },
  "ColorPicker": {
    "presetEmpty": "Tukšs",
    "transparent": "Caurspīdīgs",
    "singleColor": "Vienkrāsains",
    "gradientColor": "Gradienta krāsa"
  },
  "Text": {
    "edit": "Rediģēt",
    "copy": "Kopēt",
    "copied": "Kopēts",
    "expand": "Izvērst",
    "collapse": "Sakļaut"
  },
  "Form": {
    "optional": "(pēc izvēles)",
    "defaultValidateMessages": {
      "default": "Lauka ${label} validācijas kļūda",
      "required": "Lūdzu ievadiet ${label}",
      "enum": "${label} ir jābūt vienam no: [${enum}]",
      "whitespace": "${label} nevar būt tukša rakstzīme",
      "date": {
        "format": "${label} datuma formāts ir nederīgs",
        "parse": "${label} nav iespējams konvertēt par datumu",
        "invalid": "${label} ir nederīgs datums"
      },
      "types": {
        "string": "${label} nav derīgs ${type}",
        "method": "${label} nav derīgs ${type}",
        "array": "${label} nav derīgs ${type}",
        "object": "${label} nav derīgs ${type}",
        "number": "${label} nav derīgs ${type}",
        "date": "${label} nav derīgs ${type}",
        "boolean": "${label} nav derīgs ${type}",
        "integer": "${label} nav derīgs ${type}",
        "float": "${label} nav derīgs ${type}",
        "regexp": "${label} nav derīgs ${type}",
        "email": "${label} nav derīgs ${type}",
        "url": "${label} nav derīgs ${type}",
        "hex": "${label} nav derīgs ${type}"
      },
      "string": {
        "len": "${label} jābūt tieši ${len} rakstzīmju garam",
        "min": "${label} jābūt vismaz ${min} rakstzīmju garam",
        "max": "${label} drīkst būt ne vairāk kā ${max} rakstzīmes",
        "range": "${label} jābūt ${min}–${max} rakstzīmju garam"
      },
      "number": {
        "len": "${label} jābūt vienādam ar ${len}",
        "min": "${label} jābūt vismaz ${min}",
        "max": "${label} drīkst būt ne vairāk kā ${max}",
        "range": "${label} jābūt starp ${min}–${max}"
      },
      "array": {
        "len": "${label} jāsatur tieši ${len} elements(-i)",
        "min": "${label} jāsatur vismaz ${min} elements(-i)",
        "max": "${label} drīkst saturēt ne vairāk kā ${max} elementus",
        "range": "${label} jāsatur ${min}–${max} elementi"
      },
      "pattern": {
        "mismatch": "${label} neatbilst šablonam ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Izvēlieties datumu",
    "rangePlaceholder": [
      "Sākuma datums",
      "Beigu datums"
    ]
  },
  "TimePicker": {
    "placeholder": "Izvēlieties laiku",
    "rangePlaceholder": [
      "Sākuma laiks",
      "Beigu laiks"
    ]
  }
};

export default locale;
