import type { Locale } from '../types';

const locale: Locale = {
  "locale": "pt",
  "global": {
    "placeholder": "Por favor, selecione",
    "close": "Fechar",
    "show": "Mostrar",
    "hide": "Ocultar",
    "sortable": "classificável"
  },
  "Table": {
    "filterTitle": "Filtro",
    "filterConfirm": "Aplicar",
    "filterReset": "Repor",
    "filterEmptyText": "Sem filtros",
    "filterCheckAll": "Selecionar todos os itens",
    "filterSearchPlaceholder": "Pesquisar nos filtros",
    "emptyText": "Sem dados",
    "selectAll": "Selecionar página atual",
    "selectInvert": "Inverter página atual",
    "selectNone": "Limpar todos os dados",
    "selectionAll": "Selecionar todos os dados",
    "sortTitle": "Ordenar",
    "expand": "Expandir linha",
    "collapse": "Colapsar linha",
    "triggerDesc": "Clique para ordenar decrescente",
    "triggerAsc": "Clique para ordenar crescente",
    "cancelSort": "Clique para cancelar ordenação"
  },
  "Modal": {
    "okText": "OK",
    "cancelText": "Cancelar",
    "justOkText": "OK"
  },
  "Tour": {
    "Next": "Próximo",
    "Previous": "Anterior",
    "Finish": "Terminar"
  },
  "Popconfirm": {
    "okText": "OK",
    "cancelText": "Cancelar"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Procurar...",
    "itemUnit": "item",
    "itemsUnit": "itens",
    "remove": "Remover",
    "selectCurrent": "Selecionar página atual",
    "removeCurrent": "Remover página atual",
    "selectAll": "Selecionar tudo",
    "deselectAll": "Desmarcar tudo",
    "removeAll": "Remover tudo",
    "selectInvert": "Inverter página actual"
  },
  "Upload": {
    "uploading": "A carregar...",
    "removeFile": "Remover",
    "uploadError": "Erro ao carregar",
    "previewFile": "Pré-visualizar",
    "downloadFile": "Descarregar"
  },
  "Empty": {
    "description": "Sem dados"
  },
  "QRCode": {
    "expired": "Código QR expirou",
    "refresh": "Atualizar",
    "scanned": "Digitalizado"
  },
  "ColorPicker": {
    "presetEmpty": "Vazio",
    "transparent": "Transparente",
    "singleColor": "Simples",
    "gradientColor": "Gradiente"
  },
  "Text": {
    "edit": "Editar",
    "copy": "Copiar",
    "copied": "Copiado",
    "expand": "Expandir",
    "collapse": "Colapsar"
  },
  "Form": {
    "optional": "(opcional)",
    "defaultValidateMessages": {
      "default": "Erro de validação no campo ${label}",
      "required": "Por favor, introduza ${label}",
      "enum": "${label} deve ser um dos valores [${enum}]",
      "whitespace": "${label} não pode ser um carácter em branco",
      "date": {
        "format": "Formato da data ${label} é inválido",
        "parse": "${label} não pode ser convertido para data",
        "invalid": "${label} é uma data inválida"
      },
      "types": {
        "string": "${label} não é um(a) ${type} válido(a)",
        "method": "${label} não é um(a) ${type} válido(a)",
        "array": "${label} não é um(a) ${type} válido(a)",
        "object": "${label} não é um(a) ${type} válido(a)",
        "number": "${label} não é um(a) ${type} válido(a)",
        "date": "${label} não é um(a) ${type} válido(a)",
        "boolean": "${label} não é um(a) ${type} válido(a)",
        "integer": "${label} não é um(a) ${type} válido(a)",
        "float": "${label} não é um(a) ${type} válido(a)",
        "regexp": "${label} não é um(a) ${type} válido(a)",
        "email": "${label} não é um(a) ${type} válido(a)",
        "url": "${label} não é um(a) ${type} válido(a)",
        "hex": "${label} não é um(a) ${type} válido(a)"
      },
      "string": {
        "len": "${label} deve ter ${len} caracteres",
        "min": "${label} deve ter pelo menos ${min} caracteres",
        "max": "${label} deve ter até ${max} caracteres",
        "range": "${label} deve ter entre ${min}-${max} caracteres"
      },
      "number": {
        "len": "${label} deve ser igual a ${len}",
        "min": "${label} deve ser no mínimo ${min}",
        "max": "${label} deve ser no máximo ${max}",
        "range": "${label} deve estar entre ${min}-${max}"
      },
      "array": {
        "len": "Deve ter ${len} ${label}",
        "min": "Pelo menos ${min} ${label}",
        "max": "No máximo ${max} ${label}",
        "range": "A quantidade de ${label} deve estar entre ${min}-${max}"
      },
      "pattern": {
        "mismatch": "${label} não corresponde ao padrão ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Data",
    "rangePlaceholder": [
      "Data inicial",
      "Data final"
    ]
  },
  "TimePicker": {
    "placeholder": "Hora",
    "rangePlaceholder": [
      "Hora de início",
      "Hora de fim"
    ]
  }
};

export default locale;
