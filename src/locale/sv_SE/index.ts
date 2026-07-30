import type { Locale } from '../types';

const locale: Locale = {
  "locale": "sv",
  "global": {
    "placeholder": "Vänligen välj",
    "close": "Stäng",
    "show": "Visa",
    "hide": "Dölj",
    "sortable": "sorterbar"
  },
  "Table": {
    "filterTitle": "Filtermeny",
    "filterConfirm": "OK",
    "filterReset": "Återställ",
    "filterEmptyText": "Inga filter",
    "filterCheckAll": "Markera alla objekt",
    "filterSearchPlaceholder": "Sök i filter",
    "emptyText": "Ingen data",
    "selectAll": "Markera nuvarande sida",
    "selectInvert": "Invertera nuvarande sida",
    "selectNone": "Avmarkera all data",
    "selectionAll": "Markera all data",
    "sortTitle": "Sortera",
    "expand": "Expandera rad",
    "collapse": "Komprimera rad",
    "triggerDesc": "Klicka för att sortera i fallande ordning",
    "triggerAsc": "Klicka för att sortera i stigande ordning",
    "cancelSort": "Klicka för att avbryta sortering"
  },
  "Modal": {
    "okText": "OK",
    "cancelText": "Avbryt",
    "justOkText": "OK"
  },
  "Tour": {
    "Next": "Nästa",
    "Previous": "Föregående",
    "Finish": "Avsluta"
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
    "searchPlaceholder": "Sök här",
    "itemUnit": "objekt",
    "itemsUnit": "objekt",
    "remove": "Ta bort",
    "selectCurrent": "Markera nuvarande sida",
    "removeCurrent": "Ta bort nuvarande sida",
    "selectAll": "Markera all data",
    "removeAll": "Ta bort all data",
    "selectInvert": "Invertera nuvarande sida",
    "deselectAll": "Avmarkera all data"
  },
  "Upload": {
    "uploading": "Laddar upp...",
    "removeFile": "Ta bort fil",
    "uploadError": "Uppladdningsfel",
    "previewFile": "Förhandsgranska fil",
    "downloadFile": "Ladda ned fil"
  },
  "Empty": {
    "description": "Ingen data"
  },
  "QRCode": {
    "expired": "QR-koden har upphört att gälla",
    "refresh": "Uppdatera",
    "scanned": "Skannat"
  },
  "ColorPicker": {
    "presetEmpty": "Tom",
    "transparent": "Transparent",
    "singleColor": "Enfärgad",
    "gradientColor": "Gradient färg"
  },
  "Text": {
    "edit": "Redigera",
    "copy": "Kopiera",
    "copied": "Kopierad",
    "expand": "Expandera",
    "collapse": "Kollapsa"
  },
  "Form": {
    "optional": "(valfritt)",
    "defaultValidateMessages": {
      "default": "Fältvalideringsfel för ${label}",
      "required": "Vänligen fyll i ${label}",
      "enum": "${label} måste vara en av [${enum}]",
      "whitespace": "${label} kan inte vara ett tomt tecken",
      "date": {
        "format": "${label} datumformatet är ogiltigt",
        "parse": "${label} kan inte konverteras till ett datum",
        "invalid": "${label} är ett ogiltigt datum"
      },
      "types": {
        "string": "${label} är inte en giltig ${type}",
        "method": "${label} är inte en giltig ${type}",
        "array": "${label} är inte en giltig ${type}",
        "object": "${label} är inte en giltig ${type}",
        "number": "${label} är inte en giltig ${type}",
        "date": "${label} är inte en giltig ${type}",
        "boolean": "${label} är inte en giltig ${type}",
        "integer": "${label} är inte en giltig ${type}",
        "float": "${label} är inte en giltig ${type}",
        "regexp": "${label} är inte en giltig ${type}",
        "email": "${label} är inte en giltig ${type}",
        "url": "${label} är inte en giltig ${type}",
        "hex": "${label} är inte en giltig ${type}"
      },
      "string": {
        "len": "${label} måste vara ${len} tecken",
        "min": "${label} måste vara minst ${min} tecken",
        "max": "${label} måste vara högst ${max} tecken",
        "range": "${label} måste vara mellan ${min}-${max} tecken"
      },
      "number": {
        "len": "${label} måste vara lika med ${len}",
        "min": "${label} måste vara minst ${min}",
        "max": "${label} måste vara högst ${max}",
        "range": "${label} måste vara mellan ${min}-${max}"
      },
      "array": {
        "len": "Måste vara ${len} ${label}",
        "min": "Minst ${min} ${label}",
        "max": "Högst ${max} ${label}",
        "range": "Antal ${label} måste vara mellan ${min}-${max}"
      },
      "pattern": {
        "mismatch": "${label} stämmer inte överens med mönstret ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Välj datum",
    "rangePlaceholder": [
      "Startdatum",
      "Slutdatum"
    ]
  },
  "TimePicker": {
    "placeholder": "Välj tid",
    "rangePlaceholder": [
      "Starttid",
      "Sluttid"
    ]
  }
};

export default locale;
