import type { Locale } from '../types';

const locale: Locale = {
  "locale": "pt-br",
  "global": {
    "placeholder": "Por favor escolha",
    "close": "Fechar",
    "show": "Mostrar",
    "hide": "Ocultar",
    "sortable": "classificável"
  },
  "Table": {
    "filterTitle": "Menu de Filtro",
    "filterConfirm": "OK",
    "filterReset": "Resetar",
    "filterEmptyText": "Sem filtros",
    "filterCheckAll": "Selecionar todos os itens",
    "filterSearchPlaceholder": "Pesquisar nos filtros",
    "emptyText": "Sem conteúdo",
    "selectAll": "Selecionar página atual",
    "selectInvert": "Inverter seleção",
    "selectNone": "Apagar todo o conteúdo",
    "selectionAll": "Selecionar todo o conteúdo",
    "sortTitle": "Ordenar título",
    "expand": "Expandir linha",
    "collapse": "Colapsar linha",
    "triggerDesc": "Clique organiza por descendente",
    "triggerAsc": "Clique organiza por ascendente",
    "cancelSort": "Clique para cancelar organização"
  },
  "Modal": {
    "okText": "OK",
    "cancelText": "Cancelar",
    "justOkText": "OK"
  },
  "Tour": {
    "Next": "Próximo",
    "Previous": "Anterior",
    "Finish": "Finalizar"
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
    "searchPlaceholder": "Procurar",
    "itemUnit": "item",
    "itemsUnit": "items",
    "remove": "Remover",
    "selectCurrent": "Selecionar página atual",
    "removeCurrent": "Remover página atual",
    "selectAll": "Selecionar todos",
    "removeAll": "Remover todos",
    "selectInvert": "Inverter seleção atual",
    "deselectAll": "Desmarcar todos os dados"
  },
  "Upload": {
    "uploading": "Enviando...",
    "removeFile": "Remover arquivo",
    "uploadError": "Erro no envio",
    "previewFile": "Visualizar arquivo",
    "downloadFile": "Baixar arquivo"
  },
  "Empty": {
    "description": "Não há dados"
  },
  "QRCode": {
    "expired": "Código QR expirado",
    "refresh": "Atualizar",
    "scanned": "Escaneado"
  },
  "ColorPicker": {
    "presetEmpty": "Vazio",
    "transparent": "Transparente",
    "singleColor": "Único",
    "gradientColor": "Gradiente"
  },
  "Text": {
    "edit": "editar",
    "copy": "copiar",
    "copied": "copiado",
    "expand": "expandir",
    "collapse": "Recolher"
  },
  "Form": {
    "optional": "(opcional)",
    "defaultValidateMessages": {
      "default": "Erro ${label} na validação de campo",
      "required": "Por favor, insira ${label}",
      "enum": "${label} deve ser um dos seguinte: [${enum}]",
      "whitespace": "${label} não pode ser um carácter vazio",
      "date": {
        "format": " O formato de data ${label} é inválido",
        "parse": "${label} não pode ser convertido para uma data",
        "invalid": "${label} é uma data inválida"
      },
      "types": {
        "string": "${label} não é um ${type} válido",
        "method": "${label} não é um ${type} válido",
        "array": "${label} não é um ${type} válido",
        "object": "${label} não é um ${type} válido",
        "number": "${label} não é um ${type} válido",
        "date": "${label} não é um ${type} válido",
        "boolean": "${label} não é um ${type} válido",
        "integer": "${label} não é um ${type} válido",
        "float": "${label} não é um ${type} válido",
        "regexp": "${label} não é um ${type} válido",
        "email": "${label} não é um ${type} válido",
        "url": "${label} não é um ${type} válido",
        "hex": "${label} não é um ${type} válido"
      },
      "string": {
        "len": "${label} deve possuir ${len} caracteres",
        "min": "${label} deve possuir ao menos ${min} caracteres",
        "max": "${label} deve possuir no máximo ${max} caracteres",
        "range": "${label} deve possuir entre ${min} e ${max} caracteres"
      },
      "number": {
        "len": "${label} deve ser igual à ${len}",
        "min": "O valor mínimo de ${label} é ${min}",
        "max": "O valor máximo de ${label} é ${max}",
        "range": "${label} deve estar entre ${min} e ${max}"
      },
      "array": {
        "len": "Deve ser ${len} ${label}",
        "min": "No mínimo ${min} ${label}",
        "max": "No máximo ${max} ${label}",
        "range": "A quantidade de ${label} deve estar entre ${min} e ${max}"
      },
      "pattern": {
        "mismatch": "${label} não se encaixa no padrão ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Selecionar data",
    "rangePlaceholder": [
      "Data inicial",
      "Data final"
    ]
  },
  "TimePicker": {
    "placeholder": "Hora",
    "rangePlaceholder": [
      "Hora de início",
      "Hora de término"
    ]
  }
};

export default locale;
