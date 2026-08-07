// Modèle de données MVP (local uniquement) — voir CLAUDE.md section 5.

export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  emoji: string;
  name: string;
  category: string; // "cafe" | "tabac" | "abonnement" | "livraison" | "custom" | ...
  amount: number;
  frequency: HabitFrequency;
  createdAt: string; // ISO 8601
  active: boolean;
}

// Profil local (prénom, avatar) : volontairement isolé du reste de
// UserSettings pour pouvoir brancher une vraie authentification plus
// tard sans tout réécrire — voir CLAUDE.md section 5.
export interface LocalProfile {
  firstName: string;
  avatar: string;
  createdAt: string; // ISO 8601 — sert de point de départ au calcul du portefeuille fantôme (CLAUDE.md §6)
}

export interface UserSettings {
  guiltModeEnabled: boolean;
  simulationYears: number;
  simulationReturnRate: number;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  guiltModeEnabled: false,
  simulationYears: 20,
  simulationReturnRate: 0.07,
};
