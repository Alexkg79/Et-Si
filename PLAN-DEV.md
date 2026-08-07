# Et Si — Plan de développement MVP

Objectif : sortir un prototype fonctionnel local (sans backend, sans connexion bancaire) pour valider le concept avant d'investir dans la complexité.

## Phase 0 — Mise en place du projet
- Initialiser le projet Expo (TypeScript)
- Installer et configurer React Navigation (stack + tab)
- Mettre en place `src/theme/tokens.ts` avec la palette, les fonts (Space Grotesk, IBM Plex Mono) et le type scale
- Créer l'arborescence de dossiers par feature (`onboarding`, `dashboard`, `habits`, `simulation`, `theme`, `lib`)
- Mettre en place le stockage local (`expo-sqlite` ou `AsyncStorage`) avec une couche repository simple (`src/lib/storage.ts`)
- Écran de base fonctionnel (navigation entre 4 onglets vides) pour valider que le socle tourne sur iOS et Android

**Livrable** : app vide qui build et navigue, avec le design system en place.

## Phase 1 — Création de compte / profil
- Écran de bienvenue + création de profil local (prénom, avatar/emoji au choix) — pas de backend à ce stade, pas de mot de passe
- Sauvegarde du profil en local (`UserSettings` étendu avec `firstName`, `avatar`)
- Écran de garde au lancement : si un profil existe déjà, on saute directement à l'accueil ; sinon on démarre le flow de création de profil puis l'onboarding des dépenses
- Prévoir dans le code une séparation claire entre "profil local" et "auth", pour pouvoir brancher une vraie authentification plus tard sans tout réécrire

**Livrable** : l'utilisateur a un profil avant même de renseigner ses dépenses ; l'app le reconnaît aux ouvertures suivantes.

## Phase 2 — Onboarding des dépenses
- Écran de sélection de catégories (liste de catégories prédéfinies + option "catégorie perso")
- Comportement : cocher une catégorie déplie un champ montant + sélecteur de fréquence, sans valeur pré-remplie
- Sauvegarde des habitudes cochées en local à la validation
- Gestion de l'état vide (aucune catégorie disponible / première ouverture)

**Livrable** : un utilisateur peut créer son profil de dépenses de A à Z, une fois son compte créé.

## Phase 3 — Accueil / Relevé
- Carte "portefeuille fantôme" avec calcul de la valeur future totale (formule d'intérêts composés, cf. `CLAUDE.md` §6)
- Liste type reçu des habitudes actives avec leur coût annualisé
- Notification ironique conditionnée au toggle "mode culpabilité" (désactivé par défaut)
- Gestion de l'état vide (aucune habitude enregistrée → invitation à aller sur l'onboarding)
- Petit rappel du prénom/avatar du profil sur l'écran (ex: "Salut Léa 👋")

**Livrable** : l'utilisateur voit l'impact cumulé de ses habitudes dès l'ouverture de l'app.

## Phase 4 — Gestion des dépenses (ajout / édition / suppression)
- Formulaire d'ajout d'une nouvelle habitude accessible depuis l'onglet dédié
- Édition et suppression d'une habitude existante depuis la liste de l'accueil
- Validation des champs (montant > 0, nom requis)

**Livrable** : le profil de dépenses est éditable en continu, pas seulement à l'onboarding.

## Phase 5 — Simulation "Et si...?"
- Sélection d'une catégorie ou de l'ensemble cumulé
- Slider de durée (5 à 40 ans) avec recalcul en temps réel
- Génération de l'équivalence concrète associée au montant (banque d'équivalences par palier)
- Toggle "mode culpabilité" partagé avec l'écran d'accueil

**Livrable** : l'écran phare de l'app, celui qui déclenche la prise de conscience.

## Phase 6 — Polish et robustesse
- Persistance fiable entre les sessions (test de fermeture/réouverture de l'app)
- États vides et messages d'erreur cohérents avec le ton de l'app
- Accessibilité de base (contrastes, tailles de police, focus)
- Micro-animations sur le montant du portefeuille fantôme et le slider de simulation
- Tests unitaires sur `src/lib/simulation.ts`

**Livrable** : version MVP stable, prête à tester avec de vrais utilisateurs.

## Post-MVP (hors périmètre actuel)
- Connexion bancaire (détection automatique des dépenses récurrentes)
- Vraie authentification (email/mot de passe) et synchronisation cloud du profil entre appareils
- Partage social des résultats de simulation
- Notifications push planifiées

---

**Ordre d'exécution recommandé avec Claude Code** : une phase = une session de travail, en validant le livrable de chaque phase avant de passer à la suivante. Voir `PROMPT-INITIAL.md` pour démarrer la Phase 0.
