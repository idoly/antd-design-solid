import type { Locale } from '../types';

const locale: Locale = {
  "locale": "ru",
  "global": {
    "placeholder": "Пожалуйста выберите",
    "close": "Закрыть",
    "show": "Показать",
    "hide": "Скрыть",
    "sortable": "сортируемый"
  },
  "Table": {
    "filterTitle": "Фильтр",
    "filterConfirm": "OK",
    "filterReset": "Сбросить",
    "filterEmptyText": "Без фильтров",
    "filterCheckAll": "Выбрать все элементы",
    "filterSearchPlaceholder": "Поиск в фильтрах",
    "emptyText": "Нет данных",
    "selectAll": "Выбрать всё",
    "selectInvert": "Инвертировать выбор",
    "selectNone": "Очистить все данные",
    "selectionAll": "Выбрать все данные",
    "sortTitle": "Сортировка",
    "expand": "Развернуть строку",
    "collapse": "Свернуть строку",
    "triggerDesc": "Нажмите для сортировки по убыванию",
    "triggerAsc": "Нажмите для сортировки по возрастанию",
    "cancelSort": "Нажмите, чтобы отменить сортировку"
  },
  "Modal": {
    "okText": "OK",
    "cancelText": "Отмена",
    "justOkText": "OK"
  },
  "Tour": {
    "Next": "Далее",
    "Previous": "Назад",
    "Finish": "Завершить"
  },
  "Popconfirm": {
    "okText": "OK",
    "cancelText": "Отмена"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Поиск",
    "itemUnit": "элем.",
    "itemsUnit": "элем.",
    "remove": "Удалить",
    "selectAll": "Выбрать все данные",
    "deselectAll": "Очистить все данные",
    "selectCurrent": "Выбрать текущую страницу",
    "selectInvert": "Инвертировать выбор",
    "removeAll": "Удалить все данные",
    "removeCurrent": "Удалить текущую страницу"
  },
  "Upload": {
    "uploading": "Загрузка...",
    "removeFile": "Удалить файл",
    "uploadError": "При загрузке произошла ошибка",
    "previewFile": "Предпросмотр файла",
    "downloadFile": "Загрузить файл"
  },
  "Empty": {
    "description": "Нет данных"
  },
  "QRCode": {
    "expired": "QR-код устарел",
    "refresh": "Обновить",
    "scanned": "Отсканировано"
  },
  "ColorPicker": {
    "presetEmpty": "Пустой",
    "transparent": "Прозрачный",
    "singleColor": "Один цвет",
    "gradientColor": "Градиент"
  },
  "Text": {
    "edit": "Редактировать",
    "copy": "Копировать",
    "copied": "Скопировано",
    "expand": "Раскрыть",
    "collapse": "Свернуть"
  },
  "Form": {
    "optional": "(необязательно)",
    "defaultValidateMessages": {
      "default": "Ошибка проверки поля ${label}",
      "required": "Пожалуйста, введите ${label}",
      "enum": "${label} должен быть одним из [${enum}]",
      "whitespace": "${label} не может быть пустым",
      "date": {
        "format": "${label} не правильный формат даты",
        "parse": "${label} не может быть преобразовано в дату",
        "invalid": "${label} не является корректной датой"
      },
      "types": {
        "string": "${label} не является типом ${type}",
        "method": "${label} не является типом ${type}",
        "array": "${label} не является типом ${type}",
        "object": "${label} не является типом ${type}",
        "number": "${label} не является типом ${type}",
        "date": "${label} не является типом ${type}",
        "boolean": "${label} не является типом ${type}",
        "integer": "${label} не является типом ${type}",
        "float": "${label} не является типом ${type}",
        "regexp": "${label} не является типом ${type}",
        "email": "${label} не является типом ${type}",
        "url": "${label} не является типом ${type}",
        "hex": "${label} не является типом ${type}"
      },
      "string": {
        "len": "${label} должна быть ${len} символов",
        "min": "${label} должна быть больше или равна ${min} символов",
        "max": "${label} должна быть меньше или равна ${max} символов",
        "range": "Длина ${label} должна быть между ${min}-${max} символами"
      },
      "number": {
        "len": "${label} должна быть равна ${len}",
        "min": "${label} должна быть больше или равна ${min}",
        "max": "${label} должна быть меньше или равна ${max}",
        "range": "${label} должна быть между ${min}-${max}"
      },
      "array": {
        "len": "Количество элементов ${label} должно быть равно ${len}",
        "min": "Количество элементов ${label} должно быть больше или равно ${min}",
        "max": "Количество элементов ${label} должно быть меньше или равно ${max}",
        "range": "Количество элементов ${label} должно быть между ${min} и ${max}"
      },
      "pattern": {
        "mismatch": "${label} не соответствует шаблону ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Выберите дату",
    "rangePlaceholder": [
      "Начальная дата",
      "Конечная дата"
    ]
  },
  "TimePicker": {
    "placeholder": "Выберите время",
    "rangePlaceholder": [
      "Время начала",
      "Время окончания"
    ]
  }
};

export default locale;
