import type { Locale } from '../types';

const locale: Locale = {
  "locale": "he",
  "global": {
    "placeholder": "אנא בחר",
    "close": "סגור",
    "show": "הצג",
    "hide": "הסתר",
    "sortable": "ניתן למיין"
  },
  "Table": {
    "filterTitle": "תפריט סינון",
    "filterConfirm": "אישור",
    "filterReset": "איפוס",
    "selectAll": "בחר הכל",
    "selectInvert": "הפוך בחירה",
    "selectionAll": "בחר את כל הנתונים",
    "sortTitle": "מיון",
    "expand": "הרחב שורה",
    "collapse": "צמצם שורה",
    "triggerDesc": "לחץ למיון לפי סדר יורד",
    "triggerAsc": "לחץ למיון לפי סדר עולה",
    "cancelSort": "לחץ כדי לבטל את המיון",
    "filterEmptyText": "אין מסננים",
    "filterCheckAll": "בחר את כל הפריטים",
    "filterSearchPlaceholder": "חפש במסננים",
    "emptyText": "אין נתונים",
    "selectNone": "נקה את כל הנתונים"
  },
  "Modal": {
    "okText": "אישור",
    "cancelText": "ביטול",
    "justOkText": "אישור"
  },
  "Tour": {
    "Next": "הבא",
    "Previous": "הקודם",
    "Finish": "סיום"
  },
  "Popconfirm": {
    "okText": "אישור",
    "cancelText": "ביטול"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "חפש כאן",
    "itemUnit": "פריט",
    "itemsUnit": "פריטים",
    "remove": "הסר",
    "selectCurrent": "בחר את הדף הנוכחי",
    "removeCurrent": "הסר את הדף הנוכחי",
    "selectAll": "בחר את כל הנתונים",
    "deselectAll": "בטל את הבחירה בכל הנתונים",
    "removeAll": "הסר את כל הנתונים",
    "selectInvert": "הפוך את הדף הנוכחי"
  },
  "Upload": {
    "uploading": "מעלה...",
    "removeFile": "הסר קובץ",
    "uploadError": "שגיאת העלאה",
    "previewFile": "הצג קובץ",
    "downloadFile": "הורד קובץ"
  },
  "Empty": {
    "description": "אין מידע"
  },
  "QRCode": {
    "expired": "פג תוקפו של קוד QR",
    "refresh": "רענן",
    "scanned": "נסרק"
  },
  "ColorPicker": {
    "presetEmpty": "ריק",
    "transparent": "שקוף",
    "singleColor": "צבע יחיד",
    "gradientColor": "צבע שיפוע"
  },
  "Text": {
    "edit": "ערוך",
    "copy": "העתק",
    "copied": "הועתק",
    "expand": "הרחב",
    "collapse": "התמוטט"
  },
  "Form": {
    "optional": "(אופציונלי)",
    "defaultValidateMessages": {
      "default": "ערך השדה שגוי ${label}",
      "required": "בבקשה הזן ${label}",
      "enum": "${label} חייב להיות אחד מערכים אלו [${enum}]",
      "whitespace": "${label} לא יכול להיות ריק",
      "date": {
        "format": "${label} תאריך לא תקין",
        "parse": "${label} לא ניתן להמיר לתאריך",
        "invalid": "${label} הוא לא תאריך תקין"
      },
      "types": {
        "string": "${label} הוא לא ${type} תקין",
        "method": "${label} הוא לא ${type} תקין",
        "array": "${label} הוא לא ${type} תקין",
        "object": "${label} הוא לא ${type} תקין",
        "number": "${label} הוא לא ${type} תקין",
        "date": "${label} הוא לא ${type} תקין",
        "boolean": "${label} הוא לא ${type} תקין",
        "integer": "${label} הוא לא ${type} תקין",
        "float": "${label} הוא לא ${type} תקין",
        "regexp": "${label} הוא לא ${type} תקין",
        "email": "${label} הוא לא ${type} תקין",
        "url": "${label} הוא לא ${type} תקין",
        "hex": "${label} הוא לא ${type} תקין"
      },
      "string": {
        "len": "${label} חייב להיות ${len} תווים",
        "min": "${label} חייב להיות ${min} תווים",
        "max": "${label} מקסימום ${max} תווים",
        "range": "${label} חייב להיות בין ${min}-${max} תווים"
      },
      "number": {
        "len": "${label} חייב להיות שווה ל ${len}",
        "min": "${label} ערך מינימלי הוא ${min}",
        "max": "${label} ערך מקסימלי הוא ${max}",
        "range": "${label} חייב להיות בין ${min}-${max}"
      },
      "array": {
        "len": "חייב להיות ${len} ${label}",
        "min": "מינימום ${min} ${label}",
        "max": "מקסימום ${max} ${label}",
        "range": "הסכום של ${label} חייב להיות בין ${min}-${max}"
      },
      "pattern": {
        "mismatch": "${label} לא תואם לתבנית ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "בחר תאריך",
    "rangePlaceholder": [
      "תאריך התחלה",
      "תאריך סיום"
    ]
  },
  "TimePicker": {
    "placeholder": "בחר שעה",
    "rangePlaceholder": [
      "שעת התחלה",
      "שעת סיום"
    ]
  }
};

export default locale;
