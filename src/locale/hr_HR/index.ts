import type { Locale } from '../types';

const locale: Locale = {
  "locale": "hr",
  "global": {
    "placeholder": "Molimo označite",
    "close": "Zatvori",
    "show": "Prikaži",
    "hide": "Sakrij",
    "sortable": "sortibilan"
  },
  "Table": {
    "filterTitle": "Filter meni",
    "filterConfirm": "OK",
    "filterReset": "Reset",
    "filterEmptyText": "Nema filtera",
    "emptyText": "Nema podataka",
    "selectAll": "Označi trenutnu stranicu",
    "selectInvert": "Invertiraj trenutnu stranicu",
    "selectionAll": "Odaberite sve podatke",
    "sortTitle": "Sortiraj",
    "expand": "Proširi redak",
    "collapse": "Sažmi redak",
    "triggerDesc": "Kliknite za sortiranje silazno",
    "triggerAsc": "Kliknite za sortiranje uzlazno",
    "cancelSort": "Kliknite da biste otkazali sortiranje",
    "filterCheckAll": "Odaberite sve stavke",
    "filterSearchPlaceholder": "Traži u filterima",
    "selectNone": "Izbriši sve podatke"
  },
  "Modal": {
    "okText": "OK",
    "cancelText": "Odustani",
    "justOkText": "OK"
  },
  "Tour": {
    "Next": "Slijedeći",
    "Previous": "Prethodni",
    "Finish": "Završi"
  },
  "Popconfirm": {
    "okText": "OK",
    "cancelText": "Odustani"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Pretraži ovdje",
    "itemUnit": "stavka",
    "itemsUnit": "stavke",
    "remove": "Ukloniti",
    "selectCurrent": "Odaberite trenutnu stranicu",
    "removeCurrent": "Ukloni trenutnu stranicu",
    "selectAll": "Odaberite sve podatke",
    "removeAll": "Uklonite sve podatke",
    "selectInvert": "Obrni trenutnu stranicu",
    "deselectAll": "Poništi odabir svih podataka"
  },
  "Upload": {
    "uploading": "Upload u tijeku...",
    "removeFile": "Makni datoteku",
    "uploadError": "Greška kod uploada",
    "previewFile": "Pogledaj datoteku",
    "downloadFile": "Preuzmi datoteku"
  },
  "Empty": {
    "description": "Nema podataka"
  },
  "QRCode": {
    "expired": "QR kod je istekao",
    "refresh": "Osvježi",
    "scanned": "Skenirano"
  },
  "ColorPicker": {
    "presetEmpty": "Prazna",
    "transparent": "Prozirno",
    "singleColor": "Jedna boja",
    "gradientColor": "Gradijent boje"
  },
  "Text": {
    "edit": "Uredi",
    "copy": "Kopiraj",
    "copied": "Kopiranje uspješno",
    "expand": "Proširi",
    "collapse": "Sažimanje"
  },
  "Form": {
    "optional": "(neobavezno)",
    "defaultValidateMessages": {
      "default": "Pogreška provjere valjanosti polja za ${label}",
      "required": "Molimo unesite ${label}",
      "enum": "${label} mora biti jedan od [${enum}]",
      "whitespace": "${label} ne može biti prazan znak",
      "date": {
        "format": "${label} format datuma je nevažeći",
        "parse": "${label} ne može se pretvoriti u datum",
        "invalid": "${label} je nevažeći datum"
      },
      "types": {
        "string": "${label} nije valjan ${type}",
        "method": "${label} nije valjan ${type}",
        "array": "${label} nije valjan ${type}",
        "object": "${label} nije valjan ${type}",
        "number": "${label} nije valjan ${type}",
        "date": "${label} nije valjan ${type}",
        "boolean": "${label} nije valjan ${type}",
        "integer": "${label} nije valjan ${type}",
        "float": "${label} nije valjan ${type}",
        "regexp": "${label} nije valjan ${type}",
        "email": "${label} nije valjan ${type}",
        "url": "${label} nije valjan ${type}",
        "hex": "${label} nije valjan ${type}"
      },
      "string": {
        "len": "${label} mora biti ${len} slova",
        "min": "${label} mora biti najmanje ${min} slova",
        "max": "${label} mora biti do ${max} slova",
        "range": "${label} mora biti između ${min}-${max} slova"
      },
      "number": {
        "len": "${label} mora biti jednak ${len}",
        "min": "${label} mora biti minimalano ${min}",
        "max": "${label} mora biti maksimalano ${max}",
        "range": "${label} mora biti između ${min}-${max}"
      },
      "array": {
        "len": "Mora biti ${len} ${label}",
        "min": "Najmanje ${min} ${label}",
        "max": "Najviše ${max} ${label}",
        "range": "Količina ${label} mora biti između ${min}-${max}"
      },
      "pattern": {
        "mismatch": "${label} ne odgovara obrascu ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Odaberite datum",
    "rangePlaceholder": [
      "Početni datum",
      "Završni datum"
    ]
  },
  "TimePicker": {
    "placeholder": "Odaberite vrijeme",
    "rangePlaceholder": [
      "Vrijeme početka",
      "Vrijeme završetka"
    ]
  }
};

export default locale;
