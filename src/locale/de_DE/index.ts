import type { Locale } from '../types';

const locale: Locale = {
  "locale": "de",
  "global": {
    "placeholder": "Bitte auswählen",
    "close": "Schließen",
    "show": "Anzeigen",
    "hide": "Ausblenden",
    "sortable": "sortierbar"
  },
  "Table": {
    "filterTitle": "Filter-Menü",
    "filterConfirm": "OK",
    "filterReset": "Zurücksetzen",
    "filterEmptyText": "Keine Filter",
    "filterSearchPlaceholder": "Suche in Filtern",
    "filterCheckAll": "Alle auswählen",
    "selectAll": "Selektiere Alle",
    "selectInvert": "Selektion Invertieren",
    "selectionAll": "Wählen Sie alle Daten aus",
    "sortTitle": "Sortieren",
    "emptyText": "Keine Daten",
    "expand": "Zeile erweitern",
    "collapse": "Zeile reduzieren",
    "triggerDesc": "Klicken zur absteigenden Sortierung",
    "triggerAsc": "Klicken zur aufsteigenden Sortierung",
    "cancelSort": "Klicken zum Abbrechen der Sortierung",
    "selectNone": "Alle Daten löschen"
  },
  "Modal": {
    "okText": "OK",
    "cancelText": "Abbrechen",
    "justOkText": "OK"
  },
  "Tour": {
    "Next": "Weiter",
    "Previous": "Zurück",
    "Finish": "Fertig"
  },
  "Popconfirm": {
    "okText": "OK",
    "cancelText": "Abbrechen"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Suchen",
    "itemUnit": "Eintrag",
    "itemsUnit": "Einträge",
    "remove": "Entfernen",
    "selectCurrent": "Alle auf aktueller Seite auswählen",
    "removeCurrent": "Auswahl auf aktueller Seite aufheben",
    "selectAll": "Alle auswählen",
    "deselectAll": "Alle abwählen",
    "removeAll": "Auswahl aufheben",
    "selectInvert": "Auswahl umkehren"
  },
  "Upload": {
    "uploading": "Hochladen...",
    "removeFile": "Datei entfernen",
    "uploadError": "Fehler beim Hochladen",
    "previewFile": "Dateivorschau",
    "downloadFile": "Download-Datei"
  },
  "Empty": {
    "description": "Keine Daten"
  },
  "QRCode": {
    "expired": "QR-Code abgelaufen",
    "refresh": "Aktualisieren",
    "scanned": "Gescannt"
  },
  "ColorPicker": {
    "presetEmpty": "Leer",
    "transparent": "Transparent",
    "singleColor": "Einfarbig",
    "gradientColor": "Farbverlauf"
  },
  "Text": {
    "edit": "Bearbeiten",
    "copy": "Kopieren",
    "copied": "Kopiert",
    "expand": "Erweitern",
    "collapse": "Zusammenbruch"
  },
  "Form": {
    "optional": "(optional)",
    "defaultValidateMessages": {
      "default": "Feld-Validierungsfehler: ${label}",
      "required": "Bitte geben Sie ${label} an",
      "enum": "${label} muss eines der folgenden sein [${enum}]",
      "whitespace": "${label} darf kein Leerzeichen sein",
      "date": {
        "format": "${label} ist ein ungültiges Datumsformat",
        "parse": "${label} kann nicht in ein Datum umgewandelt werden",
        "invalid": "${label} ist ein ungültiges Datum"
      },
      "types": {
        "string": "${label} ist nicht gültig. ${type} erwartet",
        "method": "${label} ist nicht gültig. ${type} erwartet",
        "array": "${label} ist nicht gültig. ${type} erwartet",
        "object": "${label} ist nicht gültig. ${type} erwartet",
        "number": "${label} ist nicht gültig. ${type} erwartet",
        "date": "${label} ist nicht gültig. ${type} erwartet",
        "boolean": "${label} ist nicht gültig. ${type} erwartet",
        "integer": "${label} ist nicht gültig. ${type} erwartet",
        "float": "${label} ist nicht gültig. ${type} erwartet",
        "regexp": "${label} ist nicht gültig. ${type} erwartet",
        "email": "${label} ist nicht gültig. ${type} erwartet",
        "url": "${label} ist nicht gültig. ${type} erwartet",
        "hex": "${label} ist nicht gültig. ${type} erwartet"
      },
      "string": {
        "len": "${label} muss genau ${len} Zeichen lang sein",
        "min": "${label} muss mindestens ${min} Zeichen lang sein",
        "max": "${label} darf höchstens ${max} Zeichen lang sein",
        "range": "${label} muss zwischen ${min} und ${max} Zeichen lang sein"
      },
      "number": {
        "len": "${label} muss gleich ${len} sein",
        "min": "${label} muss mindestens ${min} sein",
        "max": "${label} darf maximal ${max} sein",
        "range": "${label} muss zwischen ${min} und ${max} liegen"
      },
      "array": {
        "len": "Es müssen ${len} ${label} sein",
        "min": "Es müssen mindestens ${min} ${label} sein",
        "max": "Es dürfen maximal ${max} ${label} sein",
        "range": "Die Anzahl an ${label} muss zwischen ${min} und ${max} liegen"
      },
      "pattern": {
        "mismatch": "${label} entspricht nicht dem ${pattern} Muster"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Datum auswählen",
    "rangePlaceholder": [
      "Startdatum",
      "Enddatum"
    ]
  },
  "TimePicker": {
    "placeholder": "Zeit auswählen",
    "rangePlaceholder": [
      "Startzeit",
      "Endzeit"
    ]
  }
};

export default locale;
