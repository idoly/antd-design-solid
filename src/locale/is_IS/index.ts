import type { Locale } from '../types';

const locale: Locale = {
  "locale": "is",
  "global": {
    "close": "Loka",
    "show": "Sýna",
    "hide": "Fela",
    "placeholder": "Vinsamlegast veldu",
    "sortable": "flokkanlegt"
  },
  "Table": {
    "filterTitle": "Afmarkanir",
    "filterConfirm": "Staðfesta",
    "filterReset": "Núllstilla",
    "selectAll": "Velja allt",
    "selectInvert": "Viðsnúa vali",
    "filterEmptyText": "Engar síur",
    "filterCheckAll": "Veldu alla hluti",
    "filterSearchPlaceholder": "Leitaðu í síum",
    "emptyText": "Engin gögn",
    "selectNone": "Hreinsaðu öll gögn",
    "selectionAll": "Veldu öll gögn",
    "sortTitle": "Raða",
    "expand": "Stækkaðu röð",
    "collapse": "Draga saman röð",
    "triggerDesc": "Smelltu til að raða lækkandi",
    "triggerAsc": "Smelltu til að flokka hækkandi",
    "cancelSort": "Smelltu til að hætta við flokkun"
  },
  "Modal": {
    "okText": "Áfram",
    "cancelText": "Hætta við",
    "justOkText": "Í lagi"
  },
  "Tour": {
    "Next": "Áfram",
    "Previous": "Til baka",
    "Finish": "Lokið"
  },
  "Popconfirm": {
    "okText": "Áfram",
    "cancelText": "Hætta við"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Leita hér",
    "itemUnit": "færsla",
    "itemsUnit": "færslur",
    "remove": "Fjarlægja",
    "selectCurrent": "Veldu núverandi síðu",
    "removeCurrent": "Fjarlægðu núverandi síðu",
    "selectAll": "Veldu öll gögn",
    "deselectAll": "Afvelja öll gögn",
    "removeAll": "Fjarlægðu öll gögn",
    "selectInvert": "Snúa núverandi síðu við"
  },
  "Upload": {
    "uploading": "Hleð upp...",
    "removeFile": "Fjarlægja skrá",
    "uploadError": "Villa við að hlaða upp",
    "previewFile": "Forskoða skrá",
    "downloadFile": "Hlaða niður skrá"
  },
  "Empty": {
    "description": "Engin gögn"
  },
  "QRCode": {
    "expired": "QR kóða útrunninn",
    "refresh": "Endurnýja",
    "scanned": "Skannaður"
  },
  "ColorPicker": {
    "presetEmpty": "Tómt",
    "transparent": "Gegnsætt",
    "singleColor": "Einlitur",
    "gradientColor": "Gradient litur"
  },
  "Text": {
    "edit": "Breyta",
    "copy": "Afrita",
    "copied": "Afritað",
    "expand": "Stækkaðu",
    "collapse": "Hrun"
  },
  "Form": {
    "optional": "（Valfrjálst）",
    "defaultValidateMessages": {
      "default": "Villa við staðfestingu reits ${label}",
      "required": "gjörðu svo vel að koma inn ${label}",
      "enum": "${label} verður að vera einn af [${enum}]",
      "whitespace": "${label} getur ekki verið tómur stafur",
      "date": {
        "format": "${label} dagsetningarsnið er ógilt",
        "parse": "Ekki er hægt að breyta ${label} í dag",
        "invalid": "${label} er ógild dagsetning"
      },
      "types": {
        "string": "${label} er ekki gilt ${type}",
        "method": "${label} er ekki gilt ${type}",
        "array": "${label} er ekki gilt ${type}",
        "object": "${label} er ekki gilt ${type}",
        "number": "${label} er ekki gilt ${type}",
        "date": "${label} er ekki gilt ${type}",
        "boolean": "${label} er ekki gilt ${type}",
        "integer": "${label} er ekki gilt ${type}",
        "float": "${label} er ekki gilt ${type}",
        "regexp": "${label} er ekki gilt ${type}",
        "email": "${label} er ekki gilt ${type}",
        "url": "${label} er ekki gilt ${type}",
        "hex": "${label} er ekki gilt ${type}"
      },
      "string": {
        "len": "${label} verður að vera ${len} stafir",
        "min": "${label} er að minnsta kosti ${min} stafir að lengd",
        "max": "${label} getur verið allt að ${max} stafir",
        "range": "${label} verður að vera á milli ${min}-${max} stafir"
      },
      "number": {
        "len": "${label} verður að vera jafngildi ${len}",
        "min": "Lágmarksgildi ${label} er ${mín}",
        "max": "Hámarksgildi ${label} er ${max}",
        "range": "${label} verður að vera á milli ${min}-${max}"
      },
      "array": {
        "len": "Verður að vera ${len}${label}",
        "min": "Að minnsta kosti ${min}${label}",
        "max": "Í mesta lagi ${max}${label}",
        "range": "Magn ${label} verður að vera á milli ${min}-${max}"
      },
      "pattern": {
        "mismatch": "${label} passar ekki við mynstur ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Veldu dag",
    "rangePlaceholder": [
      "Upphafsdagur",
      "Lokadagur"
    ]
  },
  "TimePicker": {
    "placeholder": "Velja tíma",
    "rangePlaceholder": [
      "Upphafstími",
      "Loktími"
    ]
  }
};

export default locale;
