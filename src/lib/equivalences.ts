// Banque d'équivalences concrètes pour l'écran Simulation — CLAUDE.md
// section 3 : ton ironique, second degré, jamais moralisateur. Seuils
// et exemples calés sur le marché français, à ajuster librement au fil
// du temps sans toucher au reste de l'écran.
interface EquivalenceTier {
  maxAmount: number;
  label: string;
}

const EQUIVALENCE_TIERS: EquivalenceTier[] = [
  { maxAmount: 5_000, label: "un objet dont t'as pas vraiment besoin mais qui ferait très plaisir" },
  { maxAmount: 20_000, label: "un scooter flambant neuf, ou une petite voiture d'occasion qui tient la route" },
  { maxAmount: 80_000, label: "un bel apport pour un crédit immobilier" },
  { maxAmount: Infinity, label: 'un bien immobilier. Cash. Voilà.' },
];

export function getEquivalence(amount: number): string {
  const tier = EQUIVALENCE_TIERS.find((candidate) => amount < candidate.maxAmount) ?? EQUIVALENCE_TIERS[EQUIVALENCE_TIERS.length - 1];
  return tier.label;
}
