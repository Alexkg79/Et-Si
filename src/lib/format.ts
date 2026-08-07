// Formatage monétaire partagé, pour garder un rendu cohérent partout où
// un montant en euros est affiché (carte portefeuille fantôme, liste
// d'habitudes, notification ironique...).
export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}
