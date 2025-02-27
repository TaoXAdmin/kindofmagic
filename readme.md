# Site Web Cinématique de Magie

Un site web immersif pour un magicien professionnel, avec des effets visuels avancés, des animations interactives, et une expérience utilisateur captivante.

## Fonctionnalités principales

### Landing Page Cinématique (WebGL + Three.js)
- Vidéo 4K en boucle avec effet parallax holographique
- Header transparent avec logo animé (chapeau vers cygne)
- Scroll indicator personnalisé avec effets de particules

### Navigation Magique
- Menu radial contextuel qui apparaît au scroll
- Transitions entre pages via effet "coup de baguette magique" (GSAP + Canvas)
- Système de défilement horizontal personnalisé

### Section "Prestations" en 3D
- Carrousel de cartes-flottantes en WebGL
- Animations au hover et interaction au clic
- Projections holographiques des tours décrits

### Expérience "Magic Room"
- Environnement 3D photoréaliste d'un salon victorien mystique
- Déplacement WASD/ZQSD et objets interactifs
- Éclairage dynamique suivant la souris

### Biographie Enchantée
- Timeline verticale avec animations spécifiques à chaque date
- Portrait du magicien avec effet "Miroir magique" utilisant la webcam
- Effets spéciaux : colombe, confettis, cartes en slow motion...

### Formulaire de Contact
- Lettres tapées se transformant en éclairs dorés
- Bouton d'envoi avec effet de lévitation
- Animation d'enveloppe qui brûle pour confirmer l'envoi

### Easter Eggs
- Combinaison de touches secrète (↑↑↓↓←→←→BA) déverrouillant un mini-jeu de cartes
- Mode "Nuit Étoilée" activable via la boule de cristal dans le footer
- Commande vocale "Abracadabra" déclenchant une animation spéciale

## Technologies utilisées

- **Moteur 3D** : Three.js pour la 3D et effets WebGL
- **Animations** : GSAP pour les animations fluides
- **Effets** : Canvas pour les effets personnalisés
- **Interface** : HTML5, CSS3 avec variables et grid layout

## Structure du projet

```
projet/
├── index.html
├── css/
│   ├── reset.css
│   ├── style.css
│   └── icons.css
├── js/
│   ├── app.js
│   ├── modules/
│   │   ├── landing.js
│   │   ├── logo.js
│   │   ├── navigation.js
│   │   ├── carousel.js
│   │   ├── magic-room.js
│   │   ├── biography.js
│   │   ├── contact.js
│   │   └── easter-eggs.js
│   └── vendors/
│       ├── three.min.js
│       ├── gsap.min.js
│       └── particles.min.js
├── assets/
│   ├── images/
│   ├── icons/
│   ├── textures/
│   └── videos/
└── README.md
```

## Installation et déploiement

### Installation locale

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/site-magie-cinematique.git
   cd site-magie-cinematique
   ```

2. Lancez un serveur local (par exemple avec l'extension Live Server de VSCode, ou avec Python) :
   ```bash
   # Avec Python 3
   python -m http.server 8000
   ```

3. Ouvrez votre navigateur à l'adresse : `http://localhost:8000`

### Déploiement sur GitHub Pages

1. Créez un nouveau dépôt sur GitHub

2. Initialisez le dépôt Git local et poussez les fichiers :
   ```bash
   git init
   git add .
   git commit -m "Premier commit"
   git remote add origin https://github.com/votre-utilisateur/site-magie-cinematique.git
   git push -u origin main
   ```

3. Activez GitHub Pages dans les paramètres du dépôt, en sélectionnant la branche 'main' comme source.

## Compatibilité navigateurs

Le site web est optimisé pour les navigateurs modernes prenant en charge WebGL et les fonctionnalités avancées de CSS3 :

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Des fallbacks élégants sont implémentés pour les navigateurs plus anciens.

## Crédits

- Polices : Playfair Display et Cormorant Garamond (Google Fonts)
- Bibliothèques : Three.js, GSAP, Particles.js
- Textures et ressources : Créées sur mesure pour ce projet

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
