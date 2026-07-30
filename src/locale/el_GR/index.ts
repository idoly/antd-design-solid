import type { Locale } from '../types';

const locale: Locale = {
  "locale": "el",
  "global": {
    "placeholder": "Παρακαλώ επιλέξτε",
    "close": "Κλείσιμο",
    "show": "Εμφάνιση",
    "hide": "Απόκρυψη",
    "sortable": "διαλογήσιμος"
  },
  "Table": {
    "filterTitle": "Μενού φίλτρων",
    "filterConfirm": "ΟΚ",
    "filterReset": "Επαναφορά",
    "filterEmptyText": "Χωρίς φίλτρα",
    "filterCheckAll": "Επιλογή όλων",
    "filterSearchPlaceholder": "Αναζήτηση στα φίλτρα",
    "emptyText": "Δεν υπάρχουν δεδομένα",
    "selectAll": "Επιλογή τρέχουσας σελίδας",
    "selectInvert": "Αντιστροφή τρέχουσας σελίδας",
    "selectNone": "Εκκαθάριση όλων των δεδομένων",
    "selectionAll": "Επιλογή όλων των δεδομένων",
    "sortTitle": "Ταξινόμηση",
    "expand": "Ανάπτυξη σειράς",
    "collapse": "Σύμπτυξη σειράς",
    "triggerDesc": "Κλικ για φθίνουσα ταξινόμηση",
    "triggerAsc": "Κλικ για αύξουσα ταξινόμηση",
    "cancelSort": "Κλικ για ακύρωση ταξινόμησης"
  },
  "Modal": {
    "okText": "ΟΚ",
    "cancelText": "Άκυρο",
    "justOkText": "Εντάξει"
  },
  "Tour": {
    "Next": "Επόμενο",
    "Previous": "Προηγούμενο",
    "Finish": "Τέλος"
  },
  "Popconfirm": {
    "okText": "ΟΚ",
    "cancelText": "Άκυρο"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Αναζήτηση",
    "itemUnit": "αντικείμενο",
    "itemsUnit": "αντικείμενα",
    "remove": "Αφαίρεση",
    "selectCurrent": "Επιλογή τρέχουσας σελίδας",
    "removeCurrent": "Αφαίρεση τρέχουσας σελίδας",
    "selectAll": "Επιλογή όλων των δεδομένων",
    "removeAll": "Αφαίρεση όλων των δεδομένων",
    "selectInvert": "Αντιστροφή τρέχουσας σελίδας",
    "deselectAll": "Καταργήστε την επιλογή όλων των δεδομένων"
  },
  "Upload": {
    "uploading": "Μεταφόρτωση...",
    "removeFile": "Αφαίρεση αρχείου",
    "uploadError": "Σφάλμα μεταφόρτωσης",
    "previewFile": "Προεπισκόπηση αρχείου",
    "downloadFile": "Λήψη αρχείου"
  },
  "Empty": {
    "description": "Δεν υπάρχουν δεδομένα"
  },
  "QRCode": {
    "expired": "Ο κωδικός QR έληξε",
    "refresh": "Ανανέωση",
    "scanned": "Σαρώθηκε"
  },
  "ColorPicker": {
    "presetEmpty": "Κενό",
    "transparent": "Διαφανές",
    "singleColor": "Μονόχρωμο",
    "gradientColor": "Διαβάθμιση χρώματος"
  },
  "Text": {
    "edit": "Επεξεργασία",
    "copy": "Αντιγραφή",
    "copied": "Αντιγράφηκε",
    "expand": "Ανάπτυξη",
    "collapse": "Σύμπτυξη"
  },
  "Form": {
    "optional": "(προαιρετικό)",
    "defaultValidateMessages": {
      "default": "Σφάλμα επικύρωσης πεδίου για ${label}",
      "required": "Παρακαλώ εισάγετε ${label}",
      "enum": "Το ${label} πρέπει να είναι ένα από [${enum}]",
      "whitespace": "Το ${label} δεν μπορεί να είναι κενός χαρακτήρας",
      "date": {
        "format": "Η μορφή ημερομηνίας του ${label} είναι άκυρη",
        "parse": "Το ${label} δεν μπορεί να μετατραπεί σε ημερομηνία",
        "invalid": "Το ${label} είναι μια άκυρη ημερομηνία"
      },
      "types": {
        "string": "Το ${label} δεν είναι έγκυρο ${type}",
        "method": "Το ${label} δεν είναι έγκυρο ${type}",
        "array": "Το ${label} δεν είναι έγκυρο ${type}",
        "object": "Το ${label} δεν είναι έγκυρο ${type}",
        "number": "Το ${label} δεν είναι έγκυρο ${type}",
        "date": "Το ${label} δεν είναι έγκυρο ${type}",
        "boolean": "Το ${label} δεν είναι έγκυρο ${type}",
        "integer": "Το ${label} δεν είναι έγκυρο ${type}",
        "float": "Το ${label} δεν είναι έγκυρο ${type}",
        "regexp": "Το ${label} δεν είναι έγκυρο ${type}",
        "email": "Το ${label} δεν είναι έγκυρο ${type}",
        "url": "Το ${label} δεν είναι έγκυρο ${type}",
        "hex": "Το ${label} δεν είναι έγκυρο ${type}"
      },
      "string": {
        "len": "Το ${label} πρέπει να είναι ${len} χαρακτήρες",
        "min": "Το ${label} πρέπει να είναι τουλάχιστον ${min} χαρακτήρες",
        "max": "Το ${label} πρέπει να είναι το πολύ ${max} χαρακτήρες",
        "range": "Το ${label} πρέπει να είναι μεταξύ ${min}-${max} χαρακτήρων"
      },
      "number": {
        "len": "Το ${label} πρέπει να είναι ίσο με ${len}",
        "min": "Το ${label} πρέπει να είναι τουλάχιστον ${min}",
        "max": "Το ${label} πρέπει να είναι το πολύ ${max}",
        "range": "Το ${label} πρέπει να είναι μεταξύ ${min}-${max}"
      },
      "array": {
        "len": "Πρέπει να είναι ${len} ${label}",
        "min": "Τουλάχιστον ${min} ${label}",
        "max": "Το πολύ ${max} ${label}",
        "range": "Το ποσό του ${label} πρέπει να είναι μεταξύ ${min}-${max}"
      },
      "pattern": {
        "mismatch": "Το ${label} δεν ταιριάζει με το μοτίβο ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Επιλέξτε ημερομηνία",
    "rangePlaceholder": [
      "Αρχική ημερομηνία",
      "Τελική ημερομηνία"
    ]
  },
  "TimePicker": {
    "placeholder": "Επιλέξτε ώρα",
    "rangePlaceholder": [
      "Ώρα έναρξης",
      "Ώρα λήξης"
    ]
  }
};

export default locale;
