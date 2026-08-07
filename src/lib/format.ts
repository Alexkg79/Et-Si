import { HabitFrequency } from './models';

// Formatage monétaire partagé, pour garder un rendu cohérent partout où
// un montant en euros est affiché (carte portefeuille fantôme, liste
// d'habitudes, notification ironique...). `fractionDigits` reste à 0 par
// défaut (gros montants annualisés/projetés) ; passer 2 pour un montant
// unitaire saisi par l'utilisateur (ex: "4,00 €").
export function formatEuro(amount: number, fractionDigits = 0): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

// Suffixe à afficher à côté d'un montant saisi dans son unité d'origine
// (ex: "4,00 € / jour") — partagé entre le reçu d'habitudes et l'écran
// Simulation pour rester cohérent partout où ce montant brut apparaît.
export const FREQUENCY_SUFFIX: Record<HabitFrequency, string> = {
  daily: '/ jour',
  weekly: '/ semaine',
  monthly: '/ mois',
};
