import {
  computeAnnualCost,
  computeFutureValue,
  computeMonthlyAmount,
  computeReducedFutureValue,
  yearsSince,
} from './simulation';

describe('computeAnnualCost', () => {
  it('multiplie par 365 pour une fréquence quotidienne', () => {
    expect(computeAnnualCost({ amount: 2, frequency: 'daily' })).toBeCloseTo(730);
  });

  it('multiplie par 52 pour une fréquence hebdomadaire', () => {
    expect(computeAnnualCost({ amount: 10, frequency: 'weekly' })).toBeCloseTo(520);
  });

  it('multiplie par 12 pour une fréquence mensuelle', () => {
    expect(computeAnnualCost({ amount: 50, frequency: 'monthly' })).toBeCloseTo(600);
  });

  it('vaut 0 quand le montant est 0, quelle que soit la fréquence', () => {
    expect(computeAnnualCost({ amount: 0, frequency: 'daily' })).toBe(0);
    expect(computeAnnualCost({ amount: 0, frequency: 'weekly' })).toBe(0);
    expect(computeAnnualCost({ amount: 0, frequency: 'monthly' })).toBe(0);
  });
});

describe('computeMonthlyAmount', () => {
  it("normalise en équivalent mensuel (= coût annuel / 12)", () => {
    expect(computeMonthlyAmount({ amount: 12, frequency: 'monthly' })).toBeCloseTo(12);
    expect(computeMonthlyAmount({ amount: 7, frequency: 'daily' })).toBeCloseTo((7 * 365) / 12);
    expect(computeMonthlyAmount({ amount: 20, frequency: 'weekly' })).toBeCloseTo((20 * 52) / 12);
  });

  it('vaut 0 quand le montant est 0', () => {
    expect(computeMonthlyAmount({ amount: 0, frequency: 'monthly' })).toBe(0);
  });
});

describe('computeFutureValue', () => {
  it('vaut 0 si la durée est 0 ou négative', () => {
    const habits = [{ amount: 10, frequency: 'monthly' as const }];
    expect(computeFutureValue(habits, 0.07, 0)).toBe(0);
    expect(computeFutureValue(habits, 0.07, -5)).toBe(0);
  });

  it("vaut 0 si la liste d'habitudes est vide", () => {
    expect(computeFutureValue([], 0.07, 20)).toBe(0);
  });

  it('vaut 0 si le total mensuel est 0 (toutes les habitudes à 0€)', () => {
    const habits = [
      { amount: 0, frequency: 'monthly' as const },
      { amount: 0, frequency: 'daily' as const },
    ];
    expect(computeFutureValue(habits, 0.07, 20)).toBe(0);
  });

  it('avec un rendement à 0%, revient à une simple somme sans intérêts composés', () => {
    const habits = [{ amount: 100, frequency: 'monthly' as const }];
    // 100€/mois pendant 2 ans, aucun rendement -> 100 * 24 = 2400
    expect(computeFutureValue(habits, 0, 2)).toBeCloseTo(2400);
  });

  it('applique la formule des intérêts composés mensuels pour un cas simple', () => {
    const habits = [{ amount: 100, frequency: 'monthly' as const }];
    // mensuel=100, r=0.12/12=0.01, n=12 -> 100 * ((1.01^12 - 1) / 0.01)
    const expected = 100 * ((Math.pow(1.01, 12) - 1) / 0.01);
    expect(computeFutureValue(habits, 0.12, 1)).toBeCloseTo(expected);
  });

  it('est additif entre plusieurs habitudes pour un même taux et une même durée', () => {
    const habitA = { amount: 30, frequency: 'monthly' as const };
    const habitB = { amount: 5, frequency: 'daily' as const };
    const combined = computeFutureValue([habitA, habitB], 0.07, 10);
    const separateSum = computeFutureValue([habitA], 0.07, 10) + computeFutureValue([habitB], 0.07, 10);
    expect(combined).toBeCloseTo(separateSum);
  });

  it('accepte une durée fractionnaire (années non entières)', () => {
    const habits = [{ amount: 50, frequency: 'monthly' as const }];
    const result = computeFutureValue(habits, 0.07, 0.5);
    expect(result).toBeGreaterThan(0);
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe('computeReducedFutureValue', () => {
  const habits = [{ amount: 100, frequency: 'monthly' as const }];

  it('avec une réduction de 0%, donne un résultat identique à computeFutureValue (comportement inchangé)', () => {
    expect(computeReducedFutureValue(habits, 0.07, 20, 0)).toBeCloseTo(computeFutureValue(habits, 0.07, 20));
  });

  it("avec une réduction de 100% (j'arrête complètement), vaut 0", () => {
    expect(computeReducedFutureValue(habits, 0.07, 20, 1)).toBe(0);
  });

  it('avec une réduction de 50%, vaut la moitié de la valeur non réduite', () => {
    const full = computeFutureValue(habits, 0.07, 20);
    expect(computeReducedFutureValue(habits, 0.07, 20, 0.5)).toBeCloseTo(full / 2);
  });

  it('avec une réduction de 25%, vaut 75% de la valeur non réduite', () => {
    const full = computeFutureValue(habits, 0.07, 20);
    expect(computeReducedFutureValue(habits, 0.07, 20, 0.25)).toBeCloseTo(full * 0.75);
  });

  it('vaut 0 si le total mensuel est 0, quel que soit le taux de réduction', () => {
    const zeroHabits = [{ amount: 0, frequency: 'monthly' as const }];
    expect(computeReducedFutureValue(zeroHabits, 0.07, 20, 0.5)).toBe(0);
  });
});

describe('yearsSince', () => {
  it("retourne 0 pour une date identique à 'now'", () => {
    const now = new Date('2026-01-01T00:00:00.000Z');
    expect(yearsSince(now.toISOString(), now)).toBe(0);
  });

  it('retourne ~1 pour une date à un an (365,25 jours) dans le passé', () => {
    const now = new Date('2026-01-01T00:00:00.000Z');
    const oneYearAgo = new Date(now.getTime() - 365.25 * 24 * 60 * 60 * 1000);
    expect(yearsSince(oneYearAgo.toISOString(), now)).toBeCloseTo(1, 5);
  });

  it('ne renvoie jamais une valeur négative pour une date dans le futur', () => {
    const now = new Date('2026-01-01T00:00:00.000Z');
    const future = new Date('2027-01-01T00:00:00.000Z');
    expect(yearsSince(future.toISOString(), now)).toBe(0);
  });
});
