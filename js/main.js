// ============================================
// LULÚ EVENTOS - JAVASCRIPT PRINCIPAL
// Funcionalidades: Menu, Scroll Effects, Animações
// ============================================

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎨 Lulú Eventos - Site carregado!');
  
  initNavigation();
  initScrollEffects();
  initScrollReveal();
  initLazyLoading();
  initWhatsAppButton();
  loadContactInfo();
});

// ============================================
// NAVEGAÇÃO & MENU
// ============================================
function initNavigation() {
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Header transparente vira sólido ao scrollar
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Adicionar classe 'scrolled' quando scrollar mais de 100px
    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });

  // Menu hamburguer mobile
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Fechar menu ao clicar em link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Marcar link ativo baseado na página atual
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Smooth scroll para âncoras
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 100; // Compensar altura do header
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================
// EFEITOS DE SCROLL
// ============================================
function initScrollEffects() {
  // Parallax suave em backgrounds
  const parallaxElements = document.querySelectorAll('.parallax-bg');
  
  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }
}

// ============================================
// SCROLL REVEAL (INTERSECTION OBSERVER)
// ============================================
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
  
  if (revealElements.length === 0) return;

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Opcional: parar de observar após revelar
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    observer.observe(element);
  });
}

// ============================================
// LAZY LOADING DE IMAGENS
// ============================================
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Adicionar classe quando carregar
          img.addEventListener('load', () => {
            img.classList.add('loaded');
            img.parentElement?.classList.remove('img-placeholder');
          });
          
          // Se já estiver carregada
          if (img.complete) {
            img.classList.add('loaded');
            img.parentElement?.classList.remove('img-placeholder');
          }
          
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => {
      img.parentElement?.classList.add('img-placeholder');
      imageObserver.observe(img);
    });
  } else {
    // Fallback para navegadores sem suporte
    lazyImages.forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  }
}

// ============================================
// BOTÃO WHATSAPP FLUTUANTE
// ============================================
function initWhatsAppButton() {
  const whatsappBtn = document.querySelector('.whatsapp-float');
  
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      openWhatsApp('Olá! Gostaria de solicitar um orçamento para o meu evento.');
    });
  }
}

// ============================================
// CARREGAR INFORMAÇÕES DE CONTATO
// ============================================
async function loadContactInfo() {
  try {
    const contactos = await dataManager.getContactos();
    
    // Atualizar todos os links de contato na página
    document.querySelectorAll('[data-contact="phone"]').forEach(el => {
      el.textContent = contactos.telefone;
      el.href = getTelLink(contactos.telefone);
    });
    
    document.querySelectorAll('[data-contact="email"]').forEach(el => {
      el.textContent = contactos.email;
      el.href = `mailto:${contactos.email}`;
    });
    
    document.querySelectorAll('[data-contact="whatsapp"]').forEach(el => {
      el.href = getWhatsAppLink(contactos.whatsapp);
    });
    
    document.querySelectorAll('[data-contact="facebook"]').forEach(el => {
      el.textContent = contactos.facebook;
      el.href = `https://facebook.com/${contactos.facebook.replace('@', '')}`;
    });
    
    document.querySelectorAll('[data-contact="instagram"]').forEach(el => {
      el.textContent = contactos.instagram;
      el.href = `https://instagram.com/${contactos.instagram.replace('@', '')}`;
    });
    
  } catch (error) {
    console.error('Erro ao carregar informações de contato:', error);
  }
}

// ============================================
// CONTADOR ANIMADO (ESTATÍSTICAS)
// ============================================
function animateCounter(element, target, duration = 2000) {
  let current = 0;
  const increment = target / (duration / 16); // 60 FPS
  
  const updateCounter = () => {
    current += increment;
    
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };
  
  updateCounter();
}

// Iniciar contadores quando visíveis
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.target);
        
        if (target && !counter.classList.contains('counted')) {
          animateCounter(counter, target);
          counter.classList.add('counted');
          observer.unobserve(counter);
        }
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// Chamar quando DOM carregar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCounters);
} else {
  initCounters();
}

// ============================================
// UTILITÁRIOS
// ============================================

// Debounce para performance em scroll
function debounce(func, wait = 10) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle para performance em scroll
function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Exportar funções úteis
window.animateCounter = animateCounter;
window.debounce = debounce;
window.throttle = throttle;

console.log('✨ Scripts principais carregados!');