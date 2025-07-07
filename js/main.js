// main.js
// Funcionalidades principales de la SPA

// Loading state
function showLoading() {
  const loader = document.createElement('div');
  loader.className = 'loader';
  loader.innerHTML = `
    <div class="loader-spinner"></div>
    <p>Cargando...</p>
  `;
  document.body.appendChild(loader);
}

function hideLoading() {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.remove();
  }
}

// Theme management
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
}

// Error handling
function handleError(error, context = '') {
  console.error(`Error en ${context}:`, error);
  
  // Show user-friendly error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `
    <p>Algo salió mal. Por favor, recarga la página.</p>
    <button onclick="location.reload()">Recargar</button>
  `;
  document.body.appendChild(errorDiv);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.remove();
    }
  }, 5000);
}

// Service Worker Registration
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registrado exitosamente:', registration.scope);
          
          // Verificar actualizaciones
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Hay una nueva versión disponible
                showUpdateNotification();
              }
            });
          });
        })
        .catch(error => {
          console.log('Error al registrar SW:', error);
        });
    });
  }
}

// Mostrar notificación de actualización
function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.className = 'update-notification';
  notification.innerHTML = `
    <p>¡Nueva versión disponible!</p>
    <button onclick="location.reload()">Actualizar</button>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 10000);
}

document.addEventListener('DOMContentLoaded', function() {
  try {
    // Registrar Service Worker
    registerServiceWorker();
    
    // Initialize theme
    initTheme();
    
    // Show loading initially
    showLoading();
    
    // Simulate loading time (remove in production)
    setTimeout(() => {
      hideLoading();
    }, 1000);
    
    // Añade el año actual al footer automáticamente
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }

  // Smooth scroll para enlaces internos
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Botón de contacto - scroll suave a la sección
  const contactBtn = document.getElementById('contact-btn');
  const modal = document.getElementById('modal-contact');
  const closeModal = document.getElementById('close-modal');

  if (contactBtn && modal) {
    contactBtn.addEventListener('click', function(e) {
      e.preventDefault();
      modal.classList.add('active');
    });
  }
  if (closeModal && modal) {
    closeModal.addEventListener('click', function() {
      modal.classList.remove('active');
    });
  }
  // Cerrar modal al hacer clic fuera del contenido
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
  } catch (error) {
    handleError(error, 'DOMContentLoaded');
  }
}); 