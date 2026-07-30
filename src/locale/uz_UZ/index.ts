import type { Locale } from '../types';

const locale: Locale = {
  "locale": "uz-latn",
  "global": {
    "placeholder": "Iltimos tanlang",
    "close": "Yopish",
    "show": "Ko'rsat",
    "hide": "Yashir",
    "sortable": "saralanadigan"
  },
  "Table": {
    "filterTitle": "Filtr",
    "filterConfirm": "OK",
    "filterReset": "Bekor qilish",
    "filterEmptyText": "Filtrlarsiz",
    "filterCheckAll": "Barcha elementlarni tanlash",
    "filterSearchPlaceholder": "Filtrlarda qidiruv",
    "emptyText": "Ma'lumotlar topilmadi",
    "selectAll": "Barchasini tanlash",
    "selectInvert": "Tanlovni aylantirish",
    "selectNone": "Barcha ma'lumotlarni tozalang",
    "selectionAll": "Barchasini tanlash",
    "sortTitle": "Tartiblash",
    "expand": "Satirni yozish",
    "collapse": "Satirni yig'ish",
    "triggerDesc": "Kamayish tartibida tartiblash uchun bosing",
    "triggerAsc": "O'sish tartibida tartiblash uchun bosing",
    "cancelSort": "Tartiblshni rad etish uchun bosing"
  },
  "Modal": {
    "okText": "OK",
    "cancelText": "Yopish",
    "justOkText": "OK"
  },
  "Tour": {
    "Next": "So'ngra",
    "Previous": "Ortga",
    "Finish": "Tugatish"
  },
  "Popconfirm": {
    "okText": "OK",
    "cancelText": "Bekor qilish"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Qidiruv",
    "itemUnit": "elem.",
    "itemsUnit": "elem.",
    "remove": "Oʻchirish",
    "selectAll": "Barch ma'lumotlarni tanlash",
    "selectCurrent": "Joriy sahifani tanlash",
    "selectInvert": "Tanlovni aylantirish",
    "removeAll": "Barcha ma'lumotlarni o'chirish",
    "removeCurrent": "Joriy sahifani o'chirish",
    "deselectAll": "Barcha ma'lumotlarni bekor qiling"
  },
  "Upload": {
    "uploading": "Yuklanmoqda...",
    "removeFile": "Faylni o'chirish",
    "uploadError": "Yuklashda xatolik yuz berdi",
    "previewFile": "Faylni oldindan ko'rish",
    "downloadFile": "Faylni yuklash"
  },
  "Empty": {
    "description": "Maʼlumot topilmadi"
  },
  "QRCode": {
    "expired": "QR-kod eskirgan",
    "refresh": "Yangilash",
    "scanned": "Skanerlangan"
  },
  "ColorPicker": {
    "presetEmpty": "Bo'sh",
    "transparent": "Shaffof",
    "singleColor": "Yagona rang",
    "gradientColor": "Gradient rangi"
  },
  "Text": {
    "edit": "Tahrirlash",
    "copy": "Nusxalash",
    "copied": "Nusxalandi",
    "expand": "Ochib qoyish",
    "collapse": "Yiqilish"
  },
  "Form": {
    "optional": "(shart emas)",
    "defaultValidateMessages": {
      "default": "${label} maydonini tekshirishda xatolik yuz berdi",
      "required": "Iltimos, ${label} kiriting",
      "enum": "${label}, [${enum}] dan biri boʻlishi kerak",
      "whitespace": "${label} boʻsh boʻlishi mumkin emas",
      "date": {
        "format": "${label} toʻgʻri sana formatida emas",
        "parse": "${label} sanaga aylantirilmaydi",
        "invalid": "${label} tog'ri sana emas"
      },
      "types": {
        "string": "${label} ${type} turi emas",
        "method": "${label} ${type} turi emas",
        "array": "${label} ${type} turi emas",
        "object": "${label} ${type} turi emas",
        "number": "${label} ${type} turi emas",
        "date": "${label} ${type} turi emas",
        "boolean": "${label} ${type} turi emas",
        "integer": "${label} ${type} turi emas",
        "float": "${label} ${type} turi emas",
        "regexp": "${label} ${type} turi emas",
        "email": "${label} ${type} turi emas",
        "url": "${label} ${type} turi emas",
        "hex": "${label} ${type} turi emas"
      },
      "string": {
        "len": "${label}, ${len} ta belgidan iborat boʻlishi kerak",
        "min": "${label} должна быть больше или равна ${min} символов",
        "max": "${label}, ${max} belgidan katta yoki teng boʻlishi kerak",
        "range": "${label} uzunligi ${min}-${max} belgilar orasida boʻlishi kerak"
      },
      "number": {
        "len": "${label}, ${len} ga teng boʻlishi kerak",
        "min": "${label}, ${min} dan katta yoki teng boʻlishi kerak",
        "max": "${label}, ${max} dan kichik yoki teng boʻlishi kerak",
        "range": "${label}, ${min}-${max} orasida boʻlishi kerak"
      },
      "array": {
        "len": "${label} elementlari soni ${len} ga teng boʻlishi kerak",
        "min": "${label} elementlari soni ${min} dan katta yoki teng boʻlishi kerak",
        "max": "${label} elementlari soni ${max} dan kam yoki teng boʻlishi kerak",
        "range": "${label} elementlari soni ${min} va ${max} orasida boʻlishi kerak"
      },
      "pattern": {
        "mismatch": "${label}, ${pattern} andazasiga mos emas"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Sanani tanlang",
    "rangePlaceholder": [
      "Boshlanish sanasi",
      "Tugallanish sanasi"
    ]
  },
  "TimePicker": {
    "placeholder": "Vaqtni tanlang",
    "rangePlaceholder": [
      "Boshlanish vaqti",
      "Tugallanish vaqti"
    ]
  }
};

export default locale;
