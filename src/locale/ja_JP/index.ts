import type { Locale } from '../types';

const locale: Locale = {
  "locale": "ja",
  "global": {
    "placeholder": "選んでください",
    "close": "閉じる",
    "show": "表示",
    "hide": "非表示",
    "sortable": "並べ替え可能"
  },
  "Table": {
    "filterTitle": "フィルター",
    "filterConfirm": "OK",
    "filterReset": "リセット",
    "filterEmptyText": "フィルターなし",
    "filterCheckAll": "すべてを選択",
    "filterSearchPlaceholder": "フィルターで検索",
    "emptyText": "データなし",
    "selectAll": "ページ単位で選択",
    "selectInvert": "ページ単位で反転",
    "selectNone": "クリア",
    "selectionAll": "すべてを選択",
    "sortTitle": "ソート",
    "expand": "展開する",
    "collapse": "折り畳む",
    "triggerDesc": "クリックで降順にソート",
    "triggerAsc": "クリックで昇順にソート",
    "cancelSort": "ソートをキャンセル"
  },
  "Modal": {
    "okText": "OK",
    "cancelText": "キャンセル",
    "justOkText": "OK"
  },
  "Tour": {
    "Next": "次",
    "Previous": "前の",
    "Finish": "仕上げる"
  },
  "Popconfirm": {
    "okText": "OK",
    "cancelText": "キャンセル"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "ここを検索",
    "itemUnit": "アイテム",
    "itemsUnit": "アイテム",
    "remove": "削除",
    "selectCurrent": "現在のページを選択",
    "removeCurrent": "現在のページを削除",
    "selectAll": "ページ単位で選択",
    "deselectAll": "すべてのデータの選択を解除する",
    "removeAll": "ページ単位で削除",
    "selectInvert": "ページ単位で反転"
  },
  "Upload": {
    "uploading": "アップロード中...",
    "removeFile": "ファイルを削除",
    "uploadError": "アップロードエラー",
    "previewFile": "ファイルをプレビュー",
    "downloadFile": "ダウンロードファイル"
  },
  "Empty": {
    "description": "データがありません"
  },
  "QRCode": {
    "expired": "QRコードの有効期限が切れました",
    "refresh": "リフレッシュ",
    "scanned": "スキャン済み"
  },
  "ColorPicker": {
    "presetEmpty": "空の",
    "transparent": "透明",
    "singleColor": "単色",
    "gradientColor": "グラデーション"
  },
  "Text": {
    "edit": "編集",
    "copy": "コピー",
    "copied": "コピーされました",
    "expand": "展開する",
    "collapse": "折り畳む"
  },
  "Form": {
    "optional": "(オプション)",
    "defaultValidateMessages": {
      "default": "${label}のフィールド検証エラー",
      "required": "${label}を入力してください",
      "enum": "${label}は[${enum}]のいずれかである必要があります",
      "whitespace": "${label}は空白文字にすることはできません",
      "date": {
        "format": "${label}の日付形式は不正です",
        "parse": "${label}は日付に変換できません",
        "invalid": "${label}は不正な日付です"
      },
      "types": {
        "string": "${label}は有効な${type}ではありません",
        "method": "${label}は有効な${type}ではありません",
        "array": "${label}は有効な${type}ではありません",
        "object": "${label}は有効な${type}ではありません",
        "number": "${label}は有効な${type}ではありません",
        "date": "${label}は有効な${type}ではありません",
        "boolean": "${label}は有効な${type}ではありません",
        "integer": "${label}は有効な${type}ではありません",
        "float": "${label}は有効な${type}ではありません",
        "regexp": "${label}は有効な${type}ではありません",
        "email": "${label}は有効な${type}ではありません",
        "url": "${label}は有効な${type}ではありません",
        "hex": "${label}は有効な${type}ではありません"
      },
      "string": {
        "len": "${label}は${len}文字である必要があります",
        "min": "${label}は${min}文字以上である必要があります",
        "max": "${label}は${max}文字以下である必要があります",
        "range": "${label}は${min}-${max}文字の範囲である必要があります"
      },
      "number": {
        "len": "${label}は${len}と等しい必要があります",
        "min": "${label}の最小値は${min}です",
        "max": "${label}の最大値は${max}です",
        "range": "${label}は${min}-${max}の範囲である必要があります"
      },
      "array": {
        "len": "${label}は${len}である必要があります",
        "min": "${label}の最小は${min}です",
        "max": "${label}の最大は${max}です",
        "range": "${label}の合計は${min}-${max}の範囲である必要があります"
      },
      "pattern": {
        "mismatch": "${label}はパターン${pattern}と一致しません"
      }
    }
  },
  "DatePicker": {
    "placeholder": "日付を選択",
    "rangePlaceholder": [
      "開始日付",
      "終了日付"
    ]
  },
  "TimePicker": {
    "placeholder": "時間を選択",
    "rangePlaceholder": [
      "開始時間",
      "終了時間"
    ]
  }
};

export default locale;
