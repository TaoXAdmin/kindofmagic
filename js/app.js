// Importation des modules
import { initLandingScene } from './modules/landing.js';
import { initCarousel } from './modules/carousel.js';
import { initMagicRoom } from './modules/magic-room.js';
import { initBiography } from './modules/biography.js';
import { initContact } from './modules/contact.js';
import { initLogoAnimation } from './modules/logo.js';
import { initNavigation } from './modules/navigation.js';
import { initEasterEggs } from './modules/easter-eggs.js';

// Variables globales
const state = {
  isLoading: true,
  activeSection: null,
  isNavOpen: false,
  konami: { sequence: '', correctSequence: '38384040373937396665' },
  nightMode: false
};

// DOM Elements
const loader = document.querySelector('.loader');
const sections = document.querySelectorAll('section');
const header = document.querySelector('.header');
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__menu');

// Failsafe pour éviter un chargement infini
setTimeout(() => {
  if (loader && !loader.classList.contains('hidden')) {
    console.warn('Loading timeout reached, forcing display of content');
    hideLoader();
  }
}, 5000); // 5 secondes de timeout

// Fonction d'initialisation principale
function init() {
  // Chargement des assets avec une gestion des erreurs améliorée
  loadAssets().then(() => {
    try {
      // Initialiser les modules
      if (typeof initLogoAnimation === 'function') initLogoAnimation();
      if (typeof initNavigation === 'function') initNavigation();
      
      // Ces modules peuvent nécessiter des assets, les mettre dans des try/catch individuels
      try { if (typeof initLandingScene === 'function') initLandingScene(); } catch (e) { console.warn('Error initializing landing scene:', e); }
      try { if (typeof initCarousel === 'function') initCarousel(); } catch (e) { console.warn('Error initializing carousel:', e); }
      try { if (typeof initMagicRoom === 'function') initMagicRoom(); } catch (e) { console.warn('Error initializing magic room:', e); }
      try { if (typeof initBiography === 'function') initBiography(); } catch (e) { console.warn('Error initializing biography:', e); }
      try { if (typeof initContact === 'function') initContact(); } catch (e) { console.warn('Error initializing contact:', e); }
      try { if (typeof initEasterEggs === 'function') initEasterEggs(); } catch (e) { console.warn('Error initializing easter eggs:', e); }
      
      // Masquer le loader quoi qu'il arrive
      hideLoader();
      
      // Ajouter les écouteurs d'événements
      addEventListeners();
      
      // Initialiser l'intersection observer
      handleIntersection();
    } catch (error) {
      console.error('Error during initialization:', error);
      // Assurer que le loader est masqué même en cas d'erreur
      hideLoader();
    }
  }).catch(error => {
    console.error('Asset loading failed:', error);
    // Assurer que le loader est masqué même en cas d'erreur
    hideLoader();
  });
}

// Fonction de chargement des assets
async function loadAssets() {
  // Ajoutons une gestion des erreurs pour éviter le blocage en cas d'asset manquant
  try {
    const assets = [
      './assets/textures/velvet-texture.png',
      './assets/videos/magic-background.mp4',
      // Commentons cette ligne qui peut causer l'erreur
      // './assets/models/card.glb',
      './assets/icons/scroll-hand.svg',
      './assets/icons/crystal-ball.svg'
    ];
    
    const promises = assets.map(asset => {
      return new Promise((resolve) => {
        if (asset.endsWith('.mp4') || asset.endsWith('.webm')) {
          const video = document.createElement('video');
          video.addEventListener('canplaythrough', () => resolve(), { once: true });
          video.addEventListener('error', () => {
            console.warn(`Failed to load ${asset}, continuing anyway`);
            resolve(); // Résoudre même en cas d'erreur
          }, { once: true });
          video.src = asset;
          video.load();
        } else if (asset.endsWith('.png') || asset.endsWith('.jpg') || asset.endsWith('.svg')) {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => {
            console.warn(`Failed to load ${asset}, continuing anyway`);
            resolve(); // Résoudre même en cas d'erreur
          };
          img.src = asset;
        } else {
          fetch(asset)
            .then(response => {
              if (!response.ok) {
                console.warn(`Failed to load ${asset}, continuing anyway`);
              }
              resolve();
            })
            .catch(error => {
              console.warn(`Failed to load ${asset}: ${error.message}, continuing anyway`);
              resolve(); // Résoudre même en cas d'erreur
            });
        }
      });
    });
    
    return Promise.all(promises);
  } catch (error) {
    console.error("Error in asset loading, continuing anyway:", error);
    return Promise.resolve(); // Ne bloque pas l'initialisation en cas d'erreur
  }
}

// Fonction pour masquer le loader
function hideLoader() {
  if (!loader) return;
  
  loader.classList.add('hidden');
  state.isLoading = false;
  
  // Animation d'entrée pour le contenu initial
  if (typeof gsap !== 'undefined') {
    try {
      gsap.from('.landing__title', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
      
      gsap.from('.landing__subtitle', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
      });
      
      gsap.from('.landing__cta', {
        y: 20,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out'
      });
    } catch (e) {
      console.warn('Error in gsap animations:', e);
    }
  }
}

// Gestion du scroll et de l'intersection observer
function handleIntersection() {
  if (!sections || !sections.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        state.activeSection = entry.target.id;
        
        // Activer l'animation de la section
        entry.target.classList.add('active');
        
        // Mettre à jour la navigation
        document.querySelectorAll('.nav__menu a').forEach(link => {
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.3 });
  
  // Observer toutes les sections
  sections.forEach(section => {
    observer.observe(section);
  });
}

// Ajouter les écouteurs d'événements
function addEventListeners() {
  // Gestion du scroll pour le header
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    });
  }
  
  // Navigation mobile
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      state.isNavOpen = navMenu.classList.contains('active');
    });
    
    // Fermer la navigation au clic sur un lien
    document.querySelectorAll('.nav__menu a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        state.isNavOpen = false;
      });
    });
  }
  
  // Gestion du Konami Code
  document.addEventListener('keydown', (e) => {
    state.konami.sequence += e.keyCode;
    state.konami.sequence = state.konami.sequence.slice(-20);
    
    if (state.konami.sequence === state.konami.correctSequence) {
      activateEasterEgg();
    }
  });
  
  // Crystal Ball pour passer en mode nuit
  const crystalBall = document.getElementById('crystal-ball');
  if (crystalBall) {
    crystalBall.addEventListener('click', toggleNightMode);
  }
  
  // Reconnaissance vocale (si supportée par le navigateur)
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    setupVoiceRecognition();
  }
}

// Activer l'Easter Egg (mini-jeu)
function activateEasterEgg() {
  console.log('Easter Egg Activated!');
  // Afficher et initialiser le mini-jeu
  if (typeof initEasterEggs !== 'undefined' && typeof initEasterEggs.activateCardGame === 'function') {
    initEasterEggs.activateCardGame();
  }
}

// Basculer le mode nuit
function toggleNightMode() {
  state.nightMode = !state.nightMode;
  document.body.classList.toggle('night-mode', state.nightMode);
  
  const crystalBall = document.getElementById('crystal-ball');
  if (crystalBall) {
    if (state.nightMode) {
      crystalBall.classList.add('active');
      // Activer les étoiles et autres effets nocturnes
    } else {
      crystalBall.classList.remove('active');
      // Désactiver les effets nocturnes
    }
  }
}

// Configuration de la reconnaissance vocale
function setupVoiceRecognition() {
  try {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'fr-FR';
    
    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.trim().toLowerCase();
      
      if (command.includes('abracadabra')) {
        // Déclencher une animation spéciale
        triggerSpecialAnimation();
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };
    
    // Démarrer la reconnaissance vocale
    try {
      recognition.start();
    } catch (e) {
      console.error('Speech recognition failed to start', e);
    }
  } catch (e) {
    console.warn('Speech recognition not supported in this browser', e);
  }
}

// Déclencher une animation spéciale via la commande vocale
function triggerSpecialAnimation() {
  console.log('Special animation triggered by voice command!');
  // Cette fonction sera implémentée plus tard
  // Elle déclenchera une animation spectaculaire
}

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', init);
