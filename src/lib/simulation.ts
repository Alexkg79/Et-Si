// Logique de calcul financier — isolée ici pour rester réutilisable telle
// quelle entre l'écran Accueil (Phase 3, durée = temps écoulé depuis la
// création du profil) et l'écran Simulation (Phase 5, durée choisie par
// l'utilisateur via un slider). Voir CLAUDE.md section 6 pour la formule.
import { Habit } from './models';

type AmountFrequency = Pick<Habit, 'amount' | 'frequency'>;

const DAYS_PER_YEAR = 365;
const WEEKS_PER_YEAR = 52;
const MONTHS_PER_YEAR = 12;
const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25;

// Coût annualisé d'une habitude, à partir de son montant et de sa
// fréquence de saisie brute (ex: 1,50 €/jour -> 547,50 €/an).
export function computeAnnualCost(habit: AmountFrequency): number {
  switch (habit.frequency) {
    case 'daily':
      return habit.amount * DAYS_PER_YEAR;
    case 'weekly':
      return habit.amount * WEEKS_PER_YEAR;
    case 'monthly':
      return habit.amount * MONTHS_PER_YEAR;
  }
}

export function computeMonthlyAmount(habit: AmountFrequency): number {
  return computeAnnualCost(habit) / MONTHS_PER_YEAR;
}

// Valeur future totale d'une liste d'habitudes si leur coût mensuel
// cumulé avait été investi à `annualReturnRate` (ex: 0.07 pour 7%/an)
// pendant `years` années (peut être fractionnaire).
export function computeFutureValue(habits: AmountFrequency[], annualReturnRate: number, years: number): number {
  if (years <= 0) return 0;

  const monthlyTotal = habits.reduce((sum, habit) => sum + computeMonthlyAmount(habit), 0);
  if (monthlyTotal <= 0) return 0;

  const r = annualReturnRate / 12;
  const n = years * 12;

  if (r === 0) return monthlyTotal * n;
  return monthlyTotal * ((Math.pow(1 + r, n) - 1) / r);
}

// Valeur future de ce qu'il resterait comme fuite si l'utilisateur
// réduisait sa dépense de `reductionRate` (0 à 1) plutôt que de l'arrêter
// nette (Simulation, écran "Et si...?"). La formule des intérêts
// composés est linéaire en montant mensuel investi, donc réduire le
// coût de X% revient à multiplier la valeur future par (1 - X%) — pas
// besoin de dupliquer la logique de computeFutureValue.
// reductionRate=0 => identique à computeFutureValue (aucun changement) ;
// reductionRate=1 ("j'arrête complètement") => 0, plus aucune fuite à projeter.
export function computeReducedFutureValue(
  habits: AmountFrequency[],
  annualReturnRate: number,
  years: number,
  reductionRate: number
): number {
  return computeFutureValue(habits, annualReturnRate, years) * (1 - reductionRate);
}

// Nombre d'années (fractionnaire) écoulées entre une date ISO et
// maintenant — utilisé par l'écran Accueil pour dériver la durée du
// portefeuille fantôme depuis la date de création du profil.
export function yearsSince(dateISO: string, now: Date = new Date()): number {
  const elapsedMs = Math.max(0, now.getTime() - new Date(dateISO).getTime());
  return elapsedMs / MS_PER_YEAR;
}
