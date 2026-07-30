import type { Locale } from '../types';

const locale: Locale = {
  "locale": "pl",
  "global": {
    "placeholder": "Wybierz",
    "close": "Zamknij",
    "show": "Pokaż",
    "hide": "Ukryj",
    "sortable": "sortowalne"
  },
  "Table": {
    "filterTitle": "Menu filtra",
    "filterConfirm": "OK",
    "filterReset": "Usuń filtry",
    "filterEmptyText": "Brak filtrów",
    "filterCheckAll": "Wybierz wszystkie elementy",
    "filterSearchPlaceholder": "Szukaj w filtrach",
    "emptyText": "Brak danych",
    "selectAll": "Zaznacz bieżącą stronę",
    "selectInvert": "Odwróć zaznaczenie",
    "selectNone": "Wyczyść",
    "selectionAll": "Wybierz wszystkie",
    "sortTitle": "Sortowanie",
    "expand": "Rozwiń wiersz",
    "collapse": "Zwiń wiersz",
    "triggerDesc": "Sortuj malejąco",
    "triggerAsc": "Sortuj rosnąco",
    "cancelSort": "Usuń sortowanie"
  },
  "Modal": {
    "okText": "OK",
    "cancelText": "Anuluj",
    "justOkText": "OK"
  },
  "Tour": {
    "Next": "Dalej",
    "Previous": "Wróć",
    "Finish": "Zakończ"
  },
  "Popconfirm": {
    "okText": "OK",
    "cancelText": "Anuluj"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Szukaj",
    "itemUnit": "obiekt",
    "itemsUnit": "obiekty",
    "remove": "Usuń",
    "selectCurrent": "Wybierz aktualną stronę",
    "removeCurrent": "Usuń aktualną stronę",
    "selectAll": "Wybierz wszystkie",
    "removeAll": "Usuń wszystkie",
    "selectInvert": "Odwróć wybór",
    "deselectAll": "Odznacz wszystkie dane"
  },
  "Upload": {
    "uploading": "Wysyłanie...",
    "removeFile": "Usuń plik",
    "uploadError": "Błąd wysyłania",
    "previewFile": "Podejrzyj plik",
    "downloadFile": "Pobieranie pliku"
  },
  "Empty": {
    "description": "Brak danych"
  },
  "QRCode": {
    "expired": "Kod QR wygasł",
    "refresh": "Odśwież",
    "scanned": "Zeskanowano"
  },
  "ColorPicker": {
    "presetEmpty": "Pusty",
    "transparent": "Przezroczysty",
    "singleColor": "Pojedynczy kolor",
    "gradientColor": "Kolor gradientowy"
  },
  "Text": {
    "edit": "Edytuj",
    "copy": "Kopiuj",
    "copied": "Skopiowany",
    "expand": "Rozwiń",
    "collapse": "Zwiń"
  },
  "Form": {
    "optional": "(opcjonalne)",
    "defaultValidateMessages": {
      "default": "Błąd walidacji dla pola ${label}",
      "required": "Pole ${label} jest wymagane",
      "enum": "Pole ${label} musi posiadać wartość z listy: [${enum}]",
      "whitespace": "Pole ${label} nie może być puste",
      "date": {
        "format": "${label} posiada zły format daty",
        "parse": "${label} nie może zostać zinterpretowane jako data",
        "invalid": "${label} jest niepoprawną datą"
      },
      "types": {
        "string": "${label} nie posiada poprawnej wartości dla typu ${type}",
        "method": "${label} nie posiada poprawnej wartości dla typu ${type}",
        "array": "${label} nie posiada poprawnej wartości dla typu ${type}",
        "object": "${label} nie posiada poprawnej wartości dla typu ${type}",
        "number": "${label} nie posiada poprawnej wartości dla typu ${type}",
        "date": "${label} nie posiada poprawnej wartości dla typu ${type}",
        "boolean": "${label} nie posiada poprawnej wartości dla typu ${type}",
        "integer": "${label} nie posiada poprawnej wartości dla typu ${type}",
        "float": "${label} nie posiada poprawnej wartości dla typu ${type}",
        "regexp": "${label} nie posiada poprawnej wartości dla typu ${type}",
        "email": "${label} nie posiada poprawnej wartości dla typu ${type}",
        "url": "${label} nie posiada poprawnej wartości dla typu ${type}",
        "hex": "${label} nie posiada poprawnej wartości dla typu ${type}"
      },
      "string": {
        "len": "${label} musi posiadać ${len} znaków",
        "min": "${label} musi posiadać co namniej ${min} znaków",
        "max": "${label} musi posiadać maksymalnie ${max} znaków",
        "range": "${label} musi posiadać między ${min} a ${max} znaków"
      },
      "number": {
        "len": "${label} musi mieć wartość o długości ${len}",
        "min": "${label} musi mieć wartość większą lub równą ${min}",
        "max": "${label} musi mieć wartość mniejszą lub równą ${max}",
        "range": "${label} musi mieć wartość pomiędzy ${min} a ${max}"
      },
      "array": {
        "len": "${label} musi posiadać ${len} elementów",
        "min": "${label} musi posiadać co najmniej ${min} elementów",
        "max": "${label} musi posiadać maksymalnie ${max} elementów",
        "range": "${label} musi posiadać między ${min} a ${max} elementów"
      },
      "pattern": {
        "mismatch": "${label} nie posiada wartości zgodnej ze wzorem ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Wybierz datę",
    "rangePlaceholder": [
      "Data początkowa",
      "Data końcowa"
    ]
  },
  "TimePicker": {
    "placeholder": "Wybierz godzinę",
    "rangePlaceholder": [
      "Czas rozpoczęcia",
      "Czas zakończenia"
    ]
  }
};

export default locale;
