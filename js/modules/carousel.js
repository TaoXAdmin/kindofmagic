/**
 * Module pour le carrousel 3D interactif des prestations
 */

// Variables globales
let scene, camera, renderer;
let cards = [];
let raycaster, mouse;
let currentCardIndex = 0;
let rotationSpeed = 0.005;
let isInitialized = false;
let carouselContainer;
let clock = new THREE.Clock();

// Données des prestations
const prestationsData = [
  {
    title: "Magie de Close-up",
    description: "Magie de proximité avec cartes, pièces et objets du quotidien. Parfait pour vos cocktails et réceptions.",
    icon: "card",
    color: "#FFD700"
  },
  {
    title: "Mentalisme",
    description: "Découvrez l'art de lire dans les pensées et de prédire l'avenir. Une expérience fascinante pour vos invités.",
    icon: "mind",
    color: "#4B0082"
  },
  {
    title: "Grandes Illusions",
    description: "Spectacles scéniques avec apparitions, disparitions et lévitations. Idéal pour vos galas et événements d'entreprise.",
    icon: "rabbit",
    color: "#B22222"
  },
  {
    title: "Magie Numérique",
    description: "La magie rencontre la technologie pour une expérience interactive et moderne adaptée à tous vos événements.",
    icon: "digital",
    color: "#4169E1"
  },
  {
    title: "Ateliers d'Initiation",
    description: "Apprenez les bases de la magie et repartez avec quelques tours à présenter à vos proches. Pour tous âges.",
    icon: "workshop",
    color: "#2E8B57"
  }
];

// Initialisation du carrousel 3D
export function initCarousel() {
  carouselContainer = document.getElementById('carousel-container');
  if (!carouselContainer) return;
  
  // Initialiser le carrousel seulement lorsqu'il est visible
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isInitialized) {
      setupCarousel();
      isInitialized = true;
    }
  }, { threshold: 0.1 });
  
  observer.observe(carouselContainer);
}

// Configuration du carrousel
function setupCarousel() {
  // Créer la scène Three.js
  scene = new THREE.Scene();
  
  // Créer la caméra
  const aspectRatio = carouselContainer.clientWidth / carouselContainer.clientHeight;
  camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
  camera.position.z = 10;
  
  // Créer le renderer WebGL
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setSize(carouselContainer.clientWidth, carouselContainer.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  carouselContainer.appendChild(renderer.domElement);
  
  // Ajouter des lumières
  addLights();
  
  // Créer les cartes
  createCards();
  
  // Configurer le raycaster pour l'interaction
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  
  // Ajouter les écouteurs d'événements
  addEventListeners();
  
  // Démarrer l'animation
  animate();
}

// Ajouter des lumières à la scène
function addLights() {
  // Lumière ambiante
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  // Lumière directionnelle principale
  const mainLight = new THREE.DirectionalLight(0xffffff, 1);
  mainLight.position.set(10, 10, 10);
  scene.add(mainLight);
  
  // Lumière d'accentuation dorée
  const goldLight = new THREE.PointLight(0xffd700, 1, 20);
  goldLight.position.set(-5, 3, 5);
  scene.add(goldLight);
  
  // Lumière d'accentuation pourpre
  const purpleLight = new THREE.PointLight(0x4b0082, 0.8, 20);
  purpleLight.position.set(5, -3, 5);
  scene.add(purpleLight);
}

// Créer les cartes pour le carrousel
function createCards() {
  const cardGeometry = new THREE.PlaneGeometry(3, 4, 20, 20);
  
  // Créer chaque carte
  prestationsData.forEach((prestation, index) => {
    // Créer un matériel avec des réflexions et ombres
    const cardMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.8,
      side: THREE.DoubleSide
    });
    
    // Créer une texture de base pour la carte
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 712;
    const ctx = canvas.getContext('2d');
    
    // Fond de la carte avec dégradé
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#111111');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Bordure dorée
    ctx.strokeStyle = prestation.color;
    ctx.lineWidth = 20;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Titre
    ctx.font = 'bold 40px "Playfair Display"';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(prestation.title, canvas.width / 2, 80);
    
    // Icône (simulée par un cercle coloré)
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2 - 50, 100, 0, Math.PI * 2);
    ctx.fillStyle = prestation.color;
    ctx.fill();
    
    // Description
    ctx.font = '30px "Cormorant Garamond"';
    ctx.fillStyle = '#FFFFFF';
    
    // Texte multiligne
    const words = prestation.description.split(' ');
    let line = '';
    let y = canvas.height - 200;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const testWidth = ctx.measureText(testLine).width;
      
      if (testWidth > canvas.width - 60 && i > 0) {
        ctx.fillText(line, canvas.width / 2, y);
        line = words[i] + ' ';
        y += 40;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, y);
    
    // Créer la texture à partir du canvas
    const cardTexture = new THREE.CanvasTexture(canvas);
    cardMaterial.map = cardTexture;
    
    // Créer la carte 3D
    const card = new THREE.Mesh(cardGeometry, cardMaterial);
    
    // Positionner la carte
    const angleStep = (Math.PI * 2) / prestationsData.length;
    const angle = index * angleStep;
    const radius = 7;
    
    card.position.x = Math.sin(angle) * radius;
    card.position.z = Math.cos(angle) * radius;
    card.rotation.y = -angle + Math.PI;
    
    // Ajouter des données personnalisées à l'objet
    card.userData = {
      index,
      title: prestation.title,
      description: prestation.description,
      icon: prestation.icon,
      color: prestation.color,
      originalPosition: { ...card.position },
      originalRotation: { ...card.rotation },
      hovered: false
    };
    
    scene.add(card);
    cards.push(card);
  });
}

// Ajouter les écouteurs d'événements
function addEventListeners() {
  // Gérer les mouvements de souris
  renderer.domElement.addEventListener('mousemove', (event) => {
    // Calculer la position de la souris normalisée
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  });
  
  // Gérer les clics de souris
  renderer.domElement.addEventListener('click', () => {
    // Vérifier si une carte est survolée
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cards);
    
    if (intersects.length > 0) {
      const selectedCard = intersects[0].object;
      showCardDetails(selectedCard);
    }
  });
  
  // Gérer le redimensionnement de la fenêtre
  window.addEventListener('resize', () => {
    if (!carouselContainer) return;
    
    // Mettre à jour la caméra
    camera.aspect = carouselContainer.clientWidth / carouselContainer.clientHeight;
    camera.updateProjectionMatrix();
    
    // Mettre à jour le renderer
    renderer.setSize(carouselContainer.clientWidth, carouselContainer.clientHeight);
  });
  
  // Ajouter des boutons de navigation
  addNavigationButtons();
}

// Ajouter des boutons de navigation
function addNavigationButtons() {
  // Créer les boutons
  const prevButton = document.createElement('button');
  prevButton.className = 'carousel-nav carousel-nav--prev';
  prevButton.innerHTML = '<span>&lt;</span>';
  prevButton.setAttribute('aria-label', 'Prestation précédente');
  
  const nextButton = document.createElement('button');
  nextButton.className = 'carousel-nav carousel-nav--next';
  nextButton.innerHTML = '<span>&gt;</span>';
  nextButton.setAttribute('aria-label', 'Prestation suivante');
  
  // Styles CSS en ligne
  const buttonStyle = `
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(10, 10, 10, 0.6);
    border: 1px solid rgba(255, 215, 0, 0.5);
    color: #FFD700;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    z-index: 10;
    transition: all 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  
  prevButton.style.cssText = buttonStyle + 'left: 20px;';
  nextButton.style.cssText = buttonStyle + 'right: 20px;';
  
  // Ajouter les boutons au conteneur
  carouselContainer.appendChild(prevButton);
  carouselContainer.appendChild(nextButton);
  
  // Ajouter les écouteurs d'événements
  prevButton.addEventListener('click', () => {
    rotateCarousel('prev');
  });
  
  nextButton.addEventListener('click', () => {
    rotateCarousel('next');
  });
}

// Faire tourner le carrousel
function rotateCarousel(direction) {
  // Mettre à jour l'index courant
  if (direction === 'next') {
    currentCardIndex = (currentCardIndex + 1) % cards.length;
  } else {
    currentCardIndex = (currentCardIndex - 1 + cards.length) % cards.length;
  }
  
  // Calculer le nouvel angle
  const angleStep = (Math.PI * 2) / cards.length;
  const targetAngle = currentCardIndex * angleStep;
  
  // Animer la rotation avec GSAP
  gsap.to(scene.rotation, {
    y: targetAngle,
    duration: 1,
    ease: 'power2.out'
  });
}

// Afficher les détails d'une carte
function showCardDetails(card) {
  const { title, description, icon, color } = card.userData;
  
  // Animer la carte sélectionnée
  gsap.to(card.position, {
    z: card.userData.originalPosition.z + 1.5,
    duration: 0.5,
    ease: 'power2.out'
  });
  
  // Créer une projection holographique
  showHolographicProjection(card);
  
  // Revenir à la position d'origine après un délai
  setTimeout(() => {
    gsap.to(card.position, {
      z: card.userData.originalPosition.z,
      duration: 0.5,
      ease: 'power2.in'
    });
  }, 5000);
}

// Afficher une projection holographique 3D
function showHolographicProjection(card) {
  const { icon, color } = card.userData;
  
  // Créer un conteneur pour la projection
  const projectionContainer = document.createElement('div');
  projectionContainer.className = 'holographic-projection';
  
  projectionContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.5s ease;
  `;
  
  // Ajouter le contenu de la projection
  const projectionContent = document.createElement('div');
  projectionContent.className = 'projection-content';
  
  projectionContent.style.cssText = `
    width: 80%;
    max-width: 800px;
    position: relative;
  `;
  
  // Ajouter un bouton de fermeture
  const closeButton = document.createElement('button');
  closeButton.className = 'projection-close';
  closeButton.innerHTML = '×';
  closeButton.setAttribute('aria-label', 'Fermer la projection');
  
  closeButton.style.cssText = `
    position: absolute;
    top: -40px;
    right: 0;
    background: none;
    border: none;
    color: #FFD700;
    font-size: 30px;
    cursor: pointer;
  `;
  
  // Ajouter une iframe pour la visualisation 3D (simulée)
  const iframe = document.createElement('iframe');
  iframe.style.cssText = `
    width: 100%;
    height: 500px;
    border: 1px solid ${color};
    background: #000;
  `;
  
  // Pour cet exemple, nous utiliserons une simple page HTML avec un message
  // Dans une implémentation réelle, ce serait une visualisation WebXR
  iframe.srcdoc = `
    <html>
      <head>
        <style>
          body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #000;
            color: ${color};
            font-family: Arial, sans-serif;
            text-align: center;
          }
          .icon {
            font-size: 80px;
            margin-bottom: 20px;
          }
          .message {
            font-size: 24px;
          }
        </style>
      </head>
      <body>
        <div>
          <div class="icon">✨</div>
          <div class="message">Projection holographique pour "${card.userData.title}"</div>
          <p>Dans une version finale, cette zone contiendrait une véritable visualisation 3D interactive.</p>
        </div>
      </body>
    </html>
  `;
  
  // Assembler les éléments
  projectionContent.appendChild(closeButton);
  projectionContent.appendChild(iframe);
  projectionContainer.appendChild(projectionContent);
  document.body.appendChild(projectionContainer);
  
  // Afficher la projection
  setTimeout(() => {
    projectionContainer.style.opacity = '1';
    projectionContainer.style.pointerEvents = 'auto';
  }, 100);
  
  // Fermer la projection au clic
  closeButton.addEventListener('click', () => {
    projectionContainer.style.opacity = '0';
    projectionContainer.style.pointerEvents = 'none';
    
    // Supprimer l'élément après la transition
    setTimeout(() => {
      document.body.removeChild(projectionContainer);
    }, 500);
  });
}

// Fonction d'animation
function animate() {
  requestAnimationFrame(animate);
  
  // Rotation automatique lente du carrousel (sauf si une carte est survolée)
  let hoveredCard = false;
  
  // Détecter les cartes survolées
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cards);
  
  // Réinitialiser toutes les cartes
  cards.forEach(card => {
    if (card.userData.hovered) {
      // Revenir à la taille normale
      gsap.to(card.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.3
      });
      
      card.userData.hovered = false;
    }
  });
  
  // Gérer les interactions
  if (intersects.length > 0) {
    const hoveredCard = intersects[0].object;
    
    // Marquer la carte comme survolée
    hoveredCard.userData.hovered = true;
    
    // Agrandir légèrement la carte survolée
    gsap.to(hoveredCard.scale, {
      x: 1.05,
      y: 1.05,
      z: 1.05,
      duration: 0.3
    });
    
    // Changer le curseur
    renderer.domElement.style.cursor = 'pointer';
  } else {
    // Réinitialiser le curseur
    renderer.domElement.style.cursor = 'auto';
    
    // Rotation continue si aucune carte n'est survolée
    scene.rotation.y += rotationSpeed;
  }
  
  // Animer les cartes (effet de flottement)
  const time = clock.getElapsedTime();
  
  cards.forEach(card => {
    // Effet de flottement léger
    card.position.y = card.userData.originalPosition.y + Math.sin(time + card.userData.index * 0.5) * 0.1;
  });
  
  // Rendre la scène
  renderer.render(scene, camera);
}