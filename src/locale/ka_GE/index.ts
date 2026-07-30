import type { Locale } from '../types';

const locale: Locale = {
  "locale": "ka",
  "global": {
    "placeholder": "გთხოვთ აირჩიოთ",
    "close": "დახურვა",
    "show": "აჩვენე",
    "hide": "დამალე",
    "sortable": "დასალაგებელი"
  },
  "Table": {
    "filterTitle": "ფილტრის მენიუ",
    "filterConfirm": "კარგი",
    "filterReset": "გასუფთავება",
    "filterEmptyText": "ფილტრები არაა",
    "emptyText": "ინფორმაცია არაა",
    "selectAll": "აირჩიეთ მიმდინარე გვერდი",
    "selectInvert": "შეაბრუნეთ მიმდინარე გვერდი",
    "selectNone": "მონაცემების გასუფთავება",
    "selectionAll": "ყველას მონიშვნა",
    "sortTitle": "დალაგება",
    "expand": "სტრიქონის გაშლა",
    "collapse": "სტრიქონის შეკუმშვა",
    "triggerDesc": "დაღმავალი დალაგება",
    "triggerAsc": "აღმავალი დალაგება",
    "cancelSort": "დალაგების გაუქმება",
    "filterCheckAll": "აირჩიეთ ყველა ელემენტი",
    "filterSearchPlaceholder": "მოძებნეთ ფილტრებში"
  },
  "Modal": {
    "okText": "კარგი",
    "cancelText": "გაუქმება",
    "justOkText": "ოკ"
  },
  "Tour": {
    "Next": "მომდევნო",
    "Previous": "წინა",
    "Finish": "დასრულება"
  },
  "Popconfirm": {
    "okText": "კარგი",
    "cancelText": "გაუქმება"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "მოძებნე აქ",
    "itemUnit": "ერთეული",
    "itemsUnit": "ერთეულები",
    "remove": "ამოშლა",
    "selectCurrent": "მიმდინარე გვერდის არჩევა",
    "removeCurrent": "მიმდინარე გვერდის ამოშლა",
    "selectAll": "ყველას მონიშვნა",
    "removeAll": "ყველას წაშლა",
    "selectInvert": "მიმდინარე გვერდის შებრუნება",
    "deselectAll": "გააუქმეთ ყველა მონაცემი"
  },
  "Upload": {
    "uploading": "იტვირთება...",
    "removeFile": "ფაილის ამოშლა",
    "uploadError": "ატვირთვის შეცდომა",
    "previewFile": "ფაილის გადახედვა",
    "downloadFile": "ფაილის ჩამოტვირთვა"
  },
  "Empty": {
    "description": "ინფორმაცია არაა"
  },
  "QRCode": {
    "expired": "QR კოდს ვადა გაუვიდა",
    "refresh": "განაახლეთ",
    "scanned": "დასკანირებულია"
  },
  "ColorPicker": {
    "presetEmpty": "ცარიელი",
    "transparent": "გამჭვირვალე",
    "singleColor": "ერთი ფერი",
    "gradientColor": "გრადიენტური ფერი"
  },
  "Text": {
    "edit": "რედაქტირება",
    "copy": "ასლი",
    "copied": "ასლი აღებულია",
    "expand": "გაშლა",
    "collapse": "კოლაფსი"
  },
  "Form": {
    "optional": "(არასავალდებულო)",
    "defaultValidateMessages": {
      "default": "ველის შემოწმების შეცდომა ${label}-ისთვის",
      "required": "გთხოვთ შეიყვანეთ ${label}",
      "enum": "${label} უნდა იყოს ერთ-ერთი [${enum}]-დან",
      "whitespace": "${label} არ შეიძლება იყოს ცარიელი სიმბოლო",
      "date": {
        "format": "${label} თარიღის ფორმატი არასწორია",
        "parse": "${label} თარიღში კონვერტირება არ არის შესაძლებელი",
        "invalid": "${label} არასწორი თარიღია"
      },
      "types": {
        "string": "${label} არ არის სწორი ${type}",
        "method": "${label} არ არის სწორი ${type}",
        "array": "${label} არ არის სწორი ${type}",
        "object": "${label} არ არის სწორი ${type}",
        "number": "${label} არ არის სწორი ${type}",
        "date": "${label} არ არის სწორი ${type}",
        "boolean": "${label} არ არის სწორი ${type}",
        "integer": "${label} არ არის სწორი ${type}",
        "float": "${label} არ არის სწორი ${type}",
        "regexp": "${label} არ არის სწორი ${type}",
        "email": "${label} არ არის სწორი ${type}",
        "url": "${label} არ არის სწორი ${type}",
        "hex": "${label} არ არის სწორი ${type}"
      },
      "string": {
        "len": "${label} უნდა იყოს ${len} სიმბოლო",
        "min": "${label} უნდა იყოს სულ მცირე ${min} სიმბოლო",
        "max": "${label} უნდა იყოს მაქსიმუმ ${max} სიმბოლო",
        "range": "${label} უნდა იყოს ${min}-${max} სიმბოლოს შორის"
      },
      "number": {
        "len": "${label} უნდა იყოს ${len} ტოლი",
        "min": "${label} უნდა იყოს მინუმიმ ${min}",
        "max": "${label} უნდა იყოს მაქსიმუმ ${max}",
        "range": "${label} უნდა იყოს ${min}-${max} შორის"
      },
      "array": {
        "len": "უნდა იყოს ${len} ${label}",
        "min": "სულ მცირე ${min} ${label}",
        "max": "არაუმეტეს ${max} ${label}",
        "range": "${label}-ის რაოდენობა უნდა იყოს ${min}-${max} შორის"
      },
      "pattern": {
        "mismatch": "${label} არ ერგება შაბლონს ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "აირჩიეთ თარიღი",
    "rangePlaceholder": [
      "საწყისი თარიღი",
      "საბოლოო თარიღი"
    ]
  },
  "TimePicker": {
    "placeholder": "აირჩიეთ დრო",
    "rangePlaceholder": [
      "საწყისი თარიღი",
      "საბოლოო თარიღი"
    ]
  }
};

export default locale;
