/**
 * Module pour l'animation du logo (chapeau qui se transforme en cygne)
 */

// Initialisation de l'animation du logo
export function initLogoAnimation() {
  // Récupérer les éléments SVG
  const logoSvg = document.getElementById('logo-svg');
  const footerLogoSvg = document.getElementById('footer-logo');
  
  if (!logoSvg || !footerLogoSvg) return;
  
  // Définir le contenu SVG
  const svgContent = `
    <defs>
      <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFD700" />
        <stop offset="100%" stop-color="#DAA520" />
      </linearGradient>
    </defs>
    
    <!-- Chapeau de magicien -->
    <g class="hat">
      <path class="hat-base" d="M20 70 L80 70 L75 40 L25 40 Z" fill="url(#gold-gradient)" />
      <ellipse class="hat-top" cx="50" cy="40" rx="25" ry="10" fill="url(#gold-gradient)" />
      <path class="hat-band" d="M25 50 L75 50 L75 45 L25 45 Z" fill="#4B0082" />
    </g>
    
    <!-- Cygne (initialement caché) -->
    <g class="swan" opacity="0">
      <path class="swan-body" d="M30 55 Q50 35 70 55 L70 70 L30 70 Z" fill="url(#gold-gradient)" />
      <path class="swan-neck" d="M50 55 Q60 40 55 25 Q53 20 50 20" fill="none" stroke="url(#gold-gradient)" stroke-width="5" stroke-linecap="round" />
      <circle class="swan-head" cx="50" cy="20" r="5" fill="url(#gold-gradient)" />
      <path class="swan-beak" d="M50 18 L55 15 L50 16 Z" fill="#DAA520" />
    </g>
  `;
  
  // Insérer le contenu SVG
  logoSvg.innerHTML = svgContent;
  footerLogoSvg.innerHTML = svgContent;
  
  // Configurer l'animation du logo de l'en-tête avec GSAP
  const hatElements = logoSvg.querySelectorAll('.hat');
  const swanElements = logoSvg.querySelectorAll('.swan');
  
  setupLogoAnimation(logoSvg, hatElements, swanElements);
  
  // Configurer l'animation du logo du pied de page (activée au hover)
  footerLogoSvg.addEventListener('mouseenter', () => {
    const footerHatElements = footerLogoSvg.querySelectorAll('.hat');
    const footerSwanElements = footerLogoSvg.querySelectorAll('.swan');
    
    setupLogoAnimation(footerLogoSvg, footerHatElements, footerSwanElements);
  });
}

// Fonction pour configurer l'animation d'un logo
function setupLogoAnimation(logoElement, hatElements, swanElements) {
  // Timeline pour l'animation
  const tl = gsap.timeline({ 
    paused: logoElement.id === 'footer-logo', // Mettre en pause si c'est le footer logo
    defaults: { duration: 0.8, ease: 'power3.inOut' } 
  });
  
  // Animation de transformation
  tl.to(hatElements, { opacity: 0, scale: 0.8, y: -10 })
    .to(swanElements, { opacity: 1, scale: 1, y: 0 }, '-=0.4')
    .to(swanElements, { opacity: 0, scale: 0.8, y: -10, delay: 2 })
    .to(hatElements, { opacity: 1, scale: 1, y: 0 }, '-=0.4');
  
  // Jouer l'animation pour le logo de l'en-tête
  if (logoElement.id === 'logo-svg') {
    tl.play();
    
    // Répéter l'animation toutes les 10 secondes
    setInterval(() => {
      tl.restart();
    }, 10000);
  } else {
    // Pour le footer logo, l'animation se déclenche au hover
    logoElement.addEventListener('mouseenter', () => {
      tl.play(0);
    });
  }
}
