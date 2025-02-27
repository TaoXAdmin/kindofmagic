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

// Fonction d'initialisation principale
function init() {
  // Chargement des assets
  loadAssets().then(() => {
    // Initialiser les modules
    initLogoAnimation();
    initNavigation();
    initLandingScene();
    initCarousel();
    initMagicRoom();
    initBiography();
    initContact();
    initEasterEggs();
    
    // Masquer le loader
    hideLoader();
    
    // Ajouter les écouteurs d'événements
    addEventListeners();
    
    // Initialiser l'intersection observer
    handleIntersection();
  });
}

// Fonction de chargement des assets
async function loadAssets() {
  const assets = [
    './assets/textures/velvet-texture.png',
    './assets/videos/magic-background.mp4',
    './assets/models/card.glb',
    './assets/icons/scroll-hand.svg',
    './assets/icons/crystal-ball.svg'
    // Ajouter d'autres assets à précharger
  ];
  
  const promises = assets.map(asset => {
    return new Promise((resolve, reject) => {
      if (asset.endsWith('.mp4') || asset.endsWith('.webm')) {
        const video = document.createElement('video');
        video.addEventListener('canplaythrough', () => resolve(), { once: true });
        video.addEventListener('error', () => reject(new Error(`Failed to load ${asset}`)), { once: true });
        video.src = asset;
        video.load();
      } else if (asset.endsWith('.png') || asset.endsWith('.jpg') || asset.endsWith('.svg')) {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load ${asset}`));
        img.src = asset;
      } else {
        fetch(asset)
          .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${asset}`);
            resolve();
          })
          .catch(reject);
      }
    });
  });
  
  return Promise.all(promises);
}

// Fonction pour masquer le loader
function hideLoader() {
  loader.classList.add('hidden');
  state.isLoading = false;
  
  // Animation d'entrée pour le contenu initial
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
}

// Gestion du scroll et de l'intersection observer
function handleIntersection() {
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
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  });
  
  // Navigation mobile
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
  
  // Gestion du Konami Code
  document.addEventListener('keydown', (e) => {
    state.konami.sequence += e.keyCode;
    state.konami.sequence = state.konami.sequence.slice(-20);
    
    if (state.konami.sequence === state.konami.correctSequence) {
      activateEasterEgg();
    }
  });
  
  // Crystal Ball pour passer en mode nuit
  document.getElementById('crystal-ball').addEventListener('click', toggleNightMode);
  
  // Reconnaissance vocale (si supportée par le navigateur)
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    setupVoiceRecognition();
  }
}

// Activer l'Easter Egg (mini-jeu)
function activateEasterEgg() {
  console.log('Easter Egg Activated!');
  // Afficher et initialiser le mini-jeu
  // Cette fonction sera implémentée dans le module easter-eggs.js
}

// Basculer le mode nuit
function toggleNightMode() {
  state.nightMode = !state.nightMode;
  document.body.classList.toggle('night-mode', state.nightMode);
  
  const crystalBall = document.getElementById('crystal-ball');
  if (state.nightMode) {
    crystalBall.classList.add('active');
    // Activer les étoiles et autres effets nocturnes
  } else {
    crystalBall.classList.remove('active');
    // Désactiver les effets nocturnes
  }
}

// Configuration de la reconnaissance vocale
function setupVoiceRecognition() {
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
}

// Déclencher une animation spéciale via la commande vocale
function triggerSpecialAnimation() {
  console.log('Special animation triggered by voice command!');
  // Cette fonction sera implémentée plus tard
  // Elle déclenchera une animation spectaculaire
}

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', init);
