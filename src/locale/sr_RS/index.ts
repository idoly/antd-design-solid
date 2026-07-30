import type { Locale } from '../types';

const locale: Locale = {
  "locale": "sr",
  "global": {
    "placeholder": "Izaberi",
    "close": "Zatvori",
    "show": "Prikaži",
    "hide": "Sakrij",
    "sortable": "sortabilno"
  },
  "Table": {
    "filterTitle": "Meni filtera",
    "filterConfirm": "U redu",
    "filterReset": "Poništi",
    "filterEmptyText": "Nema filtera",
    "emptyText": "Nema podataka",
    "selectAll": "Izaberi trenutnu stranicu",
    "selectInvert": "Obrni izbor trenutne stranice",
    "selectNone": "Obriši sve podatke",
    "selectionAll": "Izaberi sve podatke",
    "sortTitle": "Sortiraj",
    "expand": "Proširi red",
    "collapse": "Skupi red",
    "triggerDesc": "Klikni da sortiraš po padajućem redosledu",
    "triggerAsc": "Klikni da sortiraš po rastućem redosledu",
    "cancelSort": "Klikni da otkažeš sortiranje",
    "filterCheckAll": "Изаберите све ставке",
    "filterSearchPlaceholder": "Тражи у филтерима"
  },
  "Modal": {
    "okText": "U redu",
    "cancelText": "Otkaži",
    "justOkText": "U redu"
  },
  "Tour": {
    "Next": "Sledeće",
    "Previous": "Prethodno",
    "Finish": "Završi"
  },
  "Popconfirm": {
    "okText": "U redu",
    "cancelText": "Otkaži"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Pretraži ovde",
    "itemUnit": "stavka",
    "itemsUnit": "stavki",
    "remove": "Ukloni",
    "selectCurrent": "Izaberi trenutnu stranicu",
    "removeCurrent": "Ukloni trenutnu stranicu",
    "selectAll": "Izaberi sve podatke",
    "removeAll": "Ukloni sve podatke",
    "selectInvert": "Obrni izbor trenutne stranice",
    "deselectAll": "Опозовите избор свих података"
  },
  "Upload": {
    "uploading": "Otpremanje...",
    "removeFile": "Ukloni datoteku",
    "uploadError": "Greška pri otpremanju",
    "previewFile": "Pregledaj datoteku",
    "downloadFile": "Preuzmi datoteku"
  },
  "Empty": {
    "description": "Nema podataka"
  },
  "QRCode": {
    "expired": "КР код је истекао",
    "refresh": "Освежи",
    "scanned": "Скенирано"
  },
  "ColorPicker": {
    "presetEmpty": "Празан",
    "transparent": "Транспарент",
    "singleColor": "Једнобојна",
    "gradientColor": "Градијентна боја"
  },
  "Text": {
    "edit": "Uredi",
    "copy": "Kopiraj",
    "copied": "Kopirano",
    "expand": "Proširi",
    "collapse": "Колапс"
  },
  "Form": {
    "optional": "(opcionalno)",
    "defaultValidateMessages": {
      "default": "Greška pri proveri valjanosti za ${label}",
      "required": "Unesi ${label}",
      "enum": "${label} mora da bude nešto od [${enum}]",
      "whitespace": "${label} ne može biti prazan znak",
      "date": {
        "format": "${label} format datuma je nevažeći",
        "parse": "${label} se ne može konvertovati u datum",
        "invalid": "${label} je nevažeći datum"
      },
      "types": {
        "string": "${label} nije važeći ${type}",
        "method": "${label} nije važeći ${type}",
        "array": "${label} nije važeći ${type}",
        "object": "${label} nije važeći ${type}",
        "number": "${label} nije važeći ${type}",
        "date": "${label} nije važeći ${type}",
        "boolean": "${label} nije važeći ${type}",
        "integer": "${label} nije važeći ${type}",
        "float": "${label} nije važeći ${type}",
        "regexp": "${label} nije važeći ${type}",
        "email": "${label} nije važeći ${type}",
        "url": "${label} nije važeći ${type}",
        "hex": "${label} nije važeći ${type}"
      },
      "string": {
        "len": "${label} mora da sadrži ${len} znakova",
        "min": "${label} mora da sadrži bar ${min} znakova",
        "max": "${label} mora da sadrži do ${max} znakova",
        "range": "${label} mora da sadrži između ${min} i ${max} znakova"
      },
      "number": {
        "len": "${label} mora biti jednak ${len}",
        "min": "${label} mora biti najmanje ${min}",
        "max": "${label} mora biti najviše ${max}",
        "range": "${label} mora biti između ${min} i ${max}"
      },
      "array": {
        "len": "Mora biti ${len} ${label}",
        "min": "Najmanje ${min} ${label}",
        "max": "najviše ${max} ${label}",
        "range": "Iznos ${label} mora biti između ${min} i ${max}"
      },
      "pattern": {
        "mismatch": "${label} ne odgovara obrascu ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Izaberi datum",
    "rangePlaceholder": [
      "Datum početka",
      "Datum završetka"
    ]
  },
  "TimePicker": {
    "placeholder": "Izaberi vreme",
    "rangePlaceholder": [
      "Vreme početka",
      "Vreme završetka"
    ]
  }
};

export default locale;
