/**
 * Module pour la scène WebGL de la landing page avec effet parallax holographique
 */

// Variables globales pour la scène Three.js
let scene, camera, renderer, magician, cards = [];
let isInitialized = false;
let mouseX = 0, mouseY = 0;
let clock = new THREE.Clock();

// Initialisation de la scène WebGL pour la landing page
export function initLandingScene() {
  const canvas = document.getElementById('landing-canvas');
  if (!canvas) return;
  
  // Créer la scène Three.js
  scene = new THREE.Scene();
  
  // Créer la caméra
  const aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000);
  camera.position.z = 5;
  
  // Créer le renderer WebGL
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Ajouter des lumières
  addLights();
  
  // Charger les textures et modèles
  loadAssets().then(() => {
    // Créer le fond vidéo
    createVideoBackground();
    
    // Créer le magicien
    createMagician();
    
    // Créer les cartes animées
    createCards();
    
    // Gérer les événements
    addEventListeners();
    
    // Démarrer l'animation
    isInitialized = true;
    animate();
  });
}

// Ajouter des lumières à la scène
function addLights() {
  // Lumière ambiante
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  // Lumière directionnelle principale
  const mainLight = new THREE.DirectionalLight(0xffd700, 1);
  mainLight.position.set(10, 10, 10);
  scene.add(mainLight);
  
  // Lumière d'accentuation pourpre
  const purpleLight = new THREE.PointLight(0x4b0082, 1, 20);
  purpleLight.position.set(-5, 3, 2);
  scene.add(purpleLight);
}

// Charger les textures et modèles nécessaires
async function loadAssets() {
  return new Promise((resolve) => {
    // Simuler le chargement des assets (à remplacer par de vrais chargements)
    setTimeout(resolve, 500);
  });
}

// Créer un fond vidéo avec une vidéo 4K
function createVideoBackground() {
  // Créer un élément vidéo
  const video = document.createElement('video');
  video.src = 'assets/videos/magic-background.mp4';
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.autoplay = true;
  
  // Créer une texture vidéo
  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  
  // Créer un shader personnalisé pour l'effet holographique
  const vertexShader = `
    varying vec2 vUv;
    uniform float time;
    uniform float mouseX;
    uniform float mouseY;
    
    void main() {
      vUv = uv;
      
      // Effet de déplacement basé sur la position de la souris
      vec3 newPosition = position;
      newPosition.x += sin(position.y * 10.0 + time) * 0.02 * mouseX;
      newPosition.y += cos(position.x * 10.0 + time) * 0.02 * mouseY;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `;
  
  const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D tVideo;
    uniform float time;
    
    void main() {
      // Effet d'ondulation pour l'hologramme
      vec2 distortedUV = vUv;
      distortedUV.x += sin(vUv.y * 10.0 + time * 0.5) * 0.01;
      distortedUV.y += cos(vUv.x * 10.0 + time * 0.5) * 0.01;
      
      vec4 videoColor = texture2D(tVideo, distortedUV);
      
      // Ajouter un effet bleuté/holographique
      videoColor.r *= 0.9;
      videoColor.g *= 0.95;
      videoColor.b *= 1.1;
      
      // Ajouter des lignes de scan
      float scanLine = sin(vUv.y * 200.0) * 0.05 + 0.95;
      videoColor.rgb *= scanLine;
      
      gl_FragColor = videoColor;
    }
  `;
  
  // Créer le matériel avec le shader personnalisé
  const material = new THREE.ShaderMaterial({
    uniforms: {
      tVideo: { value: videoTexture },
      time: { value: 0 },
      mouseX: { value: 0 },
      mouseY: { value: 0 }
    },
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide
  });
  
  // Créer un plan pour afficher la vidéo
  const geometry = new THREE.PlaneGeometry(16, 9);
  const plane = new THREE.Mesh(geometry, material);
  
  // Ajuster l'échelle pour couvrir tout l'écran
  const scale = Math.max(window.innerWidth / window.innerHeight, 16 / 9) * 1.2;
  plane.scale.set(scale, scale / (16 / 9), 1);
  
  // Positionner le plan en arrière
  plane.position.z = -3;
  
  scene.add(plane);
  
  // Jouer la vidéo
  video.play().catch(error => {
    console.error('Erreur lors de la lecture de la vidéo :', error);
  });
}

// Créer le magicien
function createMagician() {
  // Créer un placeholder pour le magicien (à remplacer par un vrai modèle 3D)
  const geometry = new THREE.BoxGeometry(1, 2, 0.2);
  const material = new THREE.MeshStandardMaterial({
    color: 0x333333,
    transparent: true,
    opacity: 0
  });
  
  magician = new THREE.Mesh(geometry, material);
  magician.position.set(0, -1, 0);
  scene.add(magician);
}

// Créer les cartes qui semblent sortir de l'écran
function createCards() {
  const cardGeometry = new THREE.PlaneGeometry(0.5, 0.7);
  
  // Générer plusieurs cartes
  for (let i = 0; i < 5; i++) {
    // Matériel avec effet de déplacement
    const cardMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.7
    });
    
    // Ajouter un motif sur la carte
    const cardTexture = new THREE.TextureLoader().load('assets/textures/card-texture.jpg', (texture) => {
      cardMaterial.map = texture;
      cardMaterial.needsUpdate = true;
    });
    
    const card = new THREE.Mesh(cardGeometry, cardMaterial);
    
    // Positionner la carte initialement hors écran
    card.position.x = -1;
    card.position.y = -0.5;
    card.position.z = 4;
    
    // Rotation aléatoire
    card.rotation.z = Math.random() * Math.PI * 2;
    
    // Définir l'animation pour la carte
    const delay = i * 0.5; // Décaler le lancement des cartes
    
    gsap.to(card.position, {
      x: 3,
      y: 2,
      z: -2,
      duration: 2,
      delay,
      ease: 'power1.out',
      onComplete: () => {
        // Réinitialiser la position pour une animation en boucle
        gsap.set(card.position, { x: -1, y: -0.5, z: 4 });
        // Réappliquer l'animation après un délai
        setTimeout(() => {
          gsap.to(card.position, {
            x: 3,
            y: 2,
            z: -2,
            duration: 2,
            ease: 'power1.out'
          });
        }, 10000 - delay * 1000);
      }
    });
    
    // Faire tourner la carte
    gsap.to(card.rotation, {
      x: Math.PI * 4,
      y: Math.PI * 2,
      duration: 2,
      delay,
      ease: 'power1.out'
    });
    
    scene.add(card);
    cards.push(card);
  }
}

// Ajouter les écouteurs d'événements
function addEventListeners() {
  // Suivre la position de la souris pour l'effet parallaxe
  window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });
  
  // Gérer le redimensionnement de la fenêtre
  window.addEventListener('resize', () => {
    // Mettre à jour la caméra
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Mettre à jour le renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Fonction d'animation
function animate() {
  if (!isInitialized) return;
  
  requestAnimationFrame(animate);
  
  const deltaTime = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();
  
  // Mettre à jour les uniforms pour les shaders
  scene.traverse((object) => {
    if (object.material && object.material.uniforms) {
      if (object.material.uniforms.time) {
        object.material.uniforms.time.value = elapsedTime;
      }
      
      if (object.material.uniforms.mouseX) {
        object.material.uniforms.mouseX.value = mouseX;
      }
      
      if (object.material.uniforms.mouseY) {
        object.material.uniforms.mouseY.value = mouseY;
      }
    }
  });
  
  // Effet parallaxe sur la caméra
  camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
  camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
  
  // Faire tourner légèrement les cartes en continu
  cards.forEach(card => {
    card.rotation.x += deltaTime * 0.1;
    card.rotation.y += deltaTime * 0.15;
  });
  
  // Rendre la scène
  renderer.render(scene, camera);
}
