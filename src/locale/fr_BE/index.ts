import type { Locale } from '../types';

const locale: Locale = {
  "locale": "fr",
  "global": {
    "close": "Fermer",
    "show": "Afficher",
    "hide": "Masquer",
    "placeholder": "Veuillez sélectionner",
    "sortable": "triable"
  },
  "Table": {
    "filterTitle": "Filtrer",
    "filterConfirm": "OK",
    "filterReset": "Réinitialiser",
    "filterEmptyText": "Aucun filtre",
    "filterCheckAll": "Tout sélectionner",
    "filterSearchPlaceholder": "Chercher dans les filtres",
    "emptyText": "Aucune donnée",
    "selectAll": "Sélectionner la page actuelle",
    "selectInvert": "Inverser la sélection de la page actuelle",
    "selectNone": "Désélectionner toutes les données",
    "selectionAll": "Sélectionner toutes les données",
    "sortTitle": "Trier",
    "expand": "Développer la ligne",
    "collapse": "Réduire la ligne",
    "triggerDesc": "Trier par ordre décroissant",
    "triggerAsc": "Trier par ordre croissant",
    "cancelSort": "Annuler le tri"
  },
  "Modal": {
    "okText": "OK",
    "cancelText": "Annuler",
    "justOkText": "OK"
  },
  "Tour": {
    "Next": "Étape suivante",
    "Previous": "Étape précédente",
    "Finish": "Fin de la visite guidée"
  },
  "Popconfirm": {
    "okText": "OK",
    "cancelText": "Annuler"
  },
  "Transfer": {
    "titles": [
      "",
      ""
    ],
    "searchPlaceholder": "Rechercher",
    "itemUnit": "élément",
    "itemsUnit": "éléments",
    "remove": "Désélectionner",
    "selectCurrent": "Sélectionner la page actuelle",
    "removeCurrent": "Désélectionner la page actuelle",
    "selectAll": "Sélectionner toutes les données",
    "removeAll": "Désélectionner toutes les données",
    "selectInvert": "Inverser la sélection de la page actuelle",
    "deselectAll": "Désélectionner toutes les données"
  },
  "Upload": {
    "uploading": "Téléchargement...",
    "removeFile": "Effacer le fichier",
    "uploadError": "Erreur de téléchargement",
    "previewFile": "Fichier de prévisualisation",
    "downloadFile": "Télécharger un fichier"
  },
  "Empty": {
    "description": "Aucune donnée"
  },
  "QRCode": {
    "expired": "Code QR expiré",
    "refresh": "Actualiser",
    "scanned": "Numérisé"
  },
  "ColorPicker": {
    "presetEmpty": "Vide",
    "transparent": "Transparente",
    "singleColor": "Couleur unique",
    "gradientColor": "Couleur dégradée"
  },
  "Text": {
    "edit": "Éditer",
    "copy": "Copier",
    "copied": "Copie effectuée",
    "expand": "Développer",
    "collapse": "Réduire"
  },
  "Form": {
    "optional": "(optionnel)",
    "defaultValidateMessages": {
      "default": "Erreur de validation pour le champ ${label}",
      "required": "Le champ ${label} est obligatoire",
      "enum": "La valeur du champ ${label} doit être parmi [${enum}]",
      "whitespace": "La valeur du champ ${label} ne peut pas être vide",
      "date": {
        "format": "La valeur du champ ${label} n'est pas au format date",
        "parse": "La valeur du champ ${label} ne peut pas être convertie vers une date",
        "invalid": "La valeur du champ ${label} n'est pas une date valide"
      },
      "types": {
        "string": "La valeur du champ ${label} n'est pas valide pour le type ${type}",
        "method": "La valeur du champ ${label} n'est pas valide pour le type ${type}",
        "array": "La valeur du champ ${label} n'est pas valide pour le type ${type}",
        "object": "La valeur du champ ${label} n'est pas valide pour le type ${type}",
        "number": "La valeur du champ ${label} n'est pas valide pour le type ${type}",
        "date": "La valeur du champ ${label} n'est pas valide pour le type ${type}",
        "boolean": "La valeur du champ ${label} n'est pas valide pour le type ${type}",
        "integer": "La valeur du champ ${label} n'est pas valide pour le type ${type}",
        "float": "La valeur du champ ${label} n'est pas valide pour le type ${type}",
        "regexp": "La valeur du champ ${label} n'est pas valide pour le type ${type}",
        "email": "La valeur du champ ${label} n'est pas valide pour le type ${type}",
        "url": "La valeur du champ ${label} n'est pas valide pour le type ${type}",
        "hex": "La valeur du champ ${label} n'est pas valide pour le type ${type}"
      },
      "string": {
        "len": "La taille du champ ${label} doit être de ${len} caractères",
        "min": "La taille du champ ${label} doit être au minimum de ${min} caractères",
        "max": "La taille du champ ${label} doit être au maximum de ${max} caractères",
        "range": "La taille du champ ${label} doit être entre ${min} et ${max} caractères"
      },
      "number": {
        "len": "La valeur du champ ${label} doit être égale à ${len}",
        "min": "La valeur du champ ${label} doit être plus grande que ${min}",
        "max": "La valeur du champ ${label} doit être plus petit que ${max}",
        "range": "La valeur du champ ${label} doit être entre ${min} et ${max}"
      },
      "array": {
        "len": "La taille du tableau ${label} doit être de ${len}",
        "min": "La taille du tableau ${label} doit être au minimum de ${min}",
        "max": "La taille du tableau ${label} doit être au maximum de ${max}",
        "range": "La taille du tableau ${label} doit être entre ${min}-${max}"
      },
      "pattern": {
        "mismatch": "La valeur du champ ${label} ne correspond pas au modèle ${pattern}"
      }
    }
  },
  "DatePicker": {
    "placeholder": "Sélectionner une date",
    "rangePlaceholder": [
      "Date de début",
      "Date de fin"
    ]
  },
  "TimePicker": {
    "placeholder": "Sélectionner l'heure",
    "rangePlaceholder": [
      "Heure de début",
      "Heure de fin"
    ]
  }
};

export default locale;
