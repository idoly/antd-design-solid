import type { Locale } from '../types';

const locale: Locale = {
  "locale": "nl",
  "global": {
    "placeholder": "Maak een selectie",
    "close": "Sluiten",
    "show": "Weergeven",
    "hide": "Verbergen",
    "sortable": "sorteerbaar"
  },
  "Table": {
    "cancelSort": "Klik om sortering te annuleren",
    "collapse": "Rij inklappen",
    "emptyText": "Geen data",
    "expand": "Rij uitklappen",
    "filterConfirm": "OK",
    "filterEmptyText": "Geen filters",
    "filterReset": "Reset",
    "filterTitle": "Filteren",
    "selectAll": "Selecteer huidige pagina",
    "selectInvert": "Keer volgorde om",
    "selectNone": "Maak selectie leeg",
    "selectionAll": "Selecteer alle data",
    "sortTitle": "Sorteren",
    "triggerAsc": "Klik om oplopend te sorteren",
    "triggerDesc": "Klik om aflopend te sorteren",
    "filterCheckAll": "Selecteer alle artikelen",
    "filterSearchPlaceholder": "Zoek in filters"
  },
  "Modal": {
    "okText": "OK",
    "cancelText": "Annuleer",
    "justOkText": "OK"
  },
  "Tour": {
    "Next": "Volgende",
    "Previous": "Vorige",
    "Finish": "Voltooien"
  },
  "Popconfirm": {
    "okText": "OK",
    "cancelText": "Annuleer"
  },
  "Transfer": {
    "itemUnit": "item",
    "itemsUnit": "items",
    "remove": "Verwijder",
    "removeAll": "Verwijder alles",
    "removeCurrent": "Verwijder huidige pagina",
    "searchPlaceholder": "Zoek hier",
    "selectAll": "Selecteer alles",
    "selectCurrent": "Selecteer huidige pagina",
    "selectInvert": "Huidige pagina omkeren",
    "titles": [
      "",
      ""
    ],
    "deselectAll": "Deselecteer alle gegevens"
  },
  "Upload": {
    "downloadFile": "Bestand downloaden",
    "previewFile": "Preview file",
    "removeFile": "Verwijder bestand",
    "uploadError": "Fout tijdens uploaden",
    "uploading": "Uploaden..."
  },
  "Empty": {
    "description": "Geen gegevens"
  },
  "QRCode": {
    "expired": "QR-code verlopen",
    "refresh": "Vernieuwen",
    "scanned": "Gescand"
  },
  "ColorPicker": {
    "presetEmpty": "Leeg",
    "transparent": "Transparant",
    "singleColor": "Enkele kleur",
    "gradientColor": "Kleurverloop"
  },
  "Text": {
    "edit": "Bewerken",
    "copy": "kopiëren",
    "copied": "Gekopieerd",
    "expand": "Uitklappen",
    "collapse": "Samenvouwen"
  },
  "Form": {
    "optional": "(optioneel)",
    "defaultValidateMessages": {
      "default": "Validatiefout voor ${label}",
      "required": "Gelieve ${label} in te vullen",
      "enum": "${label} moet één van [${enum}] zijn",
      "whitespace": "${label} mag geen blanco teken zijn",
      "date": {
        "format": "${label} heeft een ongeldig formaat",
        "parse": "${label} kan niet naar een datum omgezet worden",
        "invalid": "${label} is een ongeldige datum"
      },
      "types": {
        "string": "${label} is geen geldige ${type}",
        "method": "${label} is geen geldige ${type}",
        "array": "${label} is geen geldige ${type}",
        "object": "${label} is geen geldige ${type}",
        "number": "${label} is geen geldige ${type}",
        "date": "${label} is geen geldige ${type}",
        "boolean": "${label} is geen geldige ${type}",
        "integer": "${label} is geen geldige ${type}",
        "float": "${label} is geen geldige ${type}",
        "regexp": "${label} is geen geldige ${type}",
        "email": "${label} is geen geldige ${type}",
        "url": "${label} is geen geldige ${type}",
        "hex": "${label} is geen geldige ${type}"
      },
      "string": {
        "len": "${label} moet ${len} karakters lang zijn",
        "min": "${label} moet minimaal ${min} karakters lang zijn",
        "max": "${label} mag maximaal ${max} karakters lang zijn",
        "range": "${label} moet tussen ${min}-${max} karakters lang zijn"
      },
      "number": {
        "len": "${label} moet gelijk zijn aan ${len}",
        "min": "${label} moet minimaal ${min} zijn",
        "max": "${label} mag maximaal ${max} zijn",
        "range": "${label} moet tussen ${min}-${max} liggen"
      },
      "array": {
        "len": "Moeten ${len} ${label} zijn",
        "min": "Minimaal ${min} ${label}",
        "max": "maximaal ${max} ${label}",
        "range": "Het aantal ${label} moet tussen ${min}-${max} liggen"
      },
      "pattern": {
        "mismatch": "${label} komt niet overeen met het patroon ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Selecteer datum",
    "rangePlaceholder": [
      "Begin datum",
      "Eind datum"
    ]
  },
  "TimePicker": {
    "placeholder": "Selecteer tijd",
    "rangePlaceholder": [
      "Start tijd",
      "Eind tijd"
    ]
  }
};

export default locale;
