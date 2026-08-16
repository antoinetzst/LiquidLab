# 💧 LiquidLab

LiquidLab est une petite webapp en **HTML / CSS / JavaScript pur** pour gérer ses stocks et préparer des e-liquides DIY.

L'application fonctionne entièrement côté navigateur, sans serveur applicatif ni base de données distante.

## ✨ Fonctionnalités

- 📦 Gestion du stock de base neutre
- ⚡ Gestion du stock de boosters de nicotine
- 🍓 Gestion de plusieurs arômes
- 🧪 Calcul et préparation guidée d'un liquide
- 📊 Calcul du taux effectif de nicotine et d'arôme
- ⚖️ Choix de l'arrondi de nicotine lorsque l'écart avec la cible est important
- 🕘 Historique des préparations
- 🗑️ Enregistrement des mélanges jetés afin de déduire malgré tout les ingrédients utilisés
- 💾 Sauvegarde et restauration des données
- 📋 Export / import par copier-coller
- 📂 Export / import au format JSON
- 🔗 Transfert des données via un lien lorsque l'application est hébergée
- 📱 Interface adaptée à Safari sur iPhone
- 📴 Possibilité de fonctionnement hors ligne avec un Service Worker
- 📲 Installation comme webapp / PWA

## 🧮 Logique de calcul

LiquidLab utilise les règles suivantes :

- la **base neutre** est utilisée par multiples de **10 ml** ;
- un **booster** correspond à **10 ml à 20 mg/ml de nicotine** ;
- les boosters sont donc utilisés par multiples de **10 ml** ;
- l'arôme peut être utilisé avec une quantité décimale ;
- le volume est calculé afin de respecter au mieux le dosage d'arôme demandé ;
- LiquidLab calcule le nombre de boosters donnant le taux de nicotine le plus proche de la cible.

Lorsque le meilleur arrondi disponible entraîne un écart supérieur au seuil configuré (par défaut **10 %**), l'utilisateur peut choisir entre :

- l'arrondi inférieur ;
- l'arrondi supérieur.

Le taux effectif de nicotine est recalculé à partir du mélange final :

```text
Nicotine effective (mg/ml)
= (volume de booster × 20) / volume final
```

Le taux effectif d'arôme est calculé ainsi :

```text
Arôme effectif (%)
= volume d'arôme / volume final × 100
```

## 💾 Stockage des données

Les données sont enregistrées dans le navigateur avec **`localStorage`**.

Sont notamment conservés :

- le stock de base ;
- le nombre de boosters ;
- les arômes et leurs stocks ;
- l'historique ;
- les préférences mémorisées par l'application.

Les données ne sont pas enregistrées dans le dépôt GitHub et ne sont pas envoyées à un serveur par LiquidLab.

> [!IMPORTANT]
> `localStorage` n'est pas une sauvegarde absolue. Une suppression des données de Safari ou du site peut effacer les informations enregistrées. Il est recommandé d'exporter régulièrement une sauvegarde.

## 🔄 Sauvegardes et transfert

LiquidLab propose plusieurs méthodes.

### Copier / coller

L'application peut générer une chaîne de sauvegarde du type :

```text
LIQUIDLAB2:...
```

Cette chaîne peut être copiée puis collée dans LiquidLab sur un autre appareil.

### Fichier JSON

Une sauvegarde complète peut être téléchargée sous la forme :

```text
LiquidLab-backup-AAAA-MM-JJ.json
```

Elle peut ensuite être réimportée dans l'application.

### Lien de transfert

Lorsque LiquidLab est hébergé sur une adresse HTTPS, les données peuvent être placées dans le fragment de l'URL :

```text
https://exemple.github.io/liquidlab/#ll=...
```

Le contenu situé après `#` n'est utilisé que par l'application pour reconstruire la sauvegarde.

## 🌐 Publication avec GitHub Pages

Le projet peut être hébergé gratuitement avec GitHub Pages.

Structure recommandée :

```text
LiquidLab/
├── index.html
├── manifest.webmanifest
├── service-worker.js
├── icon-192.png
├── icon-512.png
└── apple-touch-icon.png
```

Dans GitHub :

1. ouvrir **Settings** ;
2. ouvrir **Pages** ;
3. choisir **Deploy from a branch** ;
4. sélectionner la branche `main` ;
5. sélectionner `/(root)` ;
6. enregistrer.

L'application sera ensuite disponible à une adresse de la forme :

```text
https://UTILISATEUR.github.io/NOM-DU-DEPOT/
```

## 📲 Installation sur iPhone

Ouvrir LiquidLab dans **Safari**, puis :

1. appuyer sur **Partager** ;
2. choisir **Ajouter à l'écran d'accueil** ;
3. confirmer avec **Ajouter**.

LiquidLab peut alors être lancé depuis l'écran d'accueil comme une application.

Le projet peut utiliser :

```html
<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

ainsi que les `safe-area-inset-*` afin d'adapter correctement l'interface aux iPhone avec encoche ou Dynamic Island.

## 📴 Fonctionnement hors ligne

Un `service-worker.js` peut mettre en cache les fichiers nécessaires au fonctionnement de LiquidLab.

Le Service Worker met en cache **le code de l'application**.

Il ne remplace pas `localStorage` :

```text
Service Worker / Cache
→ index.html, manifest, icônes...

localStorage
→ stocks, arômes, historique, préférences...
```

Lors d'une mise à jour importante de l'application, penser à changer le nom/version du cache du Service Worker afin que les appareils récupèrent la nouvelle version.

Exemple :

```javascript
const CACHE_NAME = "liquidlab-v3";
```

## 📱 Saisie sur iPhone

Pour afficher directement le clavier numérique dans Safari, les champs numériques peuvent utiliser :

```html
<input
    type="number"
    inputmode="decimal">
```

Pour les valeurs exclusivement entières :

```html
<input
    type="number"
    inputmode="numeric">
```

## ⚠️ Avertissement

LiquidLab est un outil personnel de calcul et de gestion de stock.

Les résultats affichés dépendent des données saisies et des hypothèses configurées dans le code. Il est conseillé de vérifier les quantités avant toute préparation.

Le taux de nicotine affiché correspond à la **concentration théorique du liquide final en mg/ml**. Il ne représente pas la quantité de nicotine effectivement absorbée par l'organisme.

## 🛠️ Technologies

- HTML5
- CSS3
- JavaScript
- `localStorage`
- Web App Manifest
- Service Worker / Cache API
- GitHub Pages

Aucun framework n'est nécessaire.

## 📄 Licence

Projet personnel.  
Ajouter ici la licence souhaitée si le dépôt doit être distribué publiquement.
