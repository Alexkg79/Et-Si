// Génération d'identifiants locaux uniques (pas besoin d'un vrai uuid
// cryptographique pour un usage 100% local et mono-utilisateur).
export function generateId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}
