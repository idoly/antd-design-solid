import type { Locale } from '../types';

const locale: Locale = {
  "locale": "tr",
  "global": {
    "placeholder": "Lütfen seçiniz",
    "close": "Kapat",
    "show": "Göster",
    "hide": "Gizle",
    "sortable": "sıralanabilir"
  },
  "Table": {
    "filterTitle": "Filtre menüsü",
    "filterConfirm": "Tamam",
    "filterReset": "Sıfırla",
    "filterEmptyText": "Filtre yok",
    "filterCheckAll": "Tümünü seç",
    "selectAll": "Tüm sayfayı seç",
    "selectInvert": "Tersini seç",
    "selectionAll": "Tümünü seç",
    "sortTitle": "Sırala",
    "expand": "Satırı genişlet",
    "collapse": "Satırı daralt",
    "triggerDesc": "Azalan düzende sırala",
    "triggerAsc": "Artan düzende sırala",
    "cancelSort": "Sıralamayı kaldır",
    "filterSearchPlaceholder": "Filtrelerde ara",
    "emptyText": "Veri yok",
    "selectNone": "Tüm verileri temizle"
  },
  "Modal": {
    "okText": "Tamam",
    "cancelText": "İptal",
    "justOkText": "Tamam"
  },
  "Tour": {
    "Next": "Sonraki",
    "Previous": "Önceki",
    "Finish": "Bitir"
  },
  "Popconfirm": {
    "okText": "Tamam",
    "cancelText": "İptal"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Arama",
    "itemUnit": "Öğe",
    "itemsUnit": "Öğeler",
    "remove": "Kaldır",
    "selectCurrent": "Tüm sayfayı seç",
    "removeCurrent": "Sayfayı kaldır",
    "selectAll": "Tümünü seç",
    "deselectAll": "Tümünün seçimini kaldır",
    "removeAll": "Tümünü kaldır",
    "selectInvert": "Tersini seç"
  },
  "Upload": {
    "uploading": "Yükleniyor...",
    "removeFile": "Dosyayı kaldır",
    "uploadError": "Yükleme hatası",
    "previewFile": "Dosyayı önizle",
    "downloadFile": "Dosyayı indir"
  },
  "Empty": {
    "description": "Veri Yok"
  },
  "QRCode": {
    "expired": "QR kodunun süresi doldu",
    "refresh": "Yenile",
    "scanned": "Tarandı"
  },
  "ColorPicker": {
    "presetEmpty": "Boş",
    "transparent": "Şeffaf",
    "singleColor": "Tek renk",
    "gradientColor": "Gradyan rengi"
  },
  "Text": {
    "edit": "Düzenle",
    "copy": "Kopyala",
    "copied": "Kopyalandı",
    "expand": "Genişlet",
    "collapse": "Daralt"
  },
  "Form": {
    "optional": "(opsiyonel)",
    "defaultValidateMessages": {
      "default": "Alan doğrulama hatası ${label}",
      "required": "${label} gerekli bir alan",
      "enum": "${label} şunlardan biri olmalı: [${enum}]",
      "whitespace": "${label} sadece boşluk olamaz",
      "date": {
        "format": "${label} tarih biçimi geçersiz",
        "parse": "${label} bir tarihe dönüştürülemedi",
        "invalid": "${label} geçersiz bir tarih"
      },
      "types": {
        "string": "${label} geçerli bir ${type} değil",
        "method": "${label} geçerli bir ${type} değil",
        "array": "${label} geçerli bir ${type} değil",
        "object": "${label} geçerli bir ${type} değil",
        "number": "${label} geçerli bir ${type} değil",
        "date": "${label} geçerli bir ${type} değil",
        "boolean": "${label} geçerli bir ${type} değil",
        "integer": "${label} geçerli bir ${type} değil",
        "float": "${label} geçerli bir ${type} değil",
        "regexp": "${label} geçerli bir ${type} değil",
        "email": "${label} geçerli bir ${type} değil",
        "url": "${label} geçerli bir ${type} değil",
        "hex": "${label} geçerli bir ${type} değil"
      },
      "string": {
        "len": "${label} ${len} karakter olmalı",
        "min": "${label} en az ${min} karakter olmalı",
        "max": "${label} en çok ${max} karakter olmalı",
        "range": "${label} ${min}-${max} karakter arası olmalı"
      },
      "number": {
        "len": "${label} ${len} olmalı",
        "min": "${label} en az ${min} olmalı",
        "max": "${label} en çok ${max} olmalı",
        "range": "${label} ${min}-${max} arası olmalı"
      },
      "array": {
        "len": "${label} sayısı ${len} olmalı",
        "min": "${label} sayısı en az ${min} olmalı",
        "max": "${label} sayısı en çok ${max} olmalı",
        "range": "${label} sayısı ${min}-${max} arası olmalı"
      },
      "pattern": {
        "mismatch": "${label} şu kalıpla eşleşmeli: ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Tarih seç",
    "rangePlaceholder": [
      "Başlangıç tarihi",
      "Bitiş tarihi"
    ]
  },
  "TimePicker": {
    "placeholder": "Zaman seç",
    "rangePlaceholder": [
      "Başlangıç zamanı",
      "Bitiş zamanı"
    ]
  }
};

export default locale;
