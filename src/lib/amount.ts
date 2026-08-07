// Parsing des montants saisis au clavier (virgule ou point décimal).
// Retourne 0 si la saisie n'est pas un nombre valide, pour simplifier
// les checks de validation ("montant > 0") côté écrans.
export function parseAmountInput(raw: string): number {
  const normalized = raw.replace(',', '.').trim();
  const value = Number(normalized);
  return Number.isFinite(value) ? value : 0;
}
