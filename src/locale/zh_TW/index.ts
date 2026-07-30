import type { Locale } from '../types';

const locale: Locale = {
  "locale": "zh-tw",
  "global": {
    "placeholder": "請選擇",
    "close": "關閉",
    "show": "顯示",
    "hide": "隱藏",
    "sortable": "可排序"
  },
  "Table": {
    "filterTitle": "篩選器",
    "filterConfirm": "確定",
    "filterReset": "重置",
    "filterEmptyText": "無篩選項",
    "filterCheckAll": "全選",
    "filterSearchPlaceholder": "在篩選項中搜尋",
    "emptyText": "暫無數據",
    "selectAll": "全部選取",
    "selectInvert": "反向選取",
    "selectNone": "清空所有",
    "selectionAll": "全選所有",
    "sortTitle": "排序",
    "expand": "展開行",
    "collapse": "關閉行",
    "triggerDesc": "點擊降序",
    "triggerAsc": "點擊升序",
    "cancelSort": "取消排序"
  },
  "Modal": {
    "okText": "確定",
    "cancelText": "取消",
    "justOkText": "知道了"
  },
  "Tour": {
    "Next": "下一步",
    "Previous": "上一步",
    "Finish": "結束導覽"
  },
  "Popconfirm": {
    "okText": "確定",
    "cancelText": "取消"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "搜尋資料",
    "itemUnit": "項目",
    "itemsUnit": "項目",
    "remove": "删除",
    "selectCurrent": "全選當頁",
    "removeCurrent": "删除當頁",
    "selectAll": "全選所有",
    "removeAll": "删除全部",
    "selectInvert": "反選當頁",
    "deselectAll": "取消全選"
  },
  "Upload": {
    "uploading": "正在上傳...",
    "removeFile": "刪除檔案",
    "uploadError": "上傳失敗",
    "previewFile": "檔案預覽",
    "downloadFile": "下载文件"
  },
  "Empty": {
    "description": "無此資料"
  },
  "QRCode": {
    "expired": "二維碼過期",
    "refresh": "點擊刷新",
    "scanned": "已掃描"
  },
  "ColorPicker": {
    "presetEmpty": "暫無",
    "transparent": "透明",
    "singleColor": "單色",
    "gradientColor": "漸變色"
  },
  "Text": {
    "edit": "編輯",
    "copy": "複製",
    "copied": "複製成功",
    "expand": "展開",
    "collapse": "收起"
  },
  "Form": {
    "optional": "（可選）",
    "defaultValidateMessages": {
      "default": "字段驗證錯誤${label}",
      "required": "請輸入${label}",
      "enum": "${label}必須是其中一個[${enum}]",
      "whitespace": "${label}不能為空字符",
      "date": {
        "format": "${label}日期格式無效",
        "parse": "${label}不能轉換為日期",
        "invalid": "${label}是一個無效日期"
      },
      "types": {
        "string": "${label}不是一個有效的${type}",
        "method": "${label}不是一個有效的${type}",
        "array": "${label}不是一個有效的${type}",
        "object": "${label}不是一個有效的${type}",
        "number": "${label}不是一個有效的${type}",
        "date": "${label}不是一個有效的${type}",
        "boolean": "${label}不是一個有效的${type}",
        "integer": "${label}不是一個有效的${type}",
        "float": "${label}不是一個有效的${type}",
        "regexp": "${label}不是一個有效的${type}",
        "email": "${label}不是一個有效的${type}",
        "url": "${label}不是一個有效的${type}",
        "hex": "${label}不是一個有效的${type}"
      },
      "string": {
        "len": "${label}須為${len}個字符",
        "min": "${label}最少${min}個字符",
        "max": "${label}最多${max}個字符",
        "range": "${label}須在${min}-${max}字符之間"
      },
      "number": {
        "len": "${label}必須等於${len}",
        "min": "${label}最小值為${min}",
        "max": "${label}最大值為${max}",
        "range": "${label}須在${min}-${max}之間"
      },
      "array": {
        "len": "須為${len}個${label}",
        "min": "最少${min}個${label}",
        "max": "最多${max}個${label}",
        "range": "${label}數量須在${min}-${max}之間"
      },
      "pattern": {
        "mismatch": "${label}與模式不匹配${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "請選擇日期",
    "rangePlaceholder": [
      "開始日期",
      "結束日期"
    ]
  },
  "TimePicker": {
    "placeholder": "請選擇時間",
    "rangePlaceholder": [
      "開始時間",
      "結束時間"
    ]
  }
};

export default locale;
