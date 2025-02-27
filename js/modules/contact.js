/**
 * Module pour le formulaire de contact avec effets spéciaux
 */

// Variables globales
let form;
let submitButton;
let formFields = [];
let particles = [];

// Initialisation du formulaire de contact
export function initContact() {
  // Récupérer les éléments du formulaire
  form = document.getElementById('contact-form');
  submitButton = form ? form.querySelector('.btn--submit') : null;
  formFields = form ? Array.from(form.querySelectorAll('input, textarea')) : [];
  
  if (!form || !submitButton || formFields.length === 0) return;
  
  // Appliquer les effets aux champs du formulaire
  setupFormFields();
  
  // Configurer l'effet de lévitation du bouton
  setupSubmitButton();
  
  // Ajouter les écouteurs d'événements
  form.addEventListener('submit', handleSubmit);
}

// Configurer les effets des champs du formulaire
function setupFormFields() {
  formFields.forEach(field => {
    // Supprimer le placeholder natif
    field.placeholder = '';
    
    // Créer un conteneur pour les particules
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'field-particles';
    particlesContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
    `;
    
    // Ajouter le conteneur de particules
    field.parentNode.style.position = 'relative';
    field.parentNode.appendChild(particlesContainer);
    
    // Ajouter les écouteurs d'événements
    field.addEventListener('input', e => {
      createTextParticles(e, field, particlesContainer);
    });
    
    // Ajouter un effet de focus
    field.addEventListener('focus', () => {
      field.parentNode.classList.add('focused');
    });
    
    field.addEventListener('blur', () => {
      field.parentNode.classList.remove('focused');
      
      // Si le champ n'est pas vide, ajouter une classe pour le label
      if (field.value.trim() !== '') {
        field.classList.add('has-content');
      } else {
        field.classList.remove('has-content');
      }
    });
  });
  
  // Appliquer des styles CSS pour améliorer l'apparence
  const style = document.createElement('style');
  style.textContent = `
    .form__group {
      position: relative;
      margin-bottom: 30px;
    }
    
    .form__group input,
    .form__group textarea {
      width: 100%;
      padding: 15px 0;
      font-size: 18px;
      color: #FFFFFF;
      border: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      background: transparent;
      transition: border-color 0.3s;
    }
    
    .form__group label {
      position: absolute;
      top: 15px;
      left: 0;
      font-size: 18px;
      color: rgba(255, 255, 255, 0.7);
      pointer-events: none;
      transition: all 0.3s ease;
    }
    
    .form__group input:focus,
    .form__group textarea:focus {
      outline: none;
      border-color: #FFD700;
    }
    
    .form__group input:focus ~ label,
    .form__group textarea:focus ~ label,
    .form__group input.has-content ~ label,
    .form__group textarea.has-content ~ label {
      top: -15px;
      font-size: 14px;
      color: #FFD700;
    }
    
    .form__group.focused::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: #FFD700;
      transform: scaleX(1);
      transform-origin: left;
      transition: transform 0.3s;
    }
  `;
  
  document.head.appendChild(style);
}

// Créer des particules pour le texte saisi
function createTextParticles(event, field, container) {
  // Ne créer des particules que pour les nouvelles lettres
  if (event.inputType === 'deleteContentBackward') return;
  
  // Position du curseur
  const rect = field.getBoundingClientRect();
  const fieldRect = container.getBoundingClientRect();
  
  // Créer des particules dorées
  for (let i = 0; i < 3; i++) {
    const particle = document.createElement('div');
    
    // Position initiale (au niveau du curseur)
    const x = field.selectionStart * 10; // Estimation de la position horizontale
    const y = 20; // Au milieu du champ
    
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 2}px;
      height: ${Math.random() * 4 + 2}px;
      background-color: #FFD700;
      border-radius: 50%;
      left: ${x}px;
      top: ${y}px;
      opacity: 1;
      pointer-events: none;
      box-shadow: 0 0 10px #FFD700;
    `;
    
    container.appendChild(particle);
    
    // Animer la particule
    gsap.to(particle, {
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 50,
      opacity: 0,
      duration: Math.random() * 1 + 0.5,
      ease: 'power1.out',
      onComplete: () => {
        if (particle.parentNode) {
          container.removeChild(particle);
        }
      }
    });
  }
}

// Configurer l'effet de lévitation du bouton d'envoi
function setupSubmitButton() {
  // Animation de lévitation déjà appliquée via CSS
  // Ajouter un effet de pulsation
  gsap.to(submitButton, {
    boxShadow: '0 0 15px rgba(255, 215, 0, 0.7)',
    scale: 1.05,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  });
  
  // Ajouter un effet de surbrillance au survol
  submitButton.addEventListener('mouseenter', () => {
    gsap.to(submitButton, {
      backgroundColor: 'rgba(255, 215, 0, 0.2)',
      color: '#FFFFFF',
      duration: 0.3
    });
  });
  
  submitButton.addEventListener('mouseleave', () => {
    gsap.to(submitButton, {
      backgroundColor: 'transparent',
      color: '#FFD700',
      duration: 0.3
    });
  });
}

// Gérer la soumission du formulaire
function handleSubmit(e) {
  e.preventDefault();
  
  // Récupérer les valeurs du formulaire
  const formData = {
    name: form.querySelector('#name').value,
    email: form.querySelector('#email').value,
    message: form.querySelector('#message').value
  };
  
  // Vérifier que tous les champs sont remplis
  if (!formData.name || !formData.email || !formData.message) {
    showNotification('Veuillez remplir tous les champs', 'error');
    return;
  }
  
  // Vérifier le format de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    showNotification('Veuillez entrer une adresse email valide', 'error');
    return;
  }
  
  // Simuler l'envoi du formulaire (à remplacer par un vrai envoi)
  showLoadingAnimation();
  
  // Simuler un délai de traitement
  setTimeout(() => {
    hideLoadingAnimation();
    showEnvelopeAnimation(formData);
  }, 1500);
}

// Afficher une notification
function showNotification(message, type = 'success') {
  // Vérifier si une notification existe déjà
  let notification = document.querySelector('.form-notification');
  
  if (!notification) {
    // Créer l'élément de notification
    notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      background: ${type === 'success' ? 'rgba(0, 128, 0, 0.8)' : 'rgba(220, 0, 0, 0.8)'};
      color: #FFFFFF;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      font-family: 'Playfair Display', serif;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Afficher la notification avec un délai
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Masquer la notification après un délai
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      
      // Supprimer l'élément après la transition
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Afficher l'animation de chargement
function showLoadingAnimation() {
  // Désactiver le bouton et afficher un indicateur de chargement
  submitButton.disabled = true;
  
  const originalText = submitButton.textContent;
  submitButton.dataset.originalText = originalText;
  
  // Créer l'animation de chargement
  submitButton.innerHTML = `
    <span class="loading-spinner" style="
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 215, 0, 0.3);
      border-top-color: #FFD700;
      border-radius: 50%;
      margin-right: 10px;
      animation: spin 1s infinite linear;
    "></span>
    Envoi en cours...
  `;
  
  // Ajouter le style pour l'animation
  if (!document.querySelector('#loading-animation-style')) {
    const style = document.createElement('style');
    style.id = 'loading-animation-style';
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

// Masquer l'animation de chargement
function hideLoadingAnimation() {
  // Restaurer le texte original
  submitButton.textContent = submitButton.dataset.originalText || 'Envoyer';
  submitButton.disabled = false;
}

// Afficher l'animation de l'enveloppe
function showEnvelopeAnimation(formData) {
  // Créer le conteneur de l'animation
  const animationContainer = document.createElement('div');
  animationContainer.className = 'envelope-animation';
  
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
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.5s ease;
  `;
  
  // Créer l'enveloppe
  const envelope = document.createElement('div');
  envelope.className = 'envelope';
  
  envelope.style.cssText = `
    width: 300px;
    height: 200px;
    background: #f5f5f5;
    position: relative;
    perspective: 1000px;
    transform-style: preserve-3d;
    transform: rotateY(0deg);
    transition: transform 1s ease;
  `;
  
  // Créer les faces de l'enveloppe
  const front = document.createElement('div');
  front.className = 'envelope-front';
  
  front.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    border: 2px solid #ccc;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    backface-visibility: hidden;
  `;
  
  front.innerHTML = `
    <div style="text-align: center;">
      <h3 style="margin: 0; color: #333; font-family: 'Playfair Display', serif;">Message de ${formData.name}</h3>
      <p style="margin: 10px 0; color: #666;">${formData.email}</p>
      <p style="margin: 0; color: #333; font-style: italic; padding: 0 20px; font-size: 14px;">"${formData.message.substring(0, 100)}${formData.message.length > 100 ? '...' : ''}"</p>
    </div>
  `;
  
  // Face arrière (scellée)
  const back = document.createElement('div');
  back.className = 'envelope-back';
  
  back.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #e6e6e6;
    border: 2px solid #ccc;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    backface-visibility: hidden;
    transform: rotateY(180deg);
  `;
  
  back.innerHTML = `
    <div style="text-align: center;">
      <h3 style="margin: 0; color: #333; font-family: 'Playfair Display', serif;">Message Envoyé</h3>
      <p style="margin: 10px 0; color: #666;">Nous vous répondrons très bientôt.</p>
      <div style="
        margin-top: 15px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #FFD700;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 0 15px #FFD700;
      ">
        <span style="color: #333; font-size: 24px;">✓</span>
      </div>
    </div>
  `;
  
  // Assembler l'enveloppe
  envelope.appendChild(front);
  envelope.appendChild(back);
  animationContainer.appendChild(envelope);
  document.body.appendChild(animationContainer);
  
  // Afficher l'animation
  setTimeout(() => {
    animationContainer.style.opacity = '1';
  }, 10);
  
  // Ajouter l'effet de flamme
  setTimeout(() => {
    const flame = document.createElement('div');
    flame.className = 'envelope-flame';
    
    flame.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 0;
      background: linear-gradient(to bottom, transparent, rgba(255, 69, 0, 0.7));
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
      z-index: 1;
    `;
    
    envelope.appendChild(flame);
    
    // Animer la flamme
    gsap.to(flame, {
      height: '100%',
      duration: 1.5,
      ease: 'power2.in',
      onComplete: () => {
        // Retourner l'enveloppe
        envelope.style.transform = 'rotateY(180deg)';
        
        // Supprimer la flamme après la transition
        setTimeout(() => {
          if (flame.parentNode) {
            envelope.removeChild(flame);
          }
        }, 1000);
      }
    });
  }, 1000);
  
  // Fermer l'animation et réinitialiser le formulaire
  setTimeout(() => {
    // Masquer l'animation
    animationContainer.style.opacity = '0';
    
    // Supprimer l'élément après la transition
    setTimeout(() => {
      if (animationContainer.parentNode) {
        document.body.removeChild(animationContainer);
      }
    }, 500);
    
    // Réinitialiser le formulaire
    form.reset();
    formFields.forEach(field => {
      field.classList.remove('has-content');
    });
    
    // Afficher une notification de succès
    showNotification('Votre message a été envoyé avec succès !', 'success');
  }, 5000);
}
