import type { Locale } from '../types';

const locale: Locale = {
  "locale": "sl",
  "global": {
    "close": "Zapri",
    "show": "Prikaži",
    "hide": "Skrij",
    "placeholder": "Prosim izberite",
    "sortable": "razvrstljiv"
  },
  "Table": {
    "filterTitle": "Filter",
    "filterConfirm": "Filtriraj",
    "filterReset": "Pobriši filter",
    "selectAll": "Izberi vse na trenutni strani",
    "selectInvert": "Obrni izbor na trenutni strani",
    "filterEmptyText": "Brez filtrov",
    "filterCheckAll": "Izberite vse elemente",
    "filterSearchPlaceholder": "Išči v filtrih",
    "emptyText": "Ni podatkov",
    "selectNone": "Počisti vse podatke",
    "selectionAll": "Izberite vse podatke",
    "sortTitle": "Razvrsti",
    "expand": "Razširi vrstico",
    "collapse": "Strni vrstico",
    "triggerDesc": "Kliknite za razvrščanje padajoče",
    "triggerAsc": "Kliknite za razvrščanje naraščajoče",
    "cancelSort": "Kliknite za preklic razvrščanja"
  },
  "Modal": {
    "okText": "V redu",
    "cancelText": "Prekliči",
    "justOkText": "V redu"
  },
  "Tour": {
    "Next": "Naprej",
    "Previous": "Prejšnje",
    "Finish": "Končaj"
  },
  "Popconfirm": {
    "okText": "v redu",
    "cancelText": "Prekliči"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Išči tukaj",
    "itemUnit": "Objekt",
    "itemsUnit": "Objektov",
    "remove": "Odstrani",
    "selectCurrent": "Izberite trenutno stran",
    "removeCurrent": "Odstrani trenutno stran",
    "selectAll": "Izberite vse podatke",
    "deselectAll": "Počisti vse podatke",
    "removeAll": "Odstrani vse podatke",
    "selectInvert": "Obrni trenutno stran"
  },
  "Upload": {
    "uploading": "Nalaganje...",
    "removeFile": "Odstrani datoteko",
    "uploadError": "Napaka pri nalaganju",
    "previewFile": "Predogled datoteke",
    "downloadFile": "Prenos datoteke"
  },
  "Empty": {
    "description": "Ni podatkov"
  },
  "QRCode": {
    "expired": "Koda QR je potekla",
    "refresh": "Osveži",
    "scanned": "skenirano"
  },
  "ColorPicker": {
    "presetEmpty": "prazno",
    "transparent": "Transparentna",
    "singleColor": "Enobarvna",
    "gradientColor": "Prelivna barva"
  },
  "Text": {
    "edit": "Uredi",
    "copy": "Kopiraj",
    "copied": "Kopirano",
    "expand": "Razširi",
    "collapse": "Strni"
  },
  "Form": {
    "optional": "(neobvezno)",
    "defaultValidateMessages": {
      "default": "Napaka pri preverjanju veljavnosti polja: ${label}",
      "required": "Prosimo, vnesite ${label}",
      "enum": "${label} mora biti eden od [${enum}]",
      "whitespace": "${label} ne sme biti prazen znak",
      "date": {
        "format": "${label} format datuma je neveljaven",
        "parse": "${label} ni mogoče pretvoriti v datum",
        "invalid": "${label} je neveljaven datum"
      },
      "types": {
        "string": "${label} ni veljaven ${type}",
        "method": "${label} ni veljaven ${type}",
        "array": "${label} ni veljaven ${type}",
        "object": "${label} ni veljaven ${type}",
        "number": "${label} ni veljaven ${type}",
        "date": "${label} ni veljaven ${type}",
        "boolean": "${label} ni veljaven ${type}",
        "integer": "${label} ni veljaven ${type}",
        "float": "${label} ni veljaven ${type}",
        "regexp": "${label} ni veljaven ${type}",
        "email": "${label} ni veljaven ${type}",
        "url": "${label} ni veljaven ${type}",
        "hex": "${label} ni veljaven ${type}"
      },
      "string": {
        "len": "${label} mora biti ${len} znakov",
        "min": "${label} mora biti vsaj ${min} znakov",
        "max": "${label} je lahko do ${max} znakov",
        "range": "${label} mora biti med ${min}-${max} znaki"
      },
      "number": {
        "len": "${label} mora biti enako ${len}",
        "min": "${label} mora biti najmanj ${min}",
        "max": "${label} je lahko največ ${max}",
        "range": "${label} mora biti med ${min}-${max}"
      },
      "array": {
        "len": "Biti mora ${len} ${label}",
        "min": "Vsaj ${min} ${label}",
        "max": "Največ ${max} ${label}",
        "range": "Količina ${label} mora biti med ${min}-${max}"
      },
      "pattern": {
        "mismatch": "${label} se ne ujema z vzorcem ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Izberite datum",
    "rangePlaceholder": [
      "Začetni datum",
      "Končni datum"
    ]
  },
  "TimePicker": {
    "placeholder": "Izberite čas",
    "rangePlaceholder": [
      "Začetni čas",
      "Končni čas"
    ]
  }
};

export default locale;
