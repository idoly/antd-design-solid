import type { Locale } from '../types';

const zhCN: Locale = {
  locale: 'zh-cn',
  global: { placeholder: '请选择', close: '关闭', sortable: '可排序', show: '显示', hide: '隐藏' },
  Empty: { description: '暂无数据' },
  Select: { notFoundContent: '无匹配结果' },
  Table: { emptyText: '暂无数据', expand: '展开行', collapse: '关闭行', sortTitle: '排序' },
  Modal: { okText: '确定', cancelText: '取消', justOkText: '知道了' },
  Tour: { Next: '下一步', Previous: '上一步', Finish: '结束导览' },
  Popconfirm: { okText: '确定', cancelText: '取消' },
  Transfer: { searchPlaceholder: '请输入搜索内容', itemUnit: '项', itemsUnit: '项', remove: '删除', selectAll: '全选所有', deselectAll: '取消全选' },
  Upload: { uploading: '文件上传中', removeFile: '删除文件', uploadError: '上传错误', previewFile: '预览文件', downloadFile: '下载文件' },
  QRCode: { expired: '二维码过期', refresh: '点击刷新', scanned: '已扫描' },
  DatePicker: { placeholder: '请选择日期', rangePlaceholder: ['开始日期', '结束日期'], previous: '上一个', next: '下一个' },
  TimePicker: { placeholder: '请选择时间', rangePlaceholder: ['开始时间', '结束时间'] },
  Pagination: { prev_page: '上一页', next_page: '下一页', items_per_page: '条/页', jump_to: '跳至', page: '页' },
  Form: { optional: '（可选）', defaultValidateMessages: { default: '字段验证错误${label}', required: '请输入${label}', whitespace: '${label}不能为空字符', types: { string: '${label}不是一个有效的${type}', number: '${label}不是一个有效的${type}', email: '${label}不是一个有效的${type}', array: '${label}不是一个有效的${type}' }, string: { len: '${label}须为${len}个字符', min: '${label}最少${min}个字符', max: '${label}最多${max}个字符' }, pattern: { mismatch: '${label}与模式不匹配${pattern}' } } },
};

export default zhCN;
