import type { Locale } from '../types';

const locale: Locale = {
  "locale": "uk",
  "global": {
    "placeholder": "Будь ласка, оберіть",
    "close": "Закрити",
    "show": "Показати",
    "hide": "Приховати",
    "sortable": "сортувальний"
  },
  "Table": {
    "filterTitle": "Фільтрувати",
    "filterConfirm": "OK",
    "filterReset": "Скинути",
    "filterEmptyText": "Фільтри відсутні",
    "filterCheckAll": "Обрати всі",
    "filterSearchPlaceholder": "Пошук у фільтрах",
    "emptyText": "Даних немає",
    "selectAll": "Обрати всі на сторінці",
    "selectInvert": "Інвертувати вибір",
    "selectNone": "Очистити вибір",
    "selectionAll": "Обрати всі",
    "sortTitle": "Сортувати",
    "expand": "Розгорнути рядок",
    "collapse": "Згорнути рядок",
    "triggerDesc": "Сортувати за спаданням",
    "triggerAsc": "Сортувати за зростанням",
    "cancelSort": "Відмінити сортування"
  },
  "Modal": {
    "okText": "Гаразд",
    "cancelText": "Скасувати",
    "justOkText": "Гаразд"
  },
  "Tour": {
    "Next": "Далі",
    "Previous": "Назад",
    "Finish": "Завершити"
  },
  "Popconfirm": {
    "okText": "Гаразд",
    "cancelText": "Скасувати"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Введіть текст для пошуку",
    "itemUnit": "елем.",
    "itemsUnit": "елем.",
    "remove": "Видалити",
    "selectCurrent": "Вибрати поточну сторінку",
    "removeCurrent": "Скасувати вибір на сторінці",
    "selectAll": "Вибрати всі дані",
    "deselectAll": "Очистити вибір",
    "removeAll": "Скасувати вибір",
    "selectInvert": "Інвертувати поточну сторінку"
  },
  "Upload": {
    "uploading": "Завантаження ...",
    "removeFile": "Видалити файл",
    "uploadError": "Помилка завантаження",
    "previewFile": "Попередній перегляд файлу",
    "downloadFile": "Завантажити файл"
  },
  "Empty": {
    "description": "Даних немає"
  },
  "QRCode": {
    "expired": "QR-код закінчився",
    "refresh": "Оновити",
    "scanned": "Відскановані"
  },
  "ColorPicker": {
    "presetEmpty": "Порожній",
    "transparent": "Прозорий",
    "singleColor": "Одноколірний",
    "gradientColor": "Градієнтний колір"
  },
  "Text": {
    "edit": "Редагувати",
    "copy": "Скопіювати",
    "copied": "Скопійовано",
    "expand": "Розширити",
    "collapse": "Згорнути"
  },
  "Form": {
    "optional": "(опціонально)",
    "defaultValidateMessages": {
      "default": "Помилка валідації для поля ${label}",
      "required": "Будь ласка, заповніть ${label}",
      "enum": "Лише одне зі значень [${enum}] доступне для ${label}",
      "whitespace": "Значення у полі ${label} не може бути пробілом",
      "date": {
        "format": "Не валідний формат дати у ${label}",
        "parse": "Значення ${label} не може бути приведене до дати",
        "invalid": "Не валідна дата у ${label}"
      },
      "types": {
        "string": "${label} не є типом ${type}",
        "method": "${label} не є типом ${type}",
        "array": "${label} не є типом ${type}",
        "object": "${label} не є типом ${type}",
        "number": "${label} не є типом ${type}",
        "date": "${label} не є типом ${type}",
        "boolean": "${label} не є типом ${type}",
        "integer": "${label} не є типом ${type}",
        "float": "${label} не є типом ${type}",
        "regexp": "${label} не є типом ${type}",
        "email": "${label} не є типом ${type}",
        "url": "${label} не є типом ${type}",
        "hex": "${label} не є типом ${type}"
      },
      "string": {
        "len": "${label} має містити ${len} символів",
        "min": "${label} має містити не менш, ніж ${min} символів",
        "max": "${label} має містити не більш, ніж ${max} символів",
        "range": "${label} має містити ${min}-${max} символів"
      },
      "number": {
        "len": "${label} має дорівнювати ${len}",
        "min": "${label} має бути не менш, ніж ${min}",
        "max": "${label} має бути не більш, ніж ${max}",
        "range": "${label} має бути в межах ${min}-${max}"
      },
      "array": {
        "len": "${label} має містити ${len} елементи",
        "min": "${label} має містити не менш, ніж ${min} елементи",
        "max": "${label} має містити не більш, ніж ${max} елементи",
        "range": "Кількість елементів в ${label} має бути в межах ${min}-${max}"
      },
      "pattern": {
        "mismatch": "${label} не відповідає шаблону ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Оберіть дату",
    "rangePlaceholder": [
      "Початкова дата",
      "Кінцева дата"
    ]
  },
  "TimePicker": {
    "placeholder": "Оберіть час",
    "rangePlaceholder": [
      "Початковий час",
      "Кінцевий час"
    ]
  }
};

export default locale;
