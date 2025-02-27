/**
 * Module pour la navigation et transitions entre pages
 */

// Variables globales
let radialMenu;
let pageTransitionCanvas;
let ctx;
let wand;
let isRadialMenuVisible = false;

// Initialisation de la navigation
export function initNavigation() {
  // Créer le menu radial (caché au départ)
  createRadialMenu();
  
  // Créer le canvas pour les transitions
  createTransitionCanvas();
  
  // Ajouter les écouteurs d'événements
  setupNavigationListeners();
}

// Créer le menu radial contextuel
function createRadialMenu() {
  // Vérifier si le menu existe déjà
  if (document.getElementById('radial-menu')) return;
  
  // Créer l'élément du menu radial
  radialMenu = document.createElement('div');
  radialMenu.id = 'radial-menu';
  radialMenu.className = 'radial-menu';
  
  // Style CSS en ligne pour le menu radial
  radialMenu.style.cssText = `
    position: fixed;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(10, 10, 10, 0.8);
    transform: scale(0);
    opacity: 0;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 215, 0, 0.3);
    z-index: 9000;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
  `;
  
  // Créer les éléments du menu
  const menuItems = [
    { name: 'Accueil', icon: 'home', href: '#accueil' },
    { name: 'Prestations', icon: 'magic', href: '#prestations' },
    { name: 'Magic Room', icon: 'room', href: '#magic-room' },
    { name: 'Biographie', icon: 'bio', href: '#biographie' },
    { name: 'Contact', icon: 'contact', href: '#contact' }
  ];
  
  // Ajouter les items au menu
  menuItems.forEach((item, index) => {
    const angle = (index / menuItems.length) * Math.PI * 2 - Math.PI / 2;
    const radius = 70;
    
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    const menuItem = document.createElement('a');
    menuItem.href = item.href;
    menuItem.className = 'radial-menu__item';
    menuItem.dataset.name = item.name;
    
    menuItem.style.cssText = `
      position: absolute;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #0a0a0a;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: translate(${x}px, ${y}px) scale(0);
      opacity: 0;
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s, opacity 0.3s ease 0.1s;
      border: 1px solid rgba(255, 215, 0, 0.8);
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
      color: #FFD700;
      text-decoration: none;
      font-family: 'Playfair Display', serif;
      background-image: url('../assets/icons/${item.icon}.svg');
      background-size: 60%;
      background-position: center;
      background-repeat: no-repeat;
    `;
    
    menuItem.addEventListener('click', (e) => {
      e.preventDefault();
      hideRadialMenu();
      
      // Déclencher la transition de page
      triggerPageTransition(item.href);
    });
    
    // Créer le tooltip
    const tooltip = document.createElement('span');
    tooltip.className = 'radial-menu__tooltip';
    tooltip.textContent = item.name;
    
    tooltip.style.cssText = `
      position: absolute;
      top: -25px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(10, 10, 10, 0.8);
      color: #FFD700;
      padding: 3px 8px;
      border-radius: 3px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
    `;
    
    menuItem.appendChild(tooltip);
    
    // Afficher/masquer le tooltip au survol
    menuItem.addEventListener('mouseenter', () => {
      tooltip.style.opacity = '1';
    });
    
    menuItem.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
    
    radialMenu.appendChild(menuItem);
  });
  
  // Créer l'icône centrale
  const centerIcon = document.createElement('div');
  centerIcon.className = 'radial-menu__center';
  
  centerIcon.style.cssText = `
    position: absolute;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #FFD700;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
    background-image: url('../assets/icons/menu.svg');
    background-size: 60%;
    background-position: center;
    background-repeat: no-repeat;
  `;
  
  radialMenu.appendChild(centerIcon);
  
  // Ajouter le menu au DOM
  document.body.appendChild(radialMenu);
}

// Créer le canvas pour les transitions entre pages
function createTransitionCanvas() {
  // Vérifier si le canvas existe déjà
  if (document.getElementById('transition-canvas')) return;
  
  // Créer l'élément canvas
  pageTransitionCanvas = document.createElement('canvas');
  pageTransitionCanvas.id = 'transition-canvas';
  pageTransitionCanvas.className = 'page-transition-canvas';
  
  // Style CSS en ligne pour le canvas
  pageTransitionCanvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  
  // Ajouter le canvas au DOM
  document.body.appendChild(pageTransitionCanvas);
  
  // Configurer le contexte 2D
  ctx = pageTransitionCanvas.getContext('2d');
  
  // Redimensionner le canvas à la taille de la fenêtre
  resizeCanvas();
  
  // Créer une baguette magique pour l'animation
  wand = {
    x: 0,
    y: 0,
    angle: 0,
    length: 50,
    tipX: 0,
    tipY: 0,
    particles: [],
    trail: []
  };
  
  // Gérer le redimensionnement de la fenêtre
  window.addEventListener('resize', resizeCanvas);
}

// Redimensionner le canvas à la taille de la fenêtre
function resizeCanvas() {
  if (!pageTransitionCanvas) return;
  
  pageTransitionCanvas.width = window.innerWidth;
  pageTransitionCanvas.height = window.innerHeight;
}

// Configurer les écouteurs d'événements pour la navigation
function setupNavigationListeners() {
  // Afficher le menu radial au scroll
  let lastScrollTop = 0;
  let scrollTimeout;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Détecter la direction du scroll
    if (Math.abs(scrollTop - lastScrollTop) > 30) {
      if (scrollTop > lastScrollTop) {
        // Scroll vers le bas
        if (!isRadialMenuVisible) {
          showRadialMenu();
        }
      }
      
      lastScrollTop = scrollTop;
      
      // Masquer le menu après un délai
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        hideRadialMenu();
      }, 2000);
    }
  });
  
  // Ajouter des écouteurs pour les liens de navigation
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      // Ne pas interférer avec les liens du menu radial
      if (!link.closest('.radial-menu')) {
        e.preventDefault();
        
        // Récupérer la cible du lien
        const targetId = link.getAttribute('href');
        
        // Déclencher la transition de page
        triggerPageTransition(targetId);
      }
    });
  });
}

// Afficher le menu radial
function showRadialMenu() {
  if (!radialMenu || isRadialMenuVisible) return;
  
  // Positionner le menu au centre de l'écran
  radialMenu.style.left = `${window.innerWidth / 2 - 100}px`;
  radialMenu.style.top = `${window.innerHeight / 2 - 100}px`;
  
  // Afficher le menu
  radialMenu.style.transform = 'scale(1)';
  radialMenu.style.opacity = '1';
  radialMenu.style.pointerEvents = 'auto';
  
  // Animer les éléments du menu
  const items = radialMenu.querySelectorAll('.radial-menu__item');
  items.forEach((item, index) => {
    setTimeout(() => {
      item.style.transform = item.style.transform.replace('scale(0)', 'scale(1)');
      item.style.opacity = '1';
    }, 50 * index);
  });
  
  isRadialMenuVisible = true;
}

// Masquer le menu radial
function hideRadialMenu() {
  if (!radialMenu || !isRadialMenuVisible) return;
  
  // Masquer le menu
  radialMenu.style.transform = 'scale(0)';
  radialMenu.style.opacity = '0';
  radialMenu.style.pointerEvents = 'none';
  
  // Masquer les éléments du menu
  const items = radialMenu.querySelectorAll('.radial-menu__item');
  items.forEach(item => {
    item.style.transform = item.style.transform.replace('scale(1)', 'scale(0)');
    item.style.opacity = '0';
  });
  
  isRadialMenuVisible = false;
}

// Déclencher la transition de page "coup de baguette magique"
function triggerPageTransition(targetId) {
  // S'assurer que le canvas est visible
  pageTransitionCanvas.style.opacity = '1';
  
  // Initialiser la position de la baguette
  wand.x = 0;
  wand.y = window.innerHeight / 2;
  wand.angle = 0;
  wand.trail = [];
  wand.particles = [];
  
  // Animation de la baguette avec GSAP
  const tl = gsap.timeline({
    onComplete: () => {
      // Effectuer le scroll vers la cible
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'auto' // Instant pour éviter les conflits avec l'animation
        });
      }
      
      // Masquer le canvas après la transition
      setTimeout(() => {
        pageTransitionCanvas.style.opacity = '0';
        // Vider le canvas
        ctx.clearRect(0, 0, pageTransitionCanvas.width, pageTransitionCanvas.height);
      }, 500);
    }
  });
  
  // Animation du mouvement de la baguette
  tl.to(wand, {
    x: window.innerWidth + 100,
    duration: 1.5,
    ease: 'power1.inOut',
    onUpdate: drawWandEffect
  });
}

// Dessiner l'effet de baguette magique
function drawWandEffect() {
  if (!ctx) return;
  
  // Effacer le canvas
  ctx.clearRect(0, 0, pageTransitionCanvas.width, pageTransitionCanvas.height);
  
  // Calculer la position de la pointe de la baguette
  const progress = wand.x / (window.innerWidth + 100);
  wand.angle = Math.sin(progress * Math.PI * 3) * 0.2;
  
  wand.tipX = wand.x + Math.cos(wand.angle) * wand.length;
  wand.tipY = wand.y + Math.sin(wand.angle) * wand.length;
  
  // Ajouter la position actuelle à la trace
  wand.trail.push({ x: wand.tipX, y: wand.tipY });
  
  // Limiter la longueur de la trace
  if (wand.trail.length > 20) {
    wand.trail.shift();
  }
  
  // Dessiner la trace de la baguette
  ctx.beginPath();
  ctx.moveTo(wand.trail[0].x, wand.trail[0].y);
  
  for (let i = 1; i < wand.trail.length; i++) {
    ctx.lineTo(wand.trail[i].x, wand.trail[i].y);
  }
  
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Ajouter des particules
  if (Math.random() < 0.4) {
    wand.particles.push({
      x: wand.tipX,
      y: wand.tipY,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      size: Math.random() * 3 + 1,
      life: 1,
      color: Math.random() < 0.5 ? '#FFD700' : '#FFFFFF'
    });
  }
  
  // Mettre à jour et dessiner les particules
  wand.particles.forEach((particle, index) => {
    // Mettre à jour la position
    particle.x += particle.vx;
    particle.y += particle.vy;
    
    // Réduire la durée de vie
    particle.life -= 0.02;
    
    // Dessiner la particule
    if (particle.life > 0) {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.life;
      ctx.fill();
      ctx.globalAlpha = 1;
    } else {
      // Supprimer les particules mortes
      wand.particles.splice(index, 1);
    }
  });
  
  // Dessiner l'effet flash à travers l'écran
  const flashProgress = Math.max(0, (wand.x - 100) / window.innerWidth);
  
  if (flashProgress > 0) {
    const gradient = ctx.createLinearGradient(
      wand.x - 100, 0,
      wand.x + 100, 0
    );
    
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0)');
    gradient.addColorStop(0.5, `rgba(255, 215, 0, ${0.7 * (1 - flashProgress)})`);
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, pageTransitionCanvas.width, pageTransitionCanvas.height);
  }
}