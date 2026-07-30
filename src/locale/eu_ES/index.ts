import type { Locale } from '../types';

const locale: Locale = {
  "locale": "eu",
  "global": {
    "placeholder": "Aukeratu",
    "close": "Itxi",
    "show": "Erakutsi",
    "hide": "Ezkutatu",
    "sortable": "ordenagarria"
  },
  "Table": {
    "filterTitle": "Iragazi menua",
    "filterConfirm": "Onartu",
    "filterReset": "Garbitu",
    "filterEmptyText": "Iragazkirik gabe",
    "filterCheckAll": "Hautatu dena",
    "filterSearchPlaceholder": "Bilatu iragazkietan",
    "emptyText": "Daturik gabe",
    "selectAll": "Hautatu dena",
    "selectInvert": "Alderantzikatu hautaketa",
    "selectNone": "Hustu dena",
    "selectionAll": "Hautatu datu guztiak",
    "sortTitle": "Ordenatu",
    "expand": "Zabaldu",
    "collapse": "Itxi",
    "triggerDesc": "Egin klik beheranzko ordenean ordenatzeko",
    "triggerAsc": "Egin klik goranzko ordenean ordenatzeko",
    "cancelSort": "Egin klik ordenamendua ezeztatzeko"
  },
  "Modal": {
    "okText": "Onartu",
    "cancelText": "Utzi",
    "justOkText": "Onartu"
  },
  "Tour": {
    "Next": "Hurrengoa",
    "Previous": "Aurrekoa",
    "Finish": "Bukatu"
  },
  "Popconfirm": {
    "okText": "Onartu",
    "cancelText": "Utzi"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Bilatu hemen",
    "itemUnit": "elementu",
    "itemsUnit": "elementuak",
    "remove": "Ezabatu",
    "selectCurrent": "Hautatu uneko orria",
    "removeCurrent": "Uneko orria ezabatu",
    "selectAll": "Datu guztiak hautatu",
    "removeAll": "Ezabatu datu guztiak",
    "selectInvert": "Uneko orrialdea alderantzikatu",
    "deselectAll": "Deshautatu datu guztiak"
  },
  "Upload": {
    "uploading": "Igotzen...",
    "removeFile": "Fitxategia ezabatu",
    "uploadError": "Errorea fitxategia igotzerakoan",
    "previewFile": "Aurrebista",
    "downloadFile": "Fitxategia deskargatu"
  },
  "Empty": {
    "description": "Ez dago daturik"
  },
  "QRCode": {
    "expired": "QR kodea kadukatuta",
    "refresh": "Freskatu",
    "scanned": "Eskaneatua"
  },
  "ColorPicker": {
    "presetEmpty": "Hustu",
    "transparent": "Gardena",
    "singleColor": "Kolore bakarra",
    "gradientColor": "Gradiente kolorea"
  },
  "Text": {
    "edit": "Editatu",
    "copy": "Kopiatu",
    "copied": "Kopiatuta",
    "expand": "Zabaldu",
    "collapse": "Tolestu"
  },
  "Form": {
    "optional": "(aukerakoa)",
    "defaultValidateMessages": {
      "default": "${label} eremuaren balidazio errorea",
      "required": "Mesedez, sartu ${label}",
      "enum": "${label} [${enum}] -tako bat izan behar da",
      "whitespace": "${label} ezin da izan karaktere zuri bat",
      "date": {
        "format": "${label} dataren formatua baliogabea da",
        "parse": "${label} ezin da data batera doitu",
        "invalid": "${label} data baliogabea da"
      },
      "types": {
        "string": "${label} ez da ${type} balioduna",
        "method": "${label} ez da ${type} balioduna",
        "array": "${label} ez da ${type} balioduna",
        "object": "${label} ez da ${type} balioduna",
        "number": "${label} ez da ${type} balioduna",
        "date": "${label} ez da ${type} balioduna",
        "boolean": "${label} ez da ${type} balioduna",
        "integer": "${label} ez da ${type} balioduna",
        "float": "${label} ez da ${type} balioduna",
        "regexp": "${label} ez da ${type} balioduna",
        "email": "${label} ez da ${type} balioduna",
        "url": "${label} ez da ${type} balioduna",
        "hex": "${label} ez da ${type} balioduna"
      },
      "string": {
        "len": "${label} eremuak ${len} karaktere izan dehar ditu",
        "min": "${label} eremuak gutxienez ${min} karaktere izan behar ditu",
        "max": "${label} eremuak gehienez ${max} karaktere izan behar ditu",
        "range": "${label} eremuak ${min}-${max} karaktere artean izan behar ditu"
      },
      "number": {
        "len": "${label} eremuaren balioa ${len} izan behar da",
        "min": "${label} eremuaren balio minimoa ${min} da",
        "max": "${label} eremuaren balio maximoa ${max} da",
        "range": "${label} eremuaren balioa ${min}-${max} artekoa izan behar da"
      },
      "array": {
        "len": "${len} ${label} izan behar dira",
        "min": "Gutxienez ${min} ${label}",
        "max": "Gehienez ${max} ${label}",
        "range": "${label} kopuruak ${min}-${max} -ra bitartekoa izan behar du"
      },
      "pattern": {
        "mismatch": "${label} ez dator bat ${pattern} patroiarekin"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Hautatu data",
    "rangePlaceholder": [
      "Hasierako data",
      "Amaiera data"
    ]
  },
  "TimePicker": {
    "placeholder": "Aukeratu ordua",
    "rangePlaceholder": [
      "Hasiera ordua",
      "Amaiera ordua"
    ]
  }
};

export default locale;
