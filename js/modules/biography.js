/**
 * Module pour la section biographie avec timeline animée
 */

// Données biographiques
const biographyData = [
  {
    year: 2005,
    title: "Premiers pas dans la magie",
    description: "Découverte des tours de cartes et fascination pour l'art de l'illusion.",
    effect: "dove", // Effet de colombe
    icon: "magic-wand"
  },
  {
    year: 2010,
    title: "Première scène internationale",
    description: "Reconnaissance internationale et tournée à travers l'Europe.",
    effect: "confetti", // Pluie de confettis
    icon: "globe"
  },
  {
    year: 2015,
    title: "Grand prix de Monte-Carlo",
    description: "Récompensé par le prestigieux Grand Prix de la magie à Monte-Carlo.",
    effect: "sparkles", // Étincelles
    icon: "trophy"
  },
  {
    year: 2020,
    title: "Spectacle 'Illusions Infinies'",
    description: "Création d'un spectacle innovant mêlant réalité virtuelle et magie traditionnelle.",
    effect: "hologram", // Effet holographique
    icon: "vr-glasses"
  },
  {
    year: 2024,
    title: "Nouvelle ère magique",
    description: "Lancement d'une série d'expériences magiques interactives et immersives.",
    effect: "cards", // Cartes en slow motion
    icon: "cards"
  }
];

// Variables globales
let timelineContainer;
let portraitContainer;
let mirrorEffect = false;
let isInitialized = false;

// Initialisation de la section biographie
export function initBiography() {
  // Récupérer les conteneurs
  timelineContainer = document.querySelector('.biography__timeline');
  portraitContainer = document.getElementById('portrait-container');
  
  if (!timelineContainer || !portraitContainer) return;
  
  // Initialiser la biographie seulement lorsqu'elle est visible
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isInitialized) {
      createTimeline();
      createPortrait();
      isInitialized = true;
    }
  }, { threshold: 0.1 });
  
  observer.observe(document.querySelector('.biography'));
}

// Créer la timeline verticale
function createTimeline() {
  // Vider le conteneur
  timelineContainer.innerHTML = '';
  
  // Créer les éléments de la timeline
  biographyData.forEach((item, index) => {
    // Créer l'élément de la timeline
    const timelineItem = document.createElement('div');
    timelineItem.className = `timeline-item ${index % 2 === 0 ? 'left' : 'right'}`;
    
    // Style CSS en ligne
    timelineItem.style.cssText = `
      position: relative;
      margin-bottom: 50px;
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    `;
    
    // Contenu de l'élément
    timelineItem.innerHTML = `
      <div class="timeline-item__content" style="
        background: rgba(10, 10, 10, 0.8);
        border: 1px solid rgba(255, 215, 0, 0.3);
        border-radius: 5px;
        padding: 20px;
        position: relative;
        ${index % 2 === 0 ? 'margin-right: 50px;' : 'margin-left: 50px;'}
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      ">
        <div class="timeline-item__year" style="
          position: absolute;
          top: 0;
          ${index % 2 === 0 ? 'right: -80px;' : 'left: -80px;'}
          background: #FFD700;
          color: #0a0a0a;
          padding: 5px 10px;
          border-radius: 3px;
          font-family: 'Playfair Display', serif;
          font-weight: bold;
          transform: translateY(-50%);
        ">${item.year}</div>
        
        <div class="timeline-item__icon" style="
          position: absolute;
          ${index % 2 === 0 ? 'right: -25px;' : 'left: -25px;'}
          top: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #4B0082;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #FFD700;
          font-size: 24px;
          box-shadow: 0 0 10px rgba(75, 0, 130, 0.5);
        ">
          <img src="assets/icons/${item.icon}.svg" alt="${item.title}" style="width: 60%; height: 60%;">
        </div>
        
        <h3 style="
          color: #FFD700;
          margin-top: 0;
          font-family: 'Playfair Display', serif;
        ">${item.title}</h3>
        
        <p style="
          margin-bottom: 0;
          color: #FFFFFF;
        ">${item.description}</p>
        
        <div class="timeline-item__effect" data-effect="${item.effect}"></div>
      </div>
    `;
    
    // Ajouter l'élément à la timeline
    timelineContainer.appendChild(timelineItem);
    
    // Observer l'élément pour déclencher l'animation
    observeTimelineItem(timelineItem, item.effect);
  });
}

// Observer un élément de la timeline pour déclencher l'animation
function observeTimelineItem(element, effectType) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      // Animer l'entrée de l'élément
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
      
      // Déclencher l'effet spécial
      setTimeout(() => {
        triggerTimelineEffect(element, effectType);
      }, 500);
      
      // Arrêter d'observer
      observer.unobserve(element);
    }
  }, { threshold: 0.5 });
  
  observer.observe(element);
}

// Déclencher un effet spécial pour un élément de la timeline
function triggerTimelineEffect(element, effectType) {
  const effectContainer = element.querySelector('.timeline-item__effect');
  if (!effectContainer) return;
  
  switch (effectType) {
    case 'dove':
      createDoveEffect(effectContainer);
      break;
    case 'confetti':
      createConfettiEffect(effectContainer);
      break;
    case 'sparkles':
      createSparklesEffect(effectContainer);
      break;
    case 'hologram':
      createHologramEffect(effectContainer);
      break;
    case 'cards':
      createCardsEffect(effectContainer);
      break;
  }
}

// Effet de colombe
function createDoveEffect(container) {
  // Créer l'élément de la colombe
  const dove = document.createElement('div');
  dove.className = 'dove-effect';
  
  dove.style.cssText = `
    position: absolute;
    width: 60px;
    height: 60px;
    background-image: url('../assets/images/dove.svg');
    background-size: contain;
    background-repeat: no-repeat;
    top: 0;
    left: 50%;
    transform: translate(-50%, -100%);
    opacity: 0;
    z-index: 10;
  `;
  
  container.appendChild(dove);
  
  // Animer la colombe
  gsap.timeline()
    .to(dove, {
      opacity: 1,
      duration: 0.5
    })
    .to(dove, {
      y: -100,
      x: 100,
      rotation: 20,
      scale: 2,
      duration: 2,
      ease: 'power1.out'
    })
    .to(dove, {
      opacity: 0,
      duration: 0.5
    }, '-=0.5');
}

// Effet de confettis
function createConfettiEffect(container) {
  // Créer le conteneur de confettis
  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'confetti-container';
  
  confettiContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
  `;
  
  container.appendChild(confettiContainer);
  
  // Couleurs des confettis
  const colors = ['#FFD700', '#4B0082', '#FF4500', '#1E90FF', '#32CD32'];
  
  // Créer les confettis
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    
    confetti.style.cssText = `
      position: absolute;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background-color: ${colors[Math.floor(Math.random() * colors.length)]};
      top: -20px;
      left: ${Math.random() * 100}%;
      opacity: 0;
    `;
    
    confettiContainer.appendChild(confetti);
    
    // Animer les confettis
    gsap.to(confetti, {
      y: container.offsetHeight + 100,
      x: (Math.random() - 0.5) * 200,
      rotation: Math.random() * 360,
      opacity: 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 0.5,
      ease: 'power1.out',
      onComplete: () => {
        confettiContainer.removeChild(confetti);
      }
    });
  }
  
  // Supprimer le conteneur après l'animation
  setTimeout(() => {
    if (confettiContainer.parentNode) {
      container.removeChild(confettiContainer);
    }
  }, 5000);
}

// Effet d'étincelles
function createSparklesEffect(container) {
  // Créer le conteneur d'étincelles
  const sparklesContainer = document.createElement('div');
  sparklesContainer.className = 'sparkles-container';
  
  sparklesContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  `;
  
  container.appendChild(sparklesContainer);
  
  // Créer les étincelles
  for (let i = 0; i < 30; i++) {
    const sparkle = document.createElement('div');
    
    sparkle.style.cssText = `
      position: absolute;
      width: 3px;
      height: 3px;
      background-color: #FFD700;
      border-radius: 50%;
      box-shadow: 0 0 10px #FFD700, 0 0 20px #FFD700;
      top: 50%;
      left: 50%;
      opacity: 0;
    `;
    
    sparklesContainer.appendChild(sparkle);
    
    // Animer les étincelles
    gsap.to(sparkle, {
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      opacity: 1,
      duration: Math.random() * 1 + 0.5,
      delay: Math.random() * 0.5,
      ease: 'power1.out',
      onComplete: () => {
        gsap.to(sparkle, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            sparklesContainer.removeChild(sparkle);
          }
        });
      }
    });
  }
  
  // Supprimer le conteneur après l'animation
  setTimeout(() => {
    if (sparklesContainer.parentNode) {
      container.removeChild(sparklesContainer);
    }
  }, 3000);
}

// Effet holographique
function createHologramEffect(container) {
  // Créer le conteneur holographique
  const hologramContainer = document.createElement('div');
  hologramContainer.className = 'hologram-container';
  
  hologramContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background: linear-gradient(45deg, rgba(30, 144, 255, 0.2), rgba(138, 43, 226, 0.2));
    opacity: 0;
    border-radius: 5px;
    overflow: hidden;
  `;
  
  // Ajouter des lignes holographiques
  for (let i = 0; i < 5; i++) {
    const line = document.createElement('div');
    
    line.style.cssText = `
      position: absolute;
      height: 1px;
      width: 100%;
      background: rgba(255, 255, 255, 0.5);
      top: ${i * 25}%;
      left: 0;
      transform: translateY(-50%);
    `;
    
    hologramContainer.appendChild(line);
  }
  
  container.appendChild(hologramContainer);
  
  // Animer l'effet holographique
  gsap.timeline()
    .to(hologramContainer, {
      opacity: 1,
      duration: 0.5
    })
    .to(hologramContainer.children, {
      y: 100,
      stagger: 0.1,
      duration: 2,
      repeat: 1,
      yoyo: true
    })
    .to(hologramContainer, {
      opacity: 0,
      duration: 0.5
    });
}

// Effet de cartes en slow motion
function createCardsEffect(container) {
  // Créer le conteneur de cartes
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'cards-container';
  
  cardsContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    perspective: 1000px;
  `;
  
  container.appendChild(cardsContainer);
  
  // Créer les cartes
  for (let i = 0; i < 10; i++) {
    const card = document.createElement('div');
    
    card.style.cssText = `
      position: absolute;
      width: 40px;
      height: 60px;
      background-color: white;
      border-radius: 5px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(${Math.random() * 360}deg) scale(0);
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    `;
    
    // Ajouter un design simple à la carte
    const cardInner = document.createElement('div');
    cardInner.style.cssText = `
      position: absolute;
      top: 5px;
      left: 5px;
      right: 5px;
      bottom: 5px;
      border: 1px solid #FFD700;
      border-radius: 2px;
    `;
    
    card.appendChild(cardInner);
    cardsContainer.appendChild(card);
    
    // Animer les cartes en slow motion
    gsap.to(card, {
      scale: 1,
      rotation: Math.random() * 360,
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      duration: 1.5,
      delay: i * 0.1,
      ease: 'power1.out'
    });
  }
  
  // Supprimer le conteneur après l'animation
  setTimeout(() => {
    if (cardsContainer.parentNode) {
      container.removeChild(cardsContainer);
    }
  }, 5000);
}

// Créer le portrait avec effet "Miroir magique"
function createPortrait() {
  if (!portraitContainer) return;
  
  // Créer l'élément d'image pour le portrait
  const portrait = document.createElement('div');
  portrait.className = 'portrait';
  
  portrait.style.cssText = `
    width: 100%;
    height: 100%;
    background-image: url('../assets/images/portrait.jpg');
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
  `;
  
  // Créer l'effet de miroir
  const mirrorOverlay = document.createElement('div');
  mirrorOverlay.className = 'mirror-overlay';
  
  mirrorOverlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(75, 0, 130, 0.1));
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.5s ease;
  `;
  
  // Créer le cadre du miroir
  const mirrorFrame = document.createElement('div');
  mirrorFrame.className = 'mirror-frame';
  
  mirrorFrame.style.cssText = `
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border: 10px solid #FFD700;
    background: none;
    pointer-events: none;
  `;
  
  // Assembler les éléments
  portrait.appendChild(mirrorOverlay);
  portraitContainer.appendChild(portrait);
  portraitContainer.appendChild(mirrorFrame);
  
  // Activer l'effet de miroir magique au survol
  portraitContainer.addEventListener('mouseenter', () => {
    if (window.innerWidth > 768) { // Seulement sur desktop
      activateMirrorEffect();
    }
  });
  
  portraitContainer.addEventListener('mouseleave', () => {
    deactivateMirrorEffect();
  });
  
  // Vérifier si la webcam est disponible
  checkWebcamAvailability();
}

// Vérifier si la webcam est disponible
function checkWebcamAvailability() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // La webcam est probablement disponible, mais ne la demandons pas automatiquement
    // pour respecter la vie privée de l'utilisateur
    
    // Ajouter un bouton pour activer la webcam
    const webcamButton = document.createElement('button');
    webcamButton.className = 'webcam-button';
    webcamButton.textContent = 'Activer l\'effet miroir';
    
    webcamButton.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(10, 10, 10, 0.7);
      border: 1px solid #FFD700;
      color: #FFD700;
      padding: 10px 15px;
      border-radius: 5px;
      cursor: pointer;
      font-family: 'Playfair Display', serif;
      z-index: 10;
      transition: all 0.3s ease;
    `;
    
    webcamButton.addEventListener('mouseenter', () => {
      webcamButton.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
    });
    
    webcamButton.addEventListener('mouseleave', () => {
      webcamButton.style.backgroundColor = 'rgba(10, 10, 10, 0.7)';
    });
    
    webcamButton.addEventListener('click', () => {
      if (!mirrorEffect) {
        activateWebcamMirror();
      } else {
        deactivateWebcamMirror();
      }
    });
    
    portraitContainer.appendChild(webcamButton);
  }
}