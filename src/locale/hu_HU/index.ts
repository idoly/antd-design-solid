import type { Locale } from '../types';

const locale: Locale = {
  "locale": "hu",
  "global": {
    "close": "Bezárás",
    "show": "Megjelenítés",
    "hide": "Elrejtés",
    "placeholder": "Kérem válasszon",
    "sortable": "válogatható"
  },
  "Table": {
    "filterTitle": "Szűrők",
    "filterConfirm": "Alkalmazás",
    "filterReset": "Visszaállítás",
    "selectAll": "Jelenlegi oldal kiválasztása",
    "selectInvert": "Jelenlegi oldal inverze",
    "sortTitle": "Rendezés",
    "filterEmptyText": "Nincsenek szűrők",
    "filterCheckAll": "Válassza ki az összes elemet",
    "filterSearchPlaceholder": "Keresés a szűrőkben",
    "emptyText": "Nincs adat",
    "selectNone": "Minden adat törlése",
    "selectionAll": "Válassza ki az összes adatot",
    "expand": "Sor kibontása",
    "collapse": "Sor összecsukása",
    "triggerDesc": "Kattintson ide a csökkenő sorrendbe rendezéshez",
    "triggerAsc": "Kattintson a növekvő sorrendbe rendezéshez",
    "cancelSort": "Kattintson a rendezés megszakításához"
  },
  "Modal": {
    "okText": "Alkalmazás",
    "cancelText": "Visszavonás",
    "justOkText": "Alkalmazás"
  },
  "Tour": {
    "Next": "Következő",
    "Previous": "Előző",
    "Finish": "Befejezés"
  },
  "Popconfirm": {
    "okText": "Alkalmazás",
    "cancelText": "Visszavonás"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Keresés",
    "itemUnit": "elem",
    "itemsUnit": "elemek",
    "remove": "Távolítsa el",
    "selectCurrent": "Válassza ki az aktuális oldalt",
    "removeCurrent": "Az aktuális oldal eltávolítása",
    "selectAll": "Válassza ki az összes adatot",
    "deselectAll": "Törölje az összes adat kijelölését",
    "removeAll": "Távolítsa el az összes adatot",
    "selectInvert": "Az aktuális oldal megfordítása"
  },
  "Upload": {
    "uploading": "Feltöltés...",
    "removeFile": "Fájl eltávolítása",
    "uploadError": "Feltöltési hiba",
    "previewFile": "Fájl előnézet",
    "downloadFile": "Fájl letöltése"
  },
  "Empty": {
    "description": "Nincs adat"
  },
  "QRCode": {
    "expired": "A QR kód lejárt",
    "refresh": "Frissítés",
    "scanned": "Beolvasva"
  },
  "ColorPicker": {
    "presetEmpty": "Üres",
    "transparent": "Átlátszó",
    "singleColor": "Egyszínű",
    "gradientColor": "Gradiens szín"
  },
  "Text": {
    "edit": "Szerkesztés",
    "copy": "Másolás",
    "copied": "Másolva",
    "expand": "Bontsa ki",
    "collapse": "Összeomlás"
  },
  "Form": {
    "optional": "(választható)",
    "defaultValidateMessages": {
      "default": "${label} mező érvényesítési hibája",
      "required": "Kérjük töltse ki a(z) ${label} mezőt",
      "enum": "${label} az alábbiak egyike kell legyen: [${enum}]",
      "whitespace": "${label} nem lehet üres karakter",
      "date": {
        "format": "${label} dátum formátuma érvénytelen",
        "parse": "${label} nem konvertálható dátummá",
        "invalid": "${label} érvénytelen dátum"
      },
      "types": {
        "string": "${label} nem érvényes ${type}",
        "method": "${label} nem érvényes ${type}",
        "array": "${label} nem érvényes ${type}",
        "object": "${label} nem érvényes ${type}",
        "number": "${label} nem érvényes ${type}",
        "date": "${label} nem érvényes ${type}",
        "boolean": "${label} nem érvényes ${type}",
        "integer": "${label} nem érvényes ${type}",
        "float": "${label} nem érvényes ${type}",
        "regexp": "${label} nem érvényes ${type}",
        "email": "${label} nem érvényes ${type}",
        "url": "${label} nem érvényes ${type}",
        "hex": "${label} nem érvényes ${type}"
      },
      "string": {
        "len": "${label} pontosan ${len} karakter hosszú kell legyen",
        "min": "${label} legalább ${min} karakter hosszú kell legyen",
        "max": "${label} legfeljebb ${max} karakter hosszú lehet",
        "range": "${label} ${min}-${max} karakter hosszú kell legyen"
      },
      "number": {
        "len": "${label} pontosan ${len} kell legyen",
        "min": "${label} legalább ${min} kell legyen",
        "max": "${label} legfeljebb ${max} lehet",
        "range": "${label} ${min}-${max} közé kell esnie"
      },
      "array": {
        "len": "${label} pontosan ${len} elemet kell tartalmazzon",
        "min": "${label} legalább ${min} elemet kell tartalmazzon",
        "max": "${label} legfeljebb ${max} elemet tartalmazhat",
        "range": "${label} ${min}-${max} elemet kell tartalmazzon"
      },
      "pattern": {
        "mismatch": "${label} nem egyezik meg a ${pattern} mintával"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Válasszon dátumot",
    "rangePlaceholder": [
      "Kezdő dátum",
      "Befejezés dátuma"
    ]
  },
  "TimePicker": {
    "placeholder": "Válasszon időt",
    "rangePlaceholder": [
      "Kezdési idő",
      "Befejezési idő"
    ]
  }
};

export default locale;
