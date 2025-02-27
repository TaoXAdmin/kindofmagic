/**
 * Module pour les easter eggs et fonctionnalités cachées
 */

// Variables globales
let miniGame = null;
let nightMode = false;
let voiceRecognition = null;

// Initialisation des easter eggs
export function initEasterEggs() {
  // Écouter les événements du Konami Code
  // Déjà géré dans app.js avec la séquence: ↑↑↓↓←→←→BA (38384040373937396665)
  
  // Configurer le mode "Nuit Étoilée"
  setupNightMode();
  
  // Configurer la reconnaissance vocale si disponible
  setupVoiceRecognition();
}

// Configurer le mode "Nuit Étoilée"
function setupNightMode() {
  const crystalBall = document.getElementById('crystal-ball');
  if (!crystalBall) return;
  
  // Ajouter un gestionnaire d'événements au clic
  crystalBall.addEventListener('click', toggleNightMode);
  
  // Créer les styles pour le mode nuit
  createNightModeStyles();
}

// Créer les styles CSS pour le mode nuit
function createNightModeStyles() {
  const style = document.createElement('style');
  style.id = 'night-mode-styles';
  
  style.textContent = `
    body.night-mode {
      background-color: #000000;
    }
    
    body.night-mode::before {
      opacity: 0.02;
    }
    
    body.night-mode .star {
      position: fixed;
      width: 2px;
      height: 2px;
      background-color: #FFFFFF;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      animation: twinkle 5s infinite alternate;
    }
    
    @keyframes twinkle {
      0% { opacity: 0; }
      50% { opacity: 1; }
      100% { opacity: 0; }
    }
    
    #crystal-ball.active {
      filter: drop-shadow(0 0 10px #4B0082);
      animation: pulse 2s infinite alternate;
    }
    
    @keyframes pulse {
      0% { filter: drop-shadow(0 0 10px #4B0082); }
      100% { filter: drop-shadow(0 0 20px #4B0082); }
    }
  `;
  
  document.head.appendChild(style);
}

// Basculer le mode "Nuit Étoilée"
function toggleNightMode() {
  nightMode = !nightMode;
  
  // Appliquer la classe au body
  document.body.classList.toggle('night-mode', nightMode);
  
  // Activer/désactiver l'animation de la boule de cristal
  const crystalBall = document.getElementById('crystal-ball');
  if (crystalBall) {
    crystalBall.classList.toggle('active', nightMode);
  }
  
  if (nightMode) {
    // Ajouter des étoiles
    createStars();
    
    // Afficher une notification
    showNotification('Mode "Nuit Étoilée" activé', 'info');
  } else {
    // Supprimer les étoiles
    removeStars();
    
    // Afficher une notification
    showNotification('Mode "Nuit Étoilée" désactivé', 'info');
  }
}

// Créer des étoiles dans le ciel nocturne
function createStars() {
  // Supprimer les étoiles existantes
  removeStars();
  
  // Créer de nouvelles étoiles
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Position aléatoire
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    
    // Taille aléatoire
    const size = Math.random() * 3 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    // Délai d'animation aléatoire
    star.style.animationDelay = `${Math.random() * 5}s`;
    
    // Ajouter l'étoile au document
    document.body.appendChild(star);
  }
}

// Supprimer les étoiles
function removeStars() {
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => {
    if (star.parentNode) {
      document.body.removeChild(star);
    }
  });
}

// Configurer la reconnaissance vocale
function setupVoiceRecognition() {
  // Vérifier si la reconnaissance vocale est disponible
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  voiceRecognition = new SpeechRecognition();
  
  // Configurer la reconnaissance vocale
  voiceRecognition.continuous = true;
  voiceRecognition.interimResults = false;
  voiceRecognition.lang = 'fr-FR';
  
  // Ajouter l'écouteur d'événements pour les résultats
  voiceRecognition.onresult = handleVoiceCommand;
  
  // Gérer les erreurs
  voiceRecognition.onerror = (event) => {
    console.error('Erreur de reconnaissance vocale:', event.error);
  };
  
  // Redémarrer automatiquement
  voiceRecognition.onend = () => {
    if (nightMode) {
      voiceRecognition.start();
    }
  };
  
  // Démarrer la reconnaissance vocale
  try {
    voiceRecognition.start();
  } catch (error) {
    console.error('Erreur au démarrage de la reconnaissance vocale:', error);
  }
}

// Gérer les commandes vocales
function handleVoiceCommand(event) {
  const last = event.results.length - 1;
  const command = event.results[last][0].transcript.trim().toLowerCase();
  
  // Rechercher la commande "abracadabra"
  if (command.includes('abracadabra')) {
    triggerSpecialAnimation();
  }
}

// Déclencher une animation spéciale
function triggerSpecialAnimation() {
  // Créer un conteneur pour l'animation
  const animationContainer = document.createElement('div');
  animationContainer.className = 'special-animation';
  
  animationContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
  `;
  
  document.body.appendChild(animationContainer);
  
  // Afficher l'animation
  setTimeout(() => {
    animationContainer.style.opacity = '1';
  }, 10);
  
  // Créer l'effet d'explosion magique
  createMagicExplosion(animationContainer);
  
  // Masquer l'animation après un délai
  setTimeout(() => {
    animationContainer.style.opacity = '0';
    
    // Supprimer l'élément après la transition
    setTimeout(() => {
      if (animationContainer.parentNode) {
        document.body.removeChild(animationContainer);
      }
    }, 500);
  }, 5000);
}