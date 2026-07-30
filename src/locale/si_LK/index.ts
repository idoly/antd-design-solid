import type { Locale } from '../types';

const locale: Locale = {
  "locale": "si",
  "global": {
    "placeholder": "කරුණාකර තෝරන්න",
    "close": "වසන්න",
    "show": "පෙන්වන්න",
    "hide": "සඟවන්න",
    "sortable": "වර්ග කළ හැකි"
  },
  "Table": {
    "filterTitle": "පෙරහන්",
    "filterConfirm": "හරි",
    "filterReset": "යළි සකසන්න",
    "filterEmptyText": "පෙරහන් නැත",
    "filterCheckAll": "සියළු අථක තෝරන්න",
    "filterSearchPlaceholder": "පෙරහන් තුළ සොයන්න",
    "emptyText": "දත්ත නැත",
    "selectAll": "වත්මන් පිටුව තෝරන්න",
    "selectInvert": "වත්මන් පිටුව යටියනය",
    "selectNone": "සියළු දත්ත ඉවතලන්න",
    "selectionAll": "සියළු දත්ත තෝරන්න",
    "sortTitle": "පෙළගැසීම",
    "expand": "පේළිය දිගහරින්න",
    "collapse": "පේළිය හකුළන්න",
    "triggerDesc": "අවරෝහණව පෙළගැසීමට ඔබන්න",
    "triggerAsc": "ආරෝහණව පෙළගැසීමට ඔබන්න",
    "cancelSort": "පෙළගැසීම අවලංගු කිරීමට ඔබන්න"
  },
  "Modal": {
    "okText": "හරි",
    "cancelText": "අවලංගු කරන්න",
    "justOkText": "හරි"
  },
  "Tour": {
    "Next": "ඊළඟ",
    "Previous": "පෙර",
    "Finish": "අවසන් කරන්න"
  },
  "Popconfirm": {
    "okText": "හරි",
    "cancelText": "අවලංගු කරන්න"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "මෙතැන සොයන්න",
    "itemUnit": "අථකය",
    "itemsUnit": "අථක",
    "remove": "ඉවත් කරන්න",
    "selectCurrent": "වත්මන් පිටුව තෝරන්න",
    "removeCurrent": "වත්මන් පිටුව ඉවත් කරන්න",
    "selectAll": "සියළු දත්ත තෝරන්න",
    "removeAll": "සියළු දත්ත ඉවතලන්න",
    "selectInvert": "වත්මන් පිටුව යටියනය",
    "deselectAll": "සියලු දත්ත තේරීම ඉවත් කරන්න"
  },
  "Upload": {
    "uploading": "උඩුගත වෙමින්...",
    "removeFile": "ගොනුව ඉවතලන්න",
    "uploadError": "උඩුගත වීමේ දෝෂයකි",
    "previewFile": "ගොනුවේ පෙරදසුන",
    "downloadFile": "ගොනුව බාගන්න"
  },
  "Empty": {
    "description": "දත්ත නැත"
  },
  "QRCode": {
    "expired": "QR කේතය කල් ඉකුත් විය",
    "refresh": "නැවුම් කරන්න",
    "scanned": "ස්කෑන් කළා"
  },
  "ColorPicker": {
    "presetEmpty": "හිස්",
    "transparent": "විනිවිද පෙනෙන",
    "singleColor": "තනි වර්ණය",
    "gradientColor": "Gradient වර්ණය"
  },
  "Text": {
    "edit": "සංස්කරණය",
    "copy": "පිටපත්",
    "copied": "පිටපත් විය",
    "expand": "විහිදුවන්න",
    "collapse": "හකුළන්න"
  },
  "Form": {
    "optional": "(විකල්පයකි)",
    "defaultValidateMessages": {
      "default": "${label} සඳහා ක්‍ෂේත්‍රය වලංගුකරණයේ දෝෂයකි",
      "required": "${label} ඇතුල් කරන්න",
      "enum": "[${enum}] වලින් එකක් ${label} විය යුතුය",
      "whitespace": "${label} හිස් අකුරක් නොවිය යුතුය",
      "date": {
        "format": "${label} දිනයේ ආකෘතිය වැරදිය",
        "parse": "${label} දිනයකට පරිවර්තනය කළ නොහැකිය",
        "invalid": "${label} වලංගු නොවන දිනයකි"
      },
      "types": {
        "string": "${label} වලංගු ${type} ක් නොවේ",
        "method": "${label} වලංගු ${type} ක් නොවේ",
        "array": "${label} වලංගු ${type} ක් නොවේ",
        "object": "${label} වලංගු ${type} ක් නොවේ",
        "number": "${label} වලංගු ${type} ක් නොවේ",
        "date": "${label} වලංගු ${type} ක් නොවේ",
        "boolean": "${label} වලංගු ${type} ක් නොවේ",
        "integer": "${label} වලංගු ${type} ක් නොවේ",
        "float": "${label} වලංගු ${type} ක් නොවේ",
        "regexp": "${label} වලංගු ${type} ක් නොවේ",
        "email": "${label} වලංගු ${type} ක් නොවේ",
        "url": "${label} වලංගු ${type} ක් නොවේ",
        "hex": "${label} වලංගු ${type} ක් නොවේ"
      },
      "string": {
        "len": "${label} අකුරු ${len}ක් විය යුතුය",
        "min": "${label} අවමය අකුරු ${min}ක් විය යුතුය",
        "max": "${label} අකුරු ${max}ක් දක්වා විය යුතුය",
        "range": "${label} අකුරු ${min}-${max}ක් අතර විය යුතුය"
      },
      "number": {
        "len": "${label} නිසැකව ${len} සමාන විය යුතුය",
        "min": "${label} අවමය ${min} විය යුතුය",
        "max": "${label} උපරිමය ${max} විය යුතුය",
        "range": "${label} නිසැකව ${min}-${max} අතර විය යුතුය"
      },
      "array": {
        "len": "${len} ${label} විය යුතුය",
        "min": "අවම වශයෙන් ${min} ${label}",
        "max": "උපරිම වශයෙන් ${max} ${label}",
        "range": "${label} ගණන ${min}-${max} අතර විය යුතුය"
      },
      "pattern": {
        "mismatch": "${pattern} රටාවට ${label} නොගැළපේ"
      }
    }
  },
  "DatePicker": {
    "placeholder": "දිනය තෝරන්න",
    "rangePlaceholder": [
      "ආරම්භක දිනය",
      "නිමවන දිනය"
    ]
  },
  "TimePicker": {
    "placeholder": "වේලාව තෝරන්න",
    "rangePlaceholder": [
      "ආරම්භක වේලාව",
      "නිමවන වේලාව"
    ]
  }
};

export default locale;
