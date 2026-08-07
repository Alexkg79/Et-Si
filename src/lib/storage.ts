// Couche de stockage local (SQLite) — connexion à la base + repositories
// simples pour Habit, LocalProfile et UserSettings. CRUD volontairement
// minimal pour l'instant (Phase 0) : la logique métier complète (édition,
// suppression depuis l'UI, validation...) arrive en Phase 2/4.
import * as SQLite from 'expo-sqlite';

import { DEFAULT_USER_SETTINGS, Habit, LocalProfile, UserSettings } from './models';

const DATABASE_NAME = 'et-si.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = openAndMigrate();
  }
  return dbPromise;
}

async function openAndMigrate(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY NOT NULL,
      emoji TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      frequency TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      active INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      firstName TEXT NOT NULL,
      avatar TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      guiltModeEnabled INTEGER NOT NULL,
      simulationYears INTEGER NOT NULL,
      simulationReturnRate REAL NOT NULL
    );
  `);

  // Migration : les profils créés avant l'ajout de `createdAt` (Phase 3)
  // n'ont pas cette colonne sur les installations existantes — on
  // l'ajoute si besoin puis on backfille avec la date du jour, faute de
  // mieux (CREATE TABLE IF NOT EXISTS ne modifie pas une table déjà
  // existante).
  try {
    await db.execAsync("ALTER TABLE profile ADD COLUMN createdAt TEXT NOT NULL DEFAULT ''");
  } catch {
    // la colonne existe déjà, rien à faire
  }
  await db.runAsync("UPDATE profile SET createdAt = ? WHERE createdAt = ''", [new Date().toISOString()]);

  return db;
}

interface HabitRow {
  id: string;
  emoji: string;
  name: string;
  category: string;
  amount: number;
  frequency: string;
  createdAt: string;
  active: number;
}

function rowToHabit(row: HabitRow): Habit {
  return {
    id: row.id,
    emoji: row.emoji,
    name: row.name,
    category: row.category,
    amount: row.amount,
    frequency: row.frequency as Habit['frequency'],
    createdAt: row.createdAt,
    active: row.active === 1,
  };
}

async function insertHabitRow(db: SQLite.SQLiteDatabase, habit: Habit): Promise<void> {
  await db.runAsync(
    `INSERT INTO habits (id, emoji, name, category, amount, frequency, createdAt, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      habit.id,
      habit.emoji,
      habit.name,
      habit.category,
      habit.amount,
      habit.frequency,
      habit.createdAt,
      habit.active ? 1 : 0,
    ]
  );
}

export const habitRepository = {
  async getAll(): Promise<Habit[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<HabitRow>('SELECT * FROM habits ORDER BY createdAt DESC');
    return rows.map(rowToHabit);
  },

  async create(habit: Habit): Promise<void> {
    const db = await getDatabase();
    await insertHabitRow(db, habit);
  },

  // Insertion groupée dans une seule transaction : soit toutes les
  // habitudes sont enregistrées, soit aucune (ex: validation de
  // l'onboarding avec plusieurs catégories cochées) — évite qu'une
  // fermeture brutale de l'app en plein milieu ne laisse un sous-
  // ensemble incohérent de la sélection de l'utilisateur.
  async createMany(habits: Habit[]): Promise<void> {
    if (habits.length === 0) return;
    const db = await getDatabase();
    await db.withExclusiveTransactionAsync(async (txn) => {
      for (const habit of habits) {
        await insertHabitRow(txn, habit);
      }
    });
  },

  async update(habit: Habit): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE habits SET emoji = ?, name = ?, category = ?, amount = ?, frequency = ?, active = ?
       WHERE id = ?`,
      [habit.emoji, habit.name, habit.category, habit.amount, habit.frequency, habit.active ? 1 : 0, habit.id]
    );
  },

  async remove(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM habits WHERE id = ?', [id]);
  },
};

export const profileRepository = {
  async get(): Promise<LocalProfile | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<LocalProfile>('SELECT firstName, avatar, createdAt FROM profile WHERE id = 1');
    return row ?? null;
  },

  async save(profile: LocalProfile): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO profile (id, firstName, avatar, createdAt) VALUES (1, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET firstName = excluded.firstName, avatar = excluded.avatar`,
      [profile.firstName, profile.avatar, profile.createdAt]
    );
  },
};

interface SettingsRow {
  guiltModeEnabled: number;
  simulationYears: number;
  simulationReturnRate: number;
}

export const settingsRepository = {
  async get(): Promise<UserSettings> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<SettingsRow>(
      'SELECT guiltModeEnabled, simulationYears, simulationReturnRate FROM settings WHERE id = 1'
    );
    if (!row) return DEFAULT_USER_SETTINGS;
    return {
      guiltModeEnabled: row.guiltModeEnabled === 1,
      simulationYears: row.simulationYears,
      simulationReturnRate: row.simulationReturnRate,
    };
  },

  async save(settings: UserSettings): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO settings (id, guiltModeEnabled, simulationYears, simulationReturnRate) VALUES (1, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         guiltModeEnabled = excluded.guiltModeEnabled,
         simulationYears = excluded.simulationYears,
         simulationReturnRate = excluded.simulationReturnRate`,
      [settings.guiltModeEnabled ? 1 : 0, settings.simulationYears, settings.simulationReturnRate]
    );
  },
};
