import { HabitFrequency } from '../../lib/models';

// Catégories prédéfinies de l'onboarding — voir CLAUDE.md section 2 :
// aucun montant n'est associé ici, seulement emoji + libellé. Le montant
// et la fréquence sont saisis par l'utilisateur dans OnboardingScreen.
// Note : "tabac" et "paris sportifs" doivent garder le même style visuel
// neutre que les autres catégories (CLAUDE.md section 3), ne jamais les
// traiter différemment dans le rendu.
export interface PredefinedCategory {
  id: string;
  emoji: string;
  label: string;
}

export const PREDEFINED_CATEGORIES: PredefinedCategory[] = [
  { id: 'cafe', emoji: '☕', label: 'Café' },
  { id: 'snack', emoji: '🥐', label: 'Croissant / snack' },
  { id: 'livraison', emoji: '🛵', label: 'Livraison de repas' },
  { id: 'abonnement', emoji: '📱', label: 'Abonnement' },
  { id: 'tabac', emoji: '🚬', label: 'Tabac' },
  { id: 'paris', emoji: '🎰', label: 'Paris sportifs' },
  { id: 'transport', emoji: '🚌', label: 'Transport' },
];

export const CUSTOM_CATEGORY_ID = 'custom';
export const CUSTOM_CATEGORY_EMOJI = '💸';

// Représentation d'une ligne catégorie éditable dans un formulaire
// (checklist multi-sélection de l'onboarding, sélection unique de
// l'ajout ad-hoc). Partagée pour éviter de dupliquer cette forme entre
// OnboardingScreen et AddHabitScreen.
export interface CategoryLine {
  key: string;
  categoryId: string;
  emoji: string;
  name: string;
  isCustom: boolean;
  checked: boolean;
  amount: string;
  frequency: HabitFrequency | null;
}

export function buildInitialCategoryLines(): CategoryLine[] {
  return PREDEFINED_CATEGORIES.map((category) => ({
    key: category.id,
    categoryId: category.id,
    emoji: category.emoji,
    name: category.label,
    isCustom: false,
    checked: false,
    amount: '',
    frequency: null,
  }));
}
