import type { Locale } from '../types';

const locale: Locale = {
  "locale": "id",
  "global": {
    "placeholder": "Silahkan pilih",
    "close": "Tutup",
    "show": "Tampilkan",
    "hide": "Sembunyikan",
    "sortable": "dapat diurutkan"
  },
  "Table": {
    "filterTitle": "Menu filter",
    "filterConfirm": "OK",
    "filterReset": "Reset",
    "filterEmptyText": "Tidak ada filter",
    "filterCheckAll": "Pilih semua item",
    "filterSearchPlaceholder": "Cari di filter",
    "emptyText": "Tidak ada data",
    "selectAll": "Pilih halaman saat ini",
    "selectInvert": "Balikkan halaman saat ini",
    "selectNone": "Hapus semua data",
    "selectionAll": "Pilih semua data",
    "sortTitle": "Urutkan",
    "expand": "Perluas baris",
    "collapse": "Perkecil baris",
    "triggerDesc": "Klik untuk mengurutkan secara menurun",
    "triggerAsc": "Klik untuk mengurutkan secara menaik",
    "cancelSort": "Klik untuk membatalkan pengurutan"
  },
  "Modal": {
    "okText": "OK",
    "cancelText": "Batal",
    "justOkText": "OK"
  },
  "Tour": {
    "Next": "Selanjutnya",
    "Previous": "Sebelumnya",
    "Finish": "Selesai"
  },
  "Popconfirm": {
    "okText": "OK",
    "cancelText": "Batal"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Cari di sini",
    "itemUnit": "data",
    "itemsUnit": "data",
    "remove": "Hapus",
    "selectCurrent": "Pilih halaman saat ini",
    "removeCurrent": "Hapus halaman saat ini",
    "selectAll": "Pilih semua data",
    "deselectAll": "Batal pilih semua data",
    "removeAll": "Hapus semua data",
    "selectInvert": "Balikkan halaman saat ini"
  },
  "Upload": {
    "uploading": "Mengunggah...",
    "removeFile": "Hapus file",
    "uploadError": "Kesalahan pengunggahan",
    "previewFile": "Pratinjau file",
    "downloadFile": "Unduh file"
  },
  "Empty": {
    "description": "Tidak ada data"
  },
  "QRCode": {
    "expired": "Kode QR sudah habis masa berlakunya",
    "refresh": "Segarkan",
    "scanned": "Dipindai"
  },
  "ColorPicker": {
    "presetEmpty": "Kosong",
    "transparent": "Transparan",
    "singleColor": "Warna tunggal",
    "gradientColor": "Warna gradien"
  },
  "Text": {
    "edit": "Ubah",
    "copy": "Salin",
    "copied": "Disalin",
    "expand": "Perluas",
    "collapse": "Perkecil"
  },
  "Form": {
    "optional": "(optional)",
    "defaultValidateMessages": {
      "default": "Kesalahan validasi untuk ${label}",
      "required": "Tolong masukkan ${label}",
      "enum": "${label} harus menjadi salah satu dari [${enum}]",
      "whitespace": "${label} tidak boleh berupa karakter kosong",
      "date": {
        "format": "${label} format tanggal tidak valid",
        "parse": "${label} tidak dapat diubah menjadi tanggal",
        "invalid": "${label} adalah tanggal yang tidak valid"
      },
      "types": {
        "string": "${label} tidak valid ${type}",
        "method": "${label} tidak valid ${type}",
        "array": "${label} tidak valid ${type}",
        "object": "${label} tidak valid ${type}",
        "number": "${label} tidak valid ${type}",
        "date": "${label} tidak valid ${type}",
        "boolean": "${label} tidak valid ${type}",
        "integer": "${label} tidak valid ${type}",
        "float": "${label} tidak valid ${type}",
        "regexp": "${label} tidak valid ${type}",
        "email": "${label} tidak valid ${type}",
        "url": "${label} tidak valid ${type}",
        "hex": "${label} tidak valid ${type}"
      },
      "string": {
        "len": "${label} harus berupa ${len} karakter",
        "min": "${label} harus minimal ${min} karakter",
        "max": "${label} harus maksimal ${max} karakter",
        "range": "${label} harus diantara ${min}-${max} karakter"
      },
      "number": {
        "len": "${label} harus sama dengan ${len}",
        "min": "${label} harus minimal ${min}",
        "max": "${label} harus maksimal ${max}",
        "range": "${label} harus di antara ${min}-${max}"
      },
      "array": {
        "len": "Harus ${len} ${label}",
        "min": "Minimal ${min} ${label}",
        "max": "Maksimal ${max} ${label}",
        "range": "Jumlah ${label} harus di antara ${min}-${max}"
      },
      "pattern": {
        "mismatch": "${label} tidak sesuai dengan pola ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Pilih tanggal",
    "rangePlaceholder": [
      "Tanggal awal",
      "Tanggal akhir"
    ]
  },
  "TimePicker": {
    "placeholder": "Pilih waktu",
    "rangePlaceholder": [
      "Waktu awal",
      "Waktu akhir"
    ]
  }
};

export default locale;
