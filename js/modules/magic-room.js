/**
 * Module pour l'expérience "Magic Room" - un environnement 3D interactif
 */

// Variables globales
let scene, camera, renderer, controls;
let room = {
  objects: [],
  lights: [],
  raycaster: null,
  mouse: null,
  keys: {
    forward: false,
    backward: false,
    left: false,
    right: false
  },
  player: {
    speed: 0.15,
    height: 1.7
  },
  isActive: false,
  spotlight: null
};

let clock = new THREE.Clock();
let canvasContainer;
let canvas;

// Initialisation de la Magic Room
export function initMagicRoom() {
  canvasContainer = document.getElementById('magic-room-canvas-container');
  canvas = document.getElementById('magic-room-canvas');
  
  if (!canvasContainer || !canvas) return;
  
  // Initialiser la magic room seulement lorsqu'elle est visible
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !room.isActive) {
      setupMagicRoom();
      room.isActive = true;
    }
  }, { threshold: 0.1 });
  
  observer.observe(canvasContainer);
}

// Configuration de la Magic Room
function setupMagicRoom() {
  // Créer la scène Three.js
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a);
  scene.fog = new THREE.FogExp2(0x0a0a0a, 0.05);
  
  // Créer la caméra
  const aspectRatio = canvasContainer.clientWidth / canvasContainer.clientHeight;
  camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 30);
  camera.position.set(0, room.player.height, 5);
  
  // Créer le renderer WebGL
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });
  renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
  // Configurer le raycaster pour l'interaction
  room.raycaster = new THREE.Raycaster();
  room.mouse = new THREE.Vector2();
  
  // Créer les contrôles de la caméra (mode FPS)
  setupControls();
  
  // Ajouter les lumières
  addLights();
  
  // Créer le salon victorien
  createVictorianRoom();
  
  // Ajouter les objets interactifs
  addInteractiveObjects();
  
  // Ajouter les écouteurs d'événements
  addEventListeners();
  
  // Démarrer l'animation
  animate();
}

// Configuration des contrôles de la caméra
function setupControls() {
  // Utiliser PointerLockControls pour un contrôle FPS
  controls = new THREE.PointerLockControls(camera, renderer.domElement);
  
  // Activer les contrôles au clic sur le canvas
  canvas.addEventListener('click', () => {
    if (!controls.isLocked) {
      controls.lock();
    }
  });
  
  // Ajouter des instructions lorsque les contrôles sont verrouillés/déverrouillés
  controls.addEventListener('lock', () => {
    // Cacher les instructions
    const instructions = document.querySelector('.controls__instructions');
    if (instructions) instructions.style.display = 'none';
  });
  
  controls.addEventListener('unlock', () => {
    // Afficher les instructions
    const instructions = document.querySelector('.controls__instructions');
    if (instructions) instructions.style.display = 'block';
  });
}

// Ajouter des lumières à la scène
function addLights() {
  // Lumière ambiante
  const ambientLight = new THREE.AmbientLight(0x333333, 1);
  scene.add(ambientLight);
  
  // Lumière principale (lustre)
  const chandelierLight = new THREE.PointLight(0xff9000, 1, 10);
  chandelierLight.position.set(0, 3, 0);
  chandelierLight.castShadow = true;
  chandelierLight.shadow.mapSize.width = 1024;
  chandelierLight.shadow.mapSize.height = 1024;
  scene.add(chandelierLight);
  
  // Ajouter une géométrie visible pour le lustre
  const chandelierGeometry = new THREE.CylinderGeometry(0.3, 0.2, 0.5, 8);
  const chandelierMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffd700,
    metalness: 0.9,
    roughness: 0.1
  });
  const chandelier = new THREE.Mesh(chandelierGeometry, chandelierMaterial);
  chandelier.position.copy(chandelierLight.position);
  scene.add(chandelier);
  
  // Ajouter des bougies
  const candlePositions = [
    { x: 3, y: 0.8, z: -2 },
    { x: -3, y: 0.8, z: -2 },
    { x: 0, y: 0.8, z: -3 }
  ];
  
  candlePositions.forEach(pos => {
    // Lumière de bougie
    const candleLight = new THREE.PointLight(0xff6000, 0.7, 5);
    candleLight.position.set(pos.x, pos.y + 0.2, pos.z);
    candleLight.castShadow = true;
    scene.add(candleLight);
    
    // Ajouter une flamme animée
    const flameMaterial = new THREE.SpriteMaterial({
      map: new THREE.TextureLoader().load('assets/textures/flame.png'),
      color: 0xffaa00,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    
    const flame = new THREE.Sprite(flameMaterial);
    flame.position.set(pos.x, pos.y + 0.3, pos.z);
    flame.scale.set(0.2, 0.3, 1);
    flame.userData = { type: 'flame', originalScale: { ...flame.scale } };
    scene.add(flame);
    room.objects.push(flame);
  });
  
  // Spotlight qui suit la souris
  room.spotlight = new THREE.SpotLight(0xffffff, 0.8, 10, Math.PI / 8, 0.5, 2);
  room.spotlight.position.set(0, room.player.height, 0);
  room.spotlight.castShadow = true;
  scene.add(room.spotlight);
  
  // Ajouter un helper pour le target du spotlight (invisible)
  room.spotlightTarget = new THREE.Object3D();
  room.spotlightTarget.position.set(0, room.player.height, -1);
  scene.add(room.spotlightTarget);
  room.spotlight.target = room.spotlightTarget;
}

// Créer le salon victorien
function createVictorianRoom() {
  // Créer le sol
  const floorTexture = new THREE.TextureLoader().load('assets/textures/wooden-floor.jpg');
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(4, 4);
  
  const floorGeometry = new THREE.PlaneGeometry(10, 10);
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorTexture,
    roughness: 0.8,
    metalness: 0
  });
  
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  scene.add(floor);
  
  // Créer les murs
  const wallTexture = new THREE.TextureLoader().load('assets/textures/victorian-wallpaper.jpg');
  wallTexture.wrapS = THREE.RepeatWrapping;
  wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(2, 1);
  
  const wallMaterial = new THREE.MeshStandardMaterial({
    map: wallTexture,
    roughness: 0.9,
    metalness: 0
  });
  
  // Mur arrière
  const backWallGeometry = new THREE.PlaneGeometry(10, 5);
  const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
  backWall.position.set(0, 2.5, -5);
  backWall.receiveShadow = true;
  scene.add(backWall);
  
  // Mur gauche
  const leftWallGeometry = new THREE.PlaneGeometry(10, 5);
  const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
  leftWall.position.set(-5, 2.5, 0);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.receiveShadow = true;
  scene.add(leftWall);
  
  // Mur droit
  const rightWallGeometry = new THREE.PlaneGeometry(10, 5);
  const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
  rightWall.position.set(5, 2.5, 0);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.receiveShadow = true;
  scene.add(rightWall);
  
  // Plafond
  const ceilingGeometry = new THREE.PlaneGeometry(10, 10);
  const ceilingMaterial = new THREE.MeshStandardMaterial({
    color: 0x5c5c5c,
    roughness: 0.9,
    metalness: 0
  });
  
  const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  ceiling.position.y = 5;
  ceiling.rotation.x = Math.PI / 2;
  ceiling.receiveShadow = true;
  scene.add(ceiling);
  
  // Ajouter un tapis
  const carpetGeometry = new THREE.CircleGeometry(3, 32);
  const carpetMaterial = new THREE.MeshStandardMaterial({
    color: 0x800020, // Burgundy
    roughness: 0.9,
    metalness: 0
  });
  
  const carpet = new THREE.Mesh(carpetGeometry, carpetMaterial);
  carpet.rotation.x = -Math.PI / 2;
  carpet.position.y = 0.01; // Légèrement au-dessus du sol
  carpet.receiveShadow = true;
  scene.add(carpet);
  
  // Ajouter des détails victoriens (cadres, miroirs, etc.)
  addRoomDetails();
}

// Ajouter des détails au salon victorien
function addRoomDetails() {
  // Ajouter un grand miroir
  const mirrorGeometry = new THREE.PlaneGeometry(2, 3);
  const mirrorMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.9,
    roughness: 0.1,
    envMap: new THREE.CubeTextureLoader().load([
      'assets/textures/envmap/px.jpg',
      'assets/textures/envmap/nx.jpg',
      'assets/textures/envmap/py.jpg',
      'assets/textures/envmap/ny.jpg',
      'assets/textures/envmap/pz.jpg',
      'assets/textures/envmap/nz.jpg'
    ])
  });
  
  const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
  mirror.position.set(0, 2.5, -4.9);
  scene.add(mirror);
  
  // Ajouter un cadre au miroir
  const mirrorFrameGeometry = new THREE.BoxGeometry(2.2, 3.2, 0.1);
  const mirrorFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700, // Or
    metalness: 0.8,
    roughness: 0.2
  });
  
  const mirrorFrame = new THREE.Mesh(mirrorFrameGeometry, mirrorFrameMaterial);
  mirrorFrame.position.set(0, 2.5, -4.95);
  scene.add(mirrorFrame);
  
  // Ajouter une table
  const tableGeometry = new THREE.CylinderGeometry(1, 0.8, 0.8, 16);
  const tableMaterial = new THREE.MeshStandardMaterial({
    color: 0x5c3a21, // Bois foncé
    roughness: 0.8,
    metalness: 0
  });
  
  const table = new THREE.Mesh(tableGeometry, tableMaterial);
  table.position.set(0, 0.4, 0);
  table.castShadow = true;
  table.receiveShadow = true;
  scene.add(table);
  
  // Ajouter des livres sur la table
  const bookColors = [0x800020, 0x2d4e6b, 0x1e3b16, 0x5f4b33];
  
  for (let i = 0; i < 5; i++) {
    const width = 0.3 + Math.random() * 0.2;
    const height = 0.05 + Math.random() * 0.05;
    const depth = 0.4 + Math.random() * 0.1;
    
    const bookGeometry = new THREE.BoxGeometry(width, height, depth);
    const bookMaterial = new THREE.MeshStandardMaterial({
      color: bookColors[Math.floor(Math.random() * bookColors.length)],
      roughness: 0.9,
      metalness: 0
    });
    
    const book = new THREE.Mesh(bookGeometry, bookMaterial);
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.5;
    
    book.position.set(
      Math.cos(angle) * radius,
      0.8 + i * height,
      Math.sin(angle) * radius
    );
    
    book.rotation.y = Math.random() * Math.PI * 2;
    book.castShadow = true;
    scene.add(book);
  }
  
  // Ajouter des fauteuils victoriens
  addVictorianChair(-3, 0, 2, Math.PI / 4);
  addVictorianChair(3, 0, 2, -Math.PI / 4);
}

// Ajouter un fauteuil victorien
function addVictorianChair(x, y, z, rotation) {
  // Créer le groupe pour le fauteuil
  const chairGroup = new THREE.Group();
  chairGroup.position.set(x, y, z);
  chairGroup.rotation.y = rotation;
  
  // Base du fauteuil
  const baseGeometry = new THREE.BoxGeometry(1.2, 0.5, 1.2);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x5c3a21, // Bois foncé
    roughness: 0.8,
    metalness: 0
  });
  
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = 0.25;
  base.castShadow = true;
  chairGroup.add(base);
  
  // Coussin
  const cushionGeometry = new THREE.BoxGeometry(1, 0.1, 1);
  const cushionMaterial = new THREE.MeshStandardMaterial({
    color: 0x800020, // Burgundy
    roughness: 0.9,
    metalness: 0
  });
  
  const cushion = new THREE.Mesh(cushionGeometry, cushionMaterial);
  cushion.position.y = 0.55;
  cushion.castShadow = true;
  chairGroup.add(cushion);
  
  // Dossier
  const backrestGeometry = new THREE.BoxGeometry(1.2, 1.5, 0.2);
  const backrest = new THREE.Mesh(backrestGeometry, baseMaterial);
  backrest.position.set(0, 1.25, -0.5);
  backrest.castShadow = true;
  chairGroup.add(backrest);
  
  // Coussin du dossier
  const backCushionGeometry = new THREE.BoxGeometry(1, 1.3, 0.1);
  const backCushion = new THREE.Mesh(backCushionGeometry, cushionMaterial);
  backCushion.position.set(0, 1.25, -0.4);
  backCushion.castShadow = true;
  chairGroup.add(backCushion);
  
  // Accoudoirs
  const armGeometry = new THREE.BoxGeometry(0.1, 0.5, 1);
  
  const leftArm = new THREE.Mesh(armGeometry, baseMaterial);
  leftArm.position.set(-0.55, 0.75, 0);
  leftArm.castShadow = true;
  chairGroup.add(leftArm);
  
  const rightArm = new THREE.Mesh(armGeometry, baseMaterial);
  rightArm.position.set(0.55, 0.75, 0);
  rightArm.castShadow = true;
  chairGroup.add(rightArm);
  
  // Pieds du fauteuil
  const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8);
  
  const positions = [
    [-0.5, -0.15, 0.5], // avant gauche
    [0.5, -0.15, 0.5],  // avant droit
    [-0.5, -0.15, -0.5], // arrière gauche
    [0.5, -0.15, -0.5]   // arrière droit
  ];
  
  positions.forEach(pos => {
    const leg = new THREE.Mesh(legGeometry, baseMaterial);
    leg.position.set(...pos);
    leg.castShadow = true;
    chairGroup.add(leg);
  });
  
  scene.add(chairGroup);
}

// Ajouter des objets interactifs à la scène
function addInteractiveObjects() {
  // Sphère de cristal
  const crystalBallGeometry = new THREE.SphereGeometry(0.2, 32, 32);
  const crystalBallMaterial = new THREE.MeshStandardMaterial({
    color: 0xb0e0e6, // Bleu clair
    transparent: true,
    opacity: 0.7,
    roughness: 0,
    metalness: 0.2,
    envMap: new THREE.CubeTextureLoader().load([
      'assets/textures/envmap/px.jpg',
      'assets/textures/envmap/nx.jpg',
      'assets/textures/envmap/py.jpg',
      'assets/textures/envmap/ny.jpg',
      'assets/textures/envmap/pz.jpg',
      'assets/textures/envmap/nz.jpg'
    ])
  });
  
  const crystalBall = new THREE.Mesh(crystalBallGeometry, crystalBallMaterial);
  crystalBall.position.set(0, 0.95, 0);
  crystalBall.castShadow = true;
  crystalBall.userData = { 
    type: 'interactive', 
    name: 'Crystal Ball',
    description: 'Une sphère de cristal mystique révélant les secrets du magicien.',
    action: 'reveal-secret'
  };
  scene.add(crystalBall);
  room.objects.push(crystalBall);
  
  // Support de la sphère
  const standGeometry = new THREE.CylinderGeometry(0.05, 0.1, 0.05, 16);
  const standMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700, // Or
    roughness: 0.2,
    metalness: 0.8
  });
  
  const stand = new THREE.Mesh(standGeometry, standMaterial);
  stand.position.set(0, 0.825, 0);
  stand.castShadow = true;
  scene.add(stand);
  
  // Cartes de tarot
  const cardPositions = [
    { x: 0.6, y: 0.82, z: 0.3, ry: Math.PI / 6 },
    { x: -0.5, y: 0.82, z: -0.2, ry: -Math.PI / 3 },
    { x: 0.2, y: 0.82, z: -0.5, ry: Math.PI / 2 }
  ];
  
  cardPositions.forEach((pos, index) => {
    const cardGeometry = new THREE.PlaneGeometry(0.2, 0.3);
    const cardMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f5dc, // Beige
      roughness: 0.7,
      metalness: 0,
      side: THREE.DoubleSide
    });
    
    const card = new THREE.Mesh(cardGeometry, cardMaterial);
    card.position.set(pos.x, pos.y, pos.z);
    card.rotation.set(-Math.PI / 2, 0, pos.ry);
    card.castShadow = true;
    card.userData = { 
      type: 'interactive', 
      name: `Tarot Card ${index + 1}`,
      description: 'Une carte de tarot ancienne contenant une prédiction.',
      action: 'show-prediction',
      cardIndex: index
    };
    scene.add(card);
    room.objects.push(card);
  });
  
  // Livre mystique
  const bookGeometry = new THREE.BoxGeometry(0.4, 0.05, 0.6);
  const bookMaterial = new THREE.MeshStandardMaterial({
    color: 0x800020, // Burgundy
    roughness: 0.8,
    metalness: 0
  });
  
  const book = new THREE.Mesh(bookGeometry, bookMaterial);
  book.position.set(-0.5, 0.83, 0.5);
  book.rotation.y = Math.PI / 4;
  book.castShadow = true;
  book.userData = { 
    type: 'interactive', 
    name: 'Ancient Grimoire',
    description: 'Un ancien grimoire contenant les secrets de la magie.',
    action: 'open-book'
  };
  scene.add(book);
  room.objects.push(book);
}

// Ajouter les écouteurs d'événements
function addEventListeners() {
  // Gérer les mouvements de souris
  window.addEventListener('mousemove', (event) => {
    // Calculer la position de la souris normalisée
    room.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    room.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Mettre à jour la direction du spotlight
    updateSpotlight();
  });
  
  // Gérer les clics de souris
  window.addEventListener('click', () => {
    // Vérifier si les contrôles sont verrouillés
    if (!controls.isLocked) return;
    
    // Vérifier si un objet interactif est cliqué
    room.raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const intersects = room.raycaster.intersectObjects(room.objects);
    
    if (intersects.length > 0) {
      const object = intersects[0].object;
      if (object.userData && object.userData.type === 'interactive') {
        handleObjectInteraction(object);
      }
    }
  });
  
  // Gérer les touches du clavier (ZQSD/WASD)
  window.addEventListener('keydown', (event) => {
    // Ignorer si les contrôles ne sont pas verrouillés
    if (!controls.isLocked) return;
    
    switch (event.code) {
      case 'KeyW':
      case 'KeyZ':
        room.keys.forward = true;
        break;
      case 'KeyS':
        room.keys.backward = true;
        break;
      case 'KeyA':
      case 'KeyQ':
        room.keys.left = true;
        break;
      case 'KeyD':
        room.keys.right = true;
        break;
    }
  });
  
  window.addEventListener('keyup', (event) => {
    switch (event.code) {
      case 'KeyW':
      case 'KeyZ':
        room.keys.forward = false;
        break;
      case 'KeyS':
        room.keys.backward = false;
        break;
      case 'KeyA':
      case 'KeyQ':
        room.keys.left = false;
        break;
      case 'KeyD':
        room.keys.right = false;
        break;
    }
  });
  
  // Gérer le redimensionnement de la fenêtre
  window.addEventListener('resize', () => {
    if (!canvasContainer) return;
    
    // Mettre à jour la caméra
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();
    
    // Mettre à jour le renderer
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
  });
}

// Mettre à jour la direction du spotlight
function updateSpotlight() {
  if (!room.spotlight || !room.spotlightTarget) return;
  
  // Calculer la direction à partir de la caméra
  const vector = new THREE.Vector3(room.mouse.x, room.mouse.y, 0.5);
  vector.unproject(camera);
  
  const dir = vector.sub(camera.position).normalize();
  const distance = 3;
  
  // Positionner le spotlight à la position de la caméra
  room.spotlight.position.copy(camera.position);
  
  // Positionner le target en fonction de la direction
  room.spotlightTarget.position.copy(camera.position)
    .add(dir.multiplyScalar(distance));
}

// Gérer l'interaction avec un objet
function handleObjectInteraction(object) {
  const { name, description, action, cardIndex } = object.userData;
  
  // Afficher une info-bulle avec les détails de l'objet
  showTooltip(name, description);
  
  // Effectuer l'action spécifique à l'objet
  switch (action) {
    case 'reveal-secret':
      // Animation pour la sphère de cristal
      gsap.to(object.scale, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out'
      });
      
      // Révéler un secret magique
      setTimeout(() => {
        showModal('Secret Révélé', 'Le magicien a passé 10 ans à perfectionner le tour de la colombe qui apparaît dans un foulard vide. La clé du tour réside dans un mécanisme caché dans sa manche droite.');
      }, 1000);
      break;
      
    case 'show-prediction':
      // Animation pour la carte de tarot
      gsap.to(object.rotation, {
        z: Math.PI * 2,
        duration: 1,
        ease: 'power2.inOut'
      });
      
      // Montrer une prédiction
      const predictions = [
        "Une opportunité inattendue se présentera bientôt à vous. Saisissez-la sans hésiter.",
        "Un ami perdu de vue réapparaîtra avec une proposition intéressante.",
        "Votre persévérance sera bientôt récompensée de manière spectaculaire."
      ];
      
      setTimeout(() => {
        showModal('Prédiction', predictions[cardIndex] || predictions[0]);
      }, 1000);
      break;
      
    case 'open-book':
      // Animation pour le livre
      gsap.to(object.rotation, {
        x: Math.PI / 8,
        duration: 0.5,
        ease: 'power2.out'
      });
      
      // Ouvrir le grimoire
      setTimeout(() => {
        showModal('Grimoire Ancien', 'Les pages jaunies révèlent une formule magique ancienne. "Lux et veritas" - la lumière révèle la vérité. Ce grimoire contient les secrets des plus grands tours d\'illusion jamais créés.');
      }, 1000);
      break;
  }
}