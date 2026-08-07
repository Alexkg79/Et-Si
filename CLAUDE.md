# Et Si — Documentation projet (contexte pour Claude Code)

> Ce fichier sert de mémoire de projet. Claude Code doit le lire avant toute tâche de développement pour comprendre le produit, le ton, le design system et les règles à respecter.

## 1. Le produit en une phrase

Une app mobile qui calcule, à partir des dépenses récurrentes que **l'utilisateur saisit lui-même**, ce que cet argent aurait valu s'il avait été investi sur le long terme — pour créer une prise de conscience ludique, jamais culpabilisante.

## 2. Principe non négociable : l'utilisateur saisit ses propres montants

Aucune donnée financière n'est pré-remplie ou devinée par l'app. L'utilisateur :
1. Coche les **catégories** qui le concernent (café, clopes, abonnements, livraisons, etc. — liste extensible, il peut aussi créer une catégorie perso)
2. Pour chaque catégorie cochée, un champ s'ouvre pour qu'il entre **son** montant réel et **sa** fréquence (jour / semaine / mois)
3. Rien n'est calculé sur une moyenne générique — c'est justement ce qui rend la prise de conscience percutante : c'est SON café à SON prix.

Ne jamais afficher de prix par défaut à côté d'une catégorie dans l'onboarding. Le champ montant reste vide (placeholder du type "0,00 €") tant que l'utilisateur n'a rien tapé.

## 3. Ton et voix

- Ironique, second degré, jamais moralisateur — l'app se moque gentiment des petites dépenses, pas de l'utilisateur.
- Le mode "notifications passives-agressives" (ex: *"Ce croissant de ce matin ? Dans 20 ans, un scooter."*) est **toujours optionnel et désactivable** (toggle "Mode culpabilité"), jamais activé par défaut sans que l'utilisateur l'ait choisi.
- Vocabulaire : on utilise "fuite" au sens de fuite d'argent (petite sortie d'argent discrète et répétée), pas au sens de fuite d'information.
- Aucun jugement de valeur sur les catégories sensibles (tabac, jeux d'argent) — même style visuel neutre que les autres catégories, pas de mise en avant.

## 4. Design system (dérivé des maquettes validées)

### Palette
| Nom | Hex | Usage |
|---|---|---|
| `ink` | `#12231C` | Fonds sombres, texte principal sur fond clair |
| `ink-soft` | `#3E5A4E` | Texte secondaire |
| `paper` | `#E7E2D2` | Fond principal des écrans (papier thermique) |
| `paper-dim` | `#DCD6C1` | Fonds de cartes secondaires |
| `mint` | `#5FEFA8` | Accent signature — argent, croissance, positif |
| `mint-deep` | `#1E7A54` | États actifs, boutons secondaires |
| `coral` | `#FF6B54` | Alertes, notifications, accent ironique |
| `amber` | `#FFB84D` | Avertissements ponctuels |

### Typographie
- **Display / UI** : Space Grotesk (poids 400/500/600/700)
- **Chiffres / data / éléments "reçu"** : IBM Plex Mono — utilisé systématiquement pour tout montant en euros, pourcentages, durées

### Motif signature
- Bordure "ticket déchiré" (zigzag) en haut de chaque écran, sous la status bar
- Lignes de séparation en pointillés façon ticket de caisse
- Élément code-barres décoratif en bas des écrans de type "reçu"

## 5. Modèle de données (MVP, local uniquement)

```
Habit {
  id: string (uuid)
  emoji: string
  name: string          // ex: "Café à emporter"
  category: string      // ex: "cafe", "tabac", "abonnement", "livraison", "custom"
  amount: number         // montant saisi par l'utilisateur, en euros
  frequency: "daily" | "weekly" | "monthly"
  createdAt: date
  active: boolean
}

UserSettings {
  firstName: string           // saisi à la création du profil
  avatar: string               // emoji choisi par l'utilisateur
  guiltModeEnabled: boolean   // défaut: false
  simulationYears: number     // défaut: 20
  simulationReturnRate: number // défaut: 0.07 (7%/an)
}
```

> Le profil (`firstName`, `avatar`) est purement local au MVP — pas de compte serveur, pas de mot de passe. Garder ce champ isolé du reste de `UserSettings` dans le code (ex: fichier ou module séparé) pour faciliter le branchement d'une vraie authentification plus tard sans tout réécrire.

### Formule de calcul (intérêts composés mensuels)

```
mensuel = montant_normalisé_par_mois(amount, frequency)
r = taux_annuel / 12
n = années * 12
valeur_future = mensuel * ((1 + r)^n - 1) / r
```

## 6. Écrans du MVP

1. **Création de profil** — premier écran au lancement si aucun profil n'existe : prénom + choix d'un avatar/emoji, sauvegardé en local. Aux ouvertures suivantes, cet écran est sauté.
2. **Onboarding des dépenses** — sélection de catégories + saisie montant/fréquence par catégorie cochée (dépliable inline, pas un écran séparé)
3. **Accueil / Relevé** — carte "portefeuille fantôme" (valeur future totale), liste type reçu des habitudes avec leur coût annuel, notification ironique (si mode culpabilité actif), salutation avec le prénom du profil
4. **Ajouter une fuite** — formulaire rapide pour ajouter/éditer une habitude à tout moment (pas seulement à l'onboarding)
5. **Simulation "Et si...?"** — sélection d'une ou plusieurs catégories, slider de durée, résultat avec équivalence concrète, toggle mode culpabilité

## 7. Stack technique recommandée (MVP sans backend)

- **Framework** : React Native + Expo (SDK récent) — permet un build iOS/Android rapide sans config native
- **Navigation** : React Navigation (stack + tab navigator)
- **Stockage local** : `expo-sqlite` ou `AsyncStorage` + une petite couche d'accès type repository (pour faciliter la migration vers un backend plus tard)
- **State management** : Context API + hooks (pas besoin de Redux pour ce périmètre)
- **Style** : StyleSheet natif ou `nativewind` (Tailwind pour RN) si on veut aller vite avec le design system ci-dessus
- **Pas de backend, pas de connexion bancaire** à ce stade — tout est local sur l'appareil

## 8. Hors périmètre du MVP (à ne pas implémenter maintenant)

- Connexion bancaire (Plaid / Budget Insight)
- Vraie authentification (email/mot de passe) et synchronisation cloud du profil — le MVP a un profil **local uniquement**
- Notifications push serveur
- Partage social des résultats

## 9. Conventions de code

- Composants en TypeScript, un composant = un fichier
- Dossiers par feature : `src/features/onboarding`, `src/features/dashboard`, `src/features/simulation`, `src/features/habits`
- Couleurs et fonts centralisées dans `src/theme/tokens.ts`, jamais de valeurs codées en dur dans les composants
- Toute logique de calcul financier isolée dans `src/lib/simulation.ts`, testée unitairement
