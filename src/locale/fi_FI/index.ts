import type { Locale } from '../types';

const locale: Locale = {
  "locale": "fi",
  "global": {
    "close": "Sulje",
    "show": "Näytä",
    "hide": "Piilota",
    "placeholder": "Ole hyvä ja valitse",
    "sortable": "lajiteltava"
  },
  "Table": {
    "filterTitle": "Suodatus valikko",
    "filterConfirm": "OK",
    "filterReset": "Tyhjennä",
    "selectAll": "Valitse kaikki",
    "selectInvert": "Valitse päinvastoin",
    "sortTitle": "Lajittele",
    "triggerDesc": "Lajittele laskevasti",
    "triggerAsc": "Lajittele nousevasti",
    "cancelSort": "Peruuta lajittelu",
    "filterEmptyText": "Ei suodattimia",
    "filterCheckAll": "Valitse kaikki kohteet",
    "filterSearchPlaceholder": "Hae suodattimista",
    "emptyText": "Ei dataa",
    "selectNone": "Tyhjennä kaikki tiedot",
    "selectionAll": "Valitse kaikki tiedot",
    "expand": "Laajenna riviä",
    "collapse": "Tiivistä rivi"
  },
  "Modal": {
    "okText": "OK",
    "cancelText": "Peruuta",
    "justOkText": "OK"
  },
  "Tour": {
    "Next": "Seuraava",
    "Previous": "Edellinen",
    "Finish": "Valmis"
  },
  "Popconfirm": {
    "okText": "OK",
    "cancelText": "Peruuta"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Etsi täältä",
    "itemUnit": "kohde",
    "itemsUnit": "kohdetta",
    "remove": "Poista",
    "selectCurrent": "Valitse nykyinen sivu",
    "removeCurrent": "Poista nykyinen sivu",
    "selectAll": "Valitse kaikki tiedot",
    "deselectAll": "Poista kaikkien tietojen valinnat",
    "removeAll": "Poista kaikki tiedot",
    "selectInvert": "Kääntää nykyinen sivu"
  },
  "Upload": {
    "uploading": "Lähetetään...",
    "removeFile": "Poista tiedosto",
    "uploadError": "Virhe lähetyksessä",
    "previewFile": "Esikatsele tiedostoa",
    "downloadFile": "Lataa tiedosto"
  },
  "Empty": {
    "description": "Ei kohteita"
  },
  "QRCode": {
    "expired": "QR-koodi vanhentunut",
    "refresh": "Päivitä",
    "scanned": "Skannattu"
  },
  "ColorPicker": {
    "presetEmpty": "Tyhjä",
    "transparent": "Läpinäkyvä",
    "singleColor": "Yksivärinen",
    "gradientColor": "Gradienttiväri"
  },
  "Text": {
    "edit": "Muokkaa",
    "copy": "Kopioi",
    "copied": "Kopioitu",
    "expand": "Näytä lisää",
    "collapse": "Kutista"
  },
  "Form": {
    "optional": "(valinnainen)",
    "defaultValidateMessages": {
      "default": "Kentän ${label} vahvistus epäonnistui",
      "required": "Syötä ${label}",
      "enum": "${label} on oltava yksi seuraavista: [${enum}]",
      "whitespace": "${label} ei voi olla tyhjä",
      "date": {
        "format": "${label} päivämäärän muoto on virheellinen",
        "parse": "${label} ei voida muuntaa päivämääräksi",
        "invalid": "${label} on virheellinen päivämäärä"
      },
      "types": {
        "string": "${label} ei ole kelvollinen ${type}",
        "method": "${label} ei ole kelvollinen ${type}",
        "array": "${label} ei ole kelvollinen ${type}",
        "object": "${label} ei ole kelvollinen ${type}",
        "number": "${label} ei ole kelvollinen ${type}",
        "date": "${label} ei ole kelvollinen ${type}",
        "boolean": "${label} ei ole kelvollinen ${type}",
        "integer": "${label} ei ole kelvollinen ${type}",
        "float": "${label} ei ole kelvollinen ${type}",
        "regexp": "${label} ei ole kelvollinen ${type}",
        "email": "${label} ei ole kelvollinen ${type}",
        "url": "${label} ei ole kelvollinen ${type}",
        "hex": "${label} ei ole kelvollinen ${type}"
      },
      "string": {
        "len": "${label} täytyy olla täsmälleen ${len} merkkiä pitkä",
        "min": "${label} täytyy olla vähintään ${min} merkkiä pitkä",
        "max": "${label} saa olla enintään ${max} merkkiä pitkä",
        "range": "${label} täytyy olla ${min}–${max} merkkiä pitkä"
      },
      "number": {
        "len": "${label} täytyy olla yhtä suuri kuin ${len}",
        "min": "${label} täytyy olla vähintään ${min}",
        "max": "${label} saa olla enintään ${max}",
        "range": "${label} täytyy olla välillä ${min}–${max}"
      },
      "array": {
        "len": "${label} täytyy sisältää täsmälleen ${len} kohdetta",
        "min": "${label} täytyy sisältää vähintään ${min} kohdetta",
        "max": "${label} saa sisältää enintään ${max} kohdetta",
        "range": "${label} täytyy sisältää ${min}–${max} kohdetta"
      },
      "pattern": {
        "mismatch": "${label} ei vastaa mallia ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Valitse päivä",
    "rangePlaceholder": [
      "Alkamispäivä",
      "Päättymispäivä"
    ]
  },
  "TimePicker": {
    "placeholder": "Valitse aika",
    "rangePlaceholder": [
      "Alkuaika",
      "Loppuaika"
    ]
  }
};

export default locale;
