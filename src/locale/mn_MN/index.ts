import type { Locale } from '../types';

const locale: Locale = {
  "locale": "mn-mn",
  "global": {
    "placeholder": "Сонгоно уу",
    "close": "Хаах",
    "show": "Харуулах",
    "hide": "Нуух",
    "sortable": "ангилах боломжтой"
  },
  "Table": {
    "filterTitle": "Хайх цэс",
    "filterConfirm": "Тийм",
    "filterReset": "Цэвэрлэх",
    "filterEmptyText": "Шүүлтүүр байхгүй",
    "filterCheckAll": "Бүх зүйлийг сонгоно уу",
    "filterSearchPlaceholder": "Шүүлтүүрээс хайх",
    "emptyText": "Өгөгдөл алга",
    "selectAll": "Бүгдийг сонгох",
    "selectInvert": "Бусдыг сонгох",
    "selectNone": "Бүх өгөгдлийг арилгах",
    "selectionAll": "Бүх өгөгдлийг сонгоно уу",
    "sortTitle": "Эрэмбэлэх",
    "expand": "Мөрийг өргөжүүлэх",
    "collapse": "Мөрийг буулгах",
    "triggerDesc": "Буурах байдлаар эрэмбэлэхийн тулд товшино уу",
    "triggerAsc": "Өсөхөөр эрэмбэлэхийн тулд товшино уу",
    "cancelSort": "Эрэмбэлэхийг цуцлахын тулд товшино уу"
  },
  "Modal": {
    "okText": "Тийм",
    "cancelText": "Цуцлах",
    "justOkText": "Тийм"
  },
  "Tour": {
    "Next": "Дараах",
    "Previous": "Урд",
    "Finish": "Төгсгөх"
  },
  "Popconfirm": {
    "okText": "Тийм",
    "cancelText": "Цуцлах"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Хайх",
    "itemUnit": "Зүйл",
    "itemsUnit": "Зүйлүүд",
    "remove": "Устгах",
    "selectCurrent": "Одоогийн хуудсыг сонгоно уу",
    "removeCurrent": "Одоогийн хуудсыг устгана уу",
    "selectAll": "Бүх өгөгдлийг сонгоно уу",
    "removeAll": "Бүх өгөгдлийг устгана уу",
    "selectInvert": "Одоогийн хуудсыг эргүүлэх",
    "deselectAll": "Бүх өгөгдлийн сонголтыг цуцлах"
  },
  "Upload": {
    "uploading": "Хуулж байна...",
    "removeFile": "Файл устгах",
    "uploadError": "Хуулахад алдаа гарлаа",
    "previewFile": "Файлыг түргэн үзэх",
    "downloadFile": "Файлыг татах"
  },
  "Empty": {
    "description": "Мэдээлэл байхгүй байна"
  },
  "QRCode": {
    "expired": "QR кодын хугацаа дууссан",
    "refresh": "Сэргээх",
    "scanned": "Сканнердсан"
  },
  "ColorPicker": {
    "presetEmpty": "Хоосон",
    "transparent": "Ил тод",
    "singleColor": "Ганц өнгө",
    "gradientColor": "Градиент өнгө"
  },
  "Text": {
    "edit": "Засварлах",
    "copy": "Хуулбарлах",
    "copied": "Хуулсан",
    "expand": "Өргөтгөх",
    "collapse": "Нурах"
  },
  "Form": {
    "optional": "(сонголттой)",
    "defaultValidateMessages": {
      "default": "${label}-ийн талбарын баталгаажуулалтын алдаа",
      "required": "${label} оруулна уу",
      "enum": "${label} нь [${enum}]-ийн нэг байх ёстой",
      "whitespace": "${label} нь хоосон тэмдэгт байж болохгүй",
      "date": {
        "format": "${label} огнооны формат буруу байна",
        "parse": "${label}-г огноо руу хөрвүүлэх боломжгүй",
        "invalid": "${label} нь хүчингүй огноо юм"
      },
      "types": {
        "string": "${label} нь хүчинтэй ${type} биш",
        "method": "${label} нь хүчинтэй ${type} биш",
        "array": "${label} нь хүчинтэй ${type} биш",
        "object": "${label} нь хүчинтэй ${type} биш",
        "number": "${label} нь хүчинтэй ${type} биш",
        "date": "${label} нь хүчинтэй ${type} биш",
        "boolean": "${label} нь хүчинтэй ${type} биш",
        "integer": "${label} нь хүчинтэй ${type} биш",
        "float": "${label} нь хүчинтэй ${type} биш",
        "regexp": "${label} нь хүчинтэй ${type} биш",
        "email": "${label} нь хүчинтэй ${type} биш",
        "url": "${label} нь хүчинтэй ${type} биш",
        "hex": "${label} нь хүчинтэй ${type} биш"
      },
      "string": {
        "len": "${label} ${len} тэмдэгттэй байх ёстой",
        "min": "${label} хамгийн багадаа ${min} тэмдэгттэй байх ёстой",
        "max": "${label} нь ${max} хүртэлх тэмдэгттэй байх ёстой",
        "range": "${label} ${min}-${max} тэмдэгтийн хооронд байх ёстой"
      },
      "number": {
        "len": "${label} нь ${len}-тэй тэнцүү байх ёстой",
        "min": "${label} хамгийн багадаа ${min} байх ёстой",
        "max": "${label} дээд тал нь ${max} байх ёстой",
        "range": "${label} ${min}-${max} хооронд байх ёстой"
      },
      "array": {
        "len": "${len} ${label} байх ёстой",
        "min": "Дор хаяж ${мин} ${label}",
        "max": "Хамгийн ихдээ ${max} ${label}",
        "range": "${label}-н хэмжээ ${min}-${max} хооронд байх ёстой"
      },
      "pattern": {
        "mismatch": "${label} нь ${pattern} загвартай тохирохгүй байна"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Огноо сонгох",
    "rangePlaceholder": [
      "Эхлэх огноо",
      "Дуусах огноо"
    ]
  },
  "TimePicker": {
    "placeholder": "Цаг сонгох",
    "rangePlaceholder": [
      "Эхлэх цаг",
      "Дуусах цаг"
    ]
  }
};

export default locale;
