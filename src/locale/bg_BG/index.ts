import type { Locale } from '../types';

const locale: Locale = {
  "locale": "bg",
  "global": {
    "close": "Затвори",
    "show": "Покажи",
    "hide": "Скрий",
    "placeholder": "Моля изберете",
    "sortable": "сортируеми"
  },
  "Table": {
    "filterTitle": "Филтриране",
    "filterConfirm": "Добре",
    "filterReset": "Нулиране",
    "selectAll": "Избор на текуща страница",
    "selectInvert": "Обръщане",
    "filterEmptyText": "Без филтри",
    "filterCheckAll": "Изберете всички елементи",
    "filterSearchPlaceholder": "Търсене във филтри",
    "emptyText": "Няма данни",
    "selectNone": "Изчистване на всички данни",
    "selectionAll": "Изберете всички данни",
    "sortTitle": "Сортиране",
    "expand": "Разширяване на реда",
    "collapse": "Свиване на ред",
    "triggerDesc": "Кликнете, за да сортирате в низходящ ред",
    "triggerAsc": "Кликнете, за да сортирате във възходящ ред",
    "cancelSort": "Кликнете, за да отмените сортирането"
  },
  "Modal": {
    "okText": "Добре",
    "cancelText": "Отказ",
    "justOkText": "Добре"
  },
  "Tour": {
    "Next": "Следващ",
    "Previous": "Предишен",
    "Finish": "Завърши"
  },
  "Popconfirm": {
    "okText": "Добре",
    "cancelText": "Отказ"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Търсене",
    "itemUnit": "избор",
    "itemsUnit": "избори",
    "remove": "Премахнете",
    "selectCurrent": "Изберете текущата страница",
    "removeCurrent": "Премахване на текущата страница",
    "selectAll": "Изберете всички данни",
    "deselectAll": "Демаркирайте всички данни",
    "removeAll": "Премахнете всички данни",
    "selectInvert": "Обърнете текущата страница"
  },
  "Upload": {
    "uploading": "Качване...",
    "removeFile": "Премахване",
    "uploadError": "Грешка при качването",
    "previewFile": "Преглед",
    "downloadFile": "Свали файл"
  },
  "Empty": {
    "description": "Няма данни"
  },
  "QRCode": {
    "expired": "QR кодът е изтекъл",
    "refresh": "Опресняване",
    "scanned": "Сканирани"
  },
  "ColorPicker": {
    "presetEmpty": "празна",
    "transparent": "Прозрачен",
    "singleColor": "Едноцветен",
    "gradientColor": "Преливащ цвят"
  },
  "Text": {
    "edit": "Редактиране",
    "copy": "копие",
    "copied": "Копирано",
    "expand": "Разширяване",
    "collapse": "Свиване"
  },
  "Form": {
    "optional": "（по желание）",
    "defaultValidateMessages": {
      "default": "грешка при проверка на полето ${label}",
      "required": "Моля, въведете ${label}",
      "enum": "${label} трябва да е един от [${enum}]",
      "whitespace": "${label} Не може да бъде нулев знак",
      "date": {
        "format": "${label} невалиден формат на датата",
        "parse": "${label} не може да се преобразува в дата",
        "invalid": "${label} е невалидна дата"
      },
      "types": {
        "string": "${label} не е валиден ${type}",
        "method": "${label} не е валиден ${type}",
        "array": "${label} не е валиден ${type}",
        "object": "${label} не е валиден ${type}",
        "number": "${label} не е валиден ${type}",
        "date": "${label} не е валиден ${type}",
        "boolean": "${label} не е валиден ${type}",
        "integer": "${label} не е валиден ${type}",
        "float": "${label} не е валиден ${type}",
        "regexp": "${label} не е валиден ${type}",
        "email": "${label} не е валиден ${type}",
        "url": "${label} не е валиден ${type}",
        "hex": "${label} не е валиден ${type}"
      },
      "string": {
        "len": "${label} ще бъде ${len} знака",
        "min": "${label} най-малко ${min} герои",
        "max": "${label} повечето ${max} герои",
        "range": "${label} Трябва да е вътре ${min}-${max} между знаци"
      },
      "number": {
        "len": "${label} трябва да е равно на ${len}",
        "min": "${label} Минималната стойност е ${min}",
        "max": "${label} Максималната стойност е ${max}",
        "range": "${label} Трябва да е вътре ${min}-${max} между"
      },
      "array": {
        "len": "ще бъде ${len} индивидуален ${label}",
        "min": "най-малко ${min} индивидуален ${label}",
        "max": "повечето ${max} индивидуален ${label}",
        "range": "${label} Количеството трябва да е вътре ${min}-${max} между"
      },
      "pattern": {
        "mismatch": "${label} не отговаря на модела ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Избор на дата",
    "rangePlaceholder": [
      "Начална",
      "Крайна"
    ]
  },
  "TimePicker": {
    "placeholder": "Избор на час",
    "rangePlaceholder": [
      "Начален час",
      "Краен час"
    ]
  }
};

export default locale;
