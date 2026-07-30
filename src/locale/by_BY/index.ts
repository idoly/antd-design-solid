import type { Locale } from '../types';

const locale: Locale = {
  "locale": "by",
  "global": {
    "placeholder": "Калі ласка, выберыце",
    "close": "Закрыць",
    "show": "Паказаць",
    "hide": "Схаваць",
    "sortable": "сартавальны"
  },
  "Table": {
    "filterTitle": "Фільтр",
    "filterConfirm": "OK",
    "filterReset": "Скінуць",
    "filterEmptyText": "Без фільтраў",
    "filterCheckAll": "Выбраць усё",
    "filterSearchPlaceholder": "Пошук фільтраў",
    "emptyText": "Няма даных",
    "selectAll": "Выбраць усё",
    "selectInvert": "Інвертаваць выбар",
    "selectNone": "Ачысціць усе даныя",
    "selectionAll": "Выбраць усе даныя",
    "sortTitle": "Сартаванне",
    "expand": "Разгарнуць радок",
    "collapse": "Згарнуць радок",
    "triggerDesc": "Націсніце для сартавання па ўбыванні",
    "triggerAsc": "Націсніце для сартавання па ўзрастанні",
    "cancelSort": "Націсніце, каб адмяніць сартаванне"
  },
  "Modal": {
    "okText": "OK",
    "cancelText": "Адмена",
    "justOkText": "OK"
  },
  "Tour": {
    "Next": "Наступны",
    "Previous": "Папярэдняя",
    "Finish": "Завяршыць"
  },
  "Popconfirm": {
    "okText": "OK",
    "cancelText": "Адмена"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Пошук",
    "itemUnit": "элем.",
    "itemsUnit": "элем.",
    "remove": "Выдаліць",
    "selectCurrent": "Вылучыць бягучую старонку",
    "removeCurrent": "Выдаліць бягучую старонку",
    "selectAll": "Выбраць усе даныя",
    "removeAll": "Выдаліць усе даныя",
    "selectInvert": "Паказаць у адваротным парадку",
    "deselectAll": "Адмяніце выбар усіх даных"
  },
  "Upload": {
    "uploading": "Запампоўка...",
    "removeFile": "Выдаліць файл",
    "uploadError": "Адбылася памылка пры запампоўцы",
    "previewFile": "Перадпрагляд файла",
    "downloadFile": "Спампаваць файл"
  },
  "Empty": {
    "description": "Няма даных"
  },
  "QRCode": {
    "expired": "Тэрмін дзеяння QR-кода скончыўся",
    "refresh": "Абнавіць",
    "scanned": "Адсканаваныя"
  },
  "ColorPicker": {
    "presetEmpty": "Пусты",
    "transparent": "Празрысты",
    "singleColor": "Аднакаляровы",
    "gradientColor": "Градыент колеру"
  },
  "Text": {
    "edit": "Рэдагаваць",
    "copy": "Капіяваць",
    "copied": "Капіяванне завершана",
    "expand": "Разгарнуць",
    "collapse": "Згарнуць"
  },
  "Form": {
    "optional": "(не абавязкова)",
    "defaultValidateMessages": {
      "default": "Памылка праверкі поля «${label}»",
      "required": "Калі ласка, увядзіце «${label}»",
      "enum": "Поле «${label}» павінна быць адным з [${enum}]",
      "whitespace": "Поле «${label}» не можа быць пустым",
      "date": {
        "format": "Поле «${label}» мае няправільны фармат даты",
        "parse": "Поле «${label}» не можа быць пераўтворана ў дату",
        "invalid": "Поле «${label}» не з'яўляецца карэктнай датай"
      },
      "types": {
        "string": "${label} не з'яўляецца тыпам ${type}",
        "method": "${label} не з'яўляецца тыпам ${type}",
        "array": "${label} не з'яўляецца тыпам ${type}",
        "object": "${label} не з'яўляецца тыпам ${type}",
        "number": "${label} не з'яўляецца тыпам ${type}",
        "date": "${label} не з'яўляецца тыпам ${type}",
        "boolean": "${label} не з'яўляецца тыпам ${type}",
        "integer": "${label} не з'яўляецца тыпам ${type}",
        "float": "${label} не з'яўляецца тыпам ${type}",
        "regexp": "${label} не з'яўляецца тыпам ${type}",
        "email": "${label} не з'яўляецца тыпам ${type}",
        "url": "${label} не з'яўляецца тыпам ${type}",
        "hex": "${label} не з'яўляецца тыпам ${type}"
      },
      "string": {
        "len": "Значэнне поля «${label}» павінна мець даўжыню ${len} сімвалаў",
        "min": "Значэнне поля «${label}» павінна мець не меней за ${min} сімвалаў",
        "max": "Значэнне поля «${label}» павінна быць не даўжэй за ${max} сімвалаў",
        "range": "Значэнне поля «${label}» павінна мець даўжыню ${min}-${max} сімвалаў"
      },
      "number": {
        "len": "Значэнне поля «${label}» павінна быць роўнае ${len}",
        "min": "Значэнне поля «${label}» павінна быць больш або роўнае ${min}",
        "max": "Значэнне поля «${label}» павінна быць больш або роўнае ${max}",
        "range": "Значэнне поля «${label}» павінна быць паміж ${min} і ${max}"
      },
      "array": {
        "len": "Колькасць элементаў у полі «${label}» павінна быць роўная ${len}",
        "min": "Колькасць элементаў у полі «${label}» павінна быць не меней за ${min}",
        "max": "Колькасць элементаў у полі «${label}» павінна быць не болей за ${max}",
        "range": "Колькасць элементаў у полі «${label}» павінна быць паміж ${min} і ${max}"
      },
      "pattern": {
        "mismatch": "Значэнне поля «${label}» не адпавядае шаблону ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Выберыце дату",
    "rangePlaceholder": [
      "Дата пачатку",
      "Дата заканчэння"
    ]
  },
  "TimePicker": {
    "placeholder": "Выберыце час",
    "rangePlaceholder": [
      "Час пачатку",
      "Час заканчэння"
    ]
  }
};

export default locale;
