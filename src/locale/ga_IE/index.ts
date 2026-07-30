import type { Locale } from '../types';

const locale: Locale = {
  "locale": "ga",
  "global": {
    "placeholder": "Roghnaigh le do thoil",
    "close": "Dún",
    "show": "Taispeáin",
    "hide": "Folaigh",
    "sortable": "insocraithe"
  },
  "Table": {
    "filterTitle": "Filter menu",
    "filterConfirm": "OK",
    "filterReset": "Reset",
    "selectAll": "Select current page",
    "selectInvert": "Invert current page",
    "selectionAll": "Select all data",
    "sortTitle": "Sort",
    "expand": "Expand row",
    "collapse": "Collapse row",
    "triggerDesc": "Click to sort descending",
    "triggerAsc": "Click to sort ascending",
    "cancelSort": "Click to cancel sorting",
    "filterEmptyText": "Gan scagairí",
    "filterCheckAll": "Roghnaigh gach mír",
    "filterSearchPlaceholder": "Cuardaigh i scagairí",
    "emptyText": "Gan sonraí",
    "selectNone": "Glan na sonraí go léir"
  },
  "Modal": {
    "okText": "OK",
    "cancelText": "Cancel",
    "justOkText": "OK"
  },
  "Tour": {
    "Next": "Aghaidh",
    "Previous": "Roimh",
    "Finish": "Dhéanamh"
  },
  "Popconfirm": {
    "okText": "OK",
    "cancelText": "Cancel"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Search here",
    "itemUnit": "item",
    "itemsUnit": "items",
    "remove": "Remove",
    "selectCurrent": "Select current page",
    "removeCurrent": "Remove current page",
    "selectAll": "Select all data",
    "removeAll": "Remove all data",
    "selectInvert": "Invert current page",
    "deselectAll": "Díroghnaigh na sonraí go léir"
  },
  "Upload": {
    "uploading": "Uploading...",
    "removeFile": "Remove file",
    "uploadError": "Upload error",
    "previewFile": "Preview file",
    "downloadFile": "Download file"
  },
  "Empty": {
    "description": "No Data"
  },
  "QRCode": {
    "expired": "Chuaigh an cód QR in éag",
    "refresh": "Athnuaigh",
    "scanned": "Scanta"
  },
  "ColorPicker": {
    "presetEmpty": "Folamh",
    "transparent": "Trédhearcach",
    "singleColor": "Dath aonair",
    "gradientColor": "Dath grádán"
  },
  "Text": {
    "edit": "Edit",
    "copy": "Copy",
    "copied": "Copied",
    "expand": "Expand",
    "collapse": "Laghdaigh"
  },
  "Form": {
    "optional": "(roghnach)",
    "defaultValidateMessages": {
      "default": "Field validation error for ${label}",
      "required": "Please enter ${label}",
      "enum": "${label} must be one of [${enum}]",
      "whitespace": "${label} cannot be a blank character",
      "date": {
        "format": "${label} date format is invalid",
        "parse": "${label} cannot be converted to a date",
        "invalid": "${label} is an invalid date"
      },
      "types": {
        "string": "${label} is not a valid ${type}",
        "method": "${label} is not a valid ${type}",
        "array": "${label} is not a valid ${type}",
        "object": "${label} is not a valid ${type}",
        "number": "${label} is not a valid ${type}",
        "date": "${label} is not a valid ${type}",
        "boolean": "${label} is not a valid ${type}",
        "integer": "${label} is not a valid ${type}",
        "float": "${label} is not a valid ${type}",
        "regexp": "${label} is not a valid ${type}",
        "email": "${label} is not a valid ${type}",
        "url": "${label} is not a valid ${type}",
        "hex": "${label} is not a valid ${type}"
      },
      "string": {
        "len": "${label} must be ${len} characters",
        "min": "${label} must be at least ${min} characters",
        "max": "${label} must be up to ${max} characters",
        "range": "${label} must be between ${min}-${max} characters"
      },
      "number": {
        "len": "${label} must be equal to ${len}",
        "min": "${label} must be minimum ${min}",
        "max": "${label} must be maximum ${max}",
        "range": "${label} must be between ${min}-${max}"
      },
      "array": {
        "len": "Must be ${len} ${label}",
        "min": "At least ${min} ${label}",
        "max": "At most ${max} ${label}",
        "range": "The amount of ${label} must be between ${min}-${max}"
      },
      "pattern": {
        "mismatch": "${label} does not match the pattern ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Roghnaigh dáta",
    "rangePlaceholder": [
      "Dáta tosaigh",
      "Dáta deiridh"
    ]
  },
  "TimePicker": {
    "placeholder": "Roghnaigh am",
    "rangePlaceholder": [
      "Am tosaigh",
      "Am deiridh"
    ]
  }
};

export default locale;
