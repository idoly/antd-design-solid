import type { Locale } from '../types';

const locale: Locale = {
  "locale": "hy-am",
  "global": {
    "placeholder": "Ընտրեք",
    "close": "Դադարեցնել",
    "show": "Ցույց տալ",
    "hide": "Թաքցնել",
    "sortable": "տեսակավորելի"
  },
  "Table": {
    "filterTitle": "ֆիլտրի ընտրացանկ",
    "filterConfirm": "ֆիլտրել",
    "filterReset": "Զրոյացնել",
    "selectAll": "Ընտրեք ընթացիկ էջը",
    "selectInvert": "Փոխարկել ընթացիկ էջը",
    "sortTitle": "Տեսակավորել",
    "expand": "Ընդլայնեք տողը",
    "collapse": "Կրճատել տողը",
    "filterEmptyText": "Զտիչներ չկան",
    "filterCheckAll": "Ընտրեք բոլոր տարրերը",
    "filterSearchPlaceholder": "Որոնել ֆիլտրերում",
    "emptyText": "Տվյալներ չկան",
    "selectNone": "Մաքրել բոլոր տվյալները",
    "selectionAll": "Ընտրեք բոլոր տվյալները",
    "triggerDesc": "Սեղմեք՝ նվազման կարգով",
    "triggerAsc": "Սեղմեք՝ աճող տեսակավորելու համար",
    "cancelSort": "Սեղմեք՝ տեսակավորումը չեղարկելու համար"
  },
  "Modal": {
    "okText": "Օկ",
    "cancelText": "Չեղարկել",
    "justOkText": "Օկ"
  },
  "Tour": {
    "Next": "Հաջորդ",
    "Previous": "Նախորդ",
    "Finish": "Ավարտել"
  },
  "Popconfirm": {
    "okText": "Հաստատել",
    "cancelText": "Մերժել"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Որոնեք այստեղ",
    "itemUnit": "պարագան",
    "itemsUnit": "պարագաները",
    "remove": "Հեռացնել",
    "selectCurrent": "Ընտրեք ընթացիկ էջը",
    "removeCurrent": "Հեռացնել ընթացիկ էջը",
    "selectAll": "Ընտրեք բոլոր տվյալները",
    "deselectAll": "Ապաընտրել բոլոր տվյալները",
    "removeAll": "Հեռացրեք բոլոր տվյալները",
    "selectInvert": "Շրջել ընթացիկ էջը"
  },
  "Upload": {
    "uploading": "Ներբեռնում...",
    "removeFile": "Հեռացնել ֆայլը",
    "uploadError": "Ներբեռնման սխալ",
    "previewFile": "Դիտել ֆայլը",
    "downloadFile": "Ներբեռնել ֆայլը"
  },
  "Empty": {
    "description": "Տվյալներ չկան"
  },
  "QRCode": {
    "expired": "QR կոդը ժամկետանց է",
    "refresh": "Թարմացնել",
    "scanned": "Սկանավորվել է"
  },
  "ColorPicker": {
    "presetEmpty": "Դատարկ",
    "transparent": "Թափանցիկ",
    "singleColor": "Մեկ գույն",
    "gradientColor": "Գրադիենտ գույն"
  },
  "Text": {
    "edit": "Խմբագրել",
    "copy": "Պատճենել",
    "copied": "Պատճենվել է",
    "expand": "Տեսնել ավելին",
    "collapse": "Փլուզում"
  },
  "Form": {
    "optional": "(ոչ պարտադիր)",
    "defaultValidateMessages": {
      "default": "Դաշտի վավերականության սխալ՝ ${label}",
      "required": "Խնդրում ենք մուտքագրել ${label}",
      "enum": "${label}-ը պետք է լինի [${enum}]-ից մեկը",
      "whitespace": "${label}-ը չի կարող լինել դատարկ նիշ",
      "date": {
        "format": "${label} ամսաթվի ձևաչափը անվավեր է",
        "parse": "${label}-ը հնարավոր չէ փոխարկել ամսաթվի",
        "invalid": "${label}-ը անվավեր ամսաթիվ է"
      },
      "types": {
        "string": "${label}-ը վավեր ${type} չէ",
        "method": "${label}-ը վավեր ${type} չէ",
        "array": "${label}-ը վավեր ${type} չէ",
        "object": "${label}-ը վավեր ${type} չէ",
        "number": "${label}-ը վավեր ${type} չէ",
        "date": "${label}-ը վավեր ${type} չէ",
        "boolean": "${label}-ը վավեր ${type} չէ",
        "integer": "${label}-ը վավեր ${type} չէ",
        "float": "${label}-ը վավեր ${type} չէ",
        "regexp": "${label}-ը վավեր ${type} չէ",
        "email": "${label}-ը վավեր ${type} չէ",
        "url": "${label}-ը վավեր ${type} չէ",
        "hex": "${label}-ը վավեր ${type} չէ"
      },
      "string": {
        "len": "${label}-ը պետք է լինի ${len} նիշ",
        "min": "${label}-ը պետք է լինի առնվազն ${min} նիշ",
        "max": "${label}-ը կարող է լինել առավելագույնը ${max} նիշ",
        "range": "${label}-ը պետք է լինի ${min}-${max} նիշերի միջև"
      },
      "number": {
        "len": "${label}-ը պետք է հավասար լինի ${len}-ին",
        "min": "${label}-ը պետք է լինի առնվազն ${min}",
        "max": "${label}-ը կարող է լինել առավելագույնը ${max}",
        "range": "${label}-ը պետք է լինի ${min}-${max} միջակայքում"
      },
      "array": {
        "len": "Պետք է լինի ${len} ${label}",
        "min": "Առնվազն ${min} ${label}",
        "max": "Առավելագույնը ${max} ${label}",
        "range": "${label}-ի քանակը պետք է լինի ${min}-${max} միջակայքում"
      },
      "pattern": {
        "mismatch": "${label}-ը չի համապատասխանում ${pattern} ձևանմուշին"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Select date",
    "rangePlaceholder": [
      "Start date",
      "End date"
    ]
  },
  "TimePicker": {
    "placeholder": "Select time",
    "rangePlaceholder": [
      "Start time",
      "End time"
    ]
  }
};

export default locale;
