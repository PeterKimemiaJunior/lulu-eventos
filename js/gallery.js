// ============================================
// LULÚ EVENTOS - GALERIA
// Funcionalidades: Filtros, Lightbox, Lazy Loading
// ============================================

// ============================================
// CONFIGURAÇÃO DA GALERIA
// ============================================
const GALLERY_CONFIG = {
  // Estrutura de imagens - todas numa única categoria por enquanto
  // Posteriormente será possível categorizar
  images: [
    // As imagens serão adicionadas pelo admin via upload
    // Exemplo de estrutura:
    // { id: 1, category: 'geral', src: 'assets/galeria/foto1.jpg', alt: 'Evento Lulú' }
  ]
};

// ============================================
// CARREGAR GALERIA DO LOCALSTORAGE
// ============================================
function loadGalleryFromStorage() {
  const stored = localStorage.getItem('lulu_gallery');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      GALLERY_CONFIG.images = parsed;
      console.log(`📷 Galeria carregada: ${parsed.length} imagens`);
    } catch (e) {
      console.error('Erro ao carregar galeria:', e);
    }
  }
}

// ============================================
// SALVAR GALERIA NO LOCALSTORAGE
// ============================================
function saveGalleryToStorage() {
  try {
    localStorage.setItem('lulu_gallery', JSON.stringify(GALLERY_CONFIG.images));
    console.log('💾 Galeria salva com sucesso');
  } catch (e) {
    console.error('Erro ao salvar galeria:', e);
  }
}

// Carregar ao iniciar
loadGalleryFromStorage();

// ============================================
// INICIALIZAÇÃO DA GALERIA
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.gallery-grid')) {
    initGalleryFilters();
    initLightbox();
    loadGalleryImages();
  }
});

// ============================================
// FILTROS DA GALERIA
// ============================================
function initGalleryFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remover classe active de todos os botões
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Adicionar classe active ao botão clicado
      button.classList.add('active');

      // Pegar categoria selecionada
      const category = button.dataset.filter;

      // Filtrar itens
      filterGalleryItems(category, galleryItems);
    });
  });
}

function filterGalleryItems(category, items) {
  items.forEach(item => {
    const itemCategory = item.dataset.category;

    // Mostrar todos ou filtrar por categoria
    if (category === 'todos' || itemCategory === category) {
      item.style.display = 'block';
      
      // Animação de entrada
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
      }, 10);
    } else {
      item.style.opacity = '0';
      item.style.transform = 'scale(0.8)';
      
      setTimeout(() => {
        item.style.display = 'none';
      }, 300);
    }
  });
}

// ============================================
// LIGHTBOX (MODAL DE IMAGEM)
// ============================================
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  let lightbox = document.querySelector('.lightbox');

  // Criar lightbox se não existir
  if (!lightbox) {
    lightbox = createLightbox();
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector('.lightbox-content img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  // Abrir lightbox ao clicar na imagem
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Fechar lightbox
  closeBtn.addEventListener('click', () => {
    closeLightbox(lightbox);
  });

  // Fechar ao clicar fora da imagem
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox(lightbox);
    }
  });

  // Fechar com tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox(lightbox);
    }
  });
}

function createLightbox() {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Fechar"></button>
      <img src="" alt="">
    </div>
  `;
  return lightbox;
}

function closeLightbox(lightbox) {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================
// CARREGAR IMAGENS DA GALERIA
// ============================================
function loadGalleryImages() {
  const galleryGrid = document.querySelector('.gallery-grid');
  
  if (!galleryGrid) return;

  // Limpar galeria existente (se houver)
  galleryGrid.innerHTML = '';

  // Adicionar imagens
  GALLERY_CONFIG.images.forEach(image => {
    const item = createGalleryItem(image);
    galleryGrid.appendChild(item);
  });

  // Reinicializar lazy loading
  initLazyLoadingForGallery();
}

function createGalleryItem(image) {
  const item = document.createElement('div');
  item.className = 'gallery-item fade-in-up';
  item.dataset.category = image.category;
  
  item.innerHTML = `
    <img src="${image.src}" 
         alt="${image.alt}" 
         loading="lazy">
    <div class="gallery-overlay">
      <span class="gallery-category">${getCategoryName(image.category)}</span>
    </div>
  `;
  
  return item;
}

function getCategoryName(categoryId) {
  const categories = {
    'casamento': 'Casamentos',
    'aniversario': 'Aniversários',
    'corporativo': 'Corporativo',
    'baptizado': 'Baptizados'
  };
  
  return categories[categoryId] || categoryId;
}

// ============================================
// LAZY LOADING ESPECÍFICO DA GALERIA
// ============================================
function initLazyLoadingForGallery() {
  const lazyImages = document.querySelectorAll('.gallery-item img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          img.addEventListener('load', () => {
            img.classList.add('loaded');
          });
          
          if (img.complete) {
            img.classList.add('loaded');
          }
          
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }
}

// ============================================
// ORGANIZAR GALERIA (MASONRY LAYOUT)
// ============================================
function organizeGalleryMasonry() {
  const grid = document.querySelector('.gallery-grid');
  
  if (!grid) return;

  // Esta função pode ser expandida para criar um layout masonry real
  // Por enquanto, CSS Grid já cria um layout responsivo elegante
  
  console.log('📷 Galeria organizada');
}

// ============================================
// ADICIONAR NOVA IMAGEM À GALERIA (PARA ADMIN)
// ============================================
function addImageToGallery(imageData) {
  GALLERY_CONFIG.images.push(imageData);
  loadGalleryImages();
}

// ============================================
// EXPORTAR GALERIA COMO JSON (PARA ADMIN)
// ============================================
function exportGalleryConfig() {
  const dataStr = JSON.stringify(GALLERY_CONFIG, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gallery-config.json';
  link.click();
  
  URL.revokeObjectURL(url);
  
  console.log('📥 Configuração da galeria exportada!');
}

// Exportar funções para uso global
window.GALLERY_CONFIG = GALLERY_CONFIG;
window.addImageToGallery = addImageToGallery;
window.exportGalleryConfig = exportGalleryConfig;

console.log('🖼️ Galeria inicializada com', GALLERY_CONFIG.images.length, 'imagens');