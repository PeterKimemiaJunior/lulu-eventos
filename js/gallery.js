// ============================================
// LULÚ EVENTOS - GALERIA
// Carrega fotos do content.json
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  if (document.querySelector('.gallery-grid')) {
    await carregarEExibirGaleria();
    initLightbox();
  }
});

/**
 * Carregar e exibir galeria
 */
async function carregarEExibirGaleria() {
  try {
    console.log('🔄 Carregando galeria...');
    const dados = await carregarDados();
    console.log('📊 Dados recebidos:', dados);
    
    const galeria = dados.galeria || [];
    console.log(`📷 Total de imagens: ${galeria.length}`);
    
    if (galeria.length === 0) {
      console.warn('⚠️ Galeria vazia');
      exibirMensagemVazia();
      return;
    }
    
    console.log('🖼️ Renderizando galeria...');
    renderizarGaleria(galeria);
    console.log('✅ Galeria renderizada com sucesso');
    
  } catch (erro) {
    console.error('❌ Erro ao carregar galeria:', erro);
    exibirMensagemVazia();
  }
}

/**
 * Renderizar galeria no DOM
 */
function renderizarGaleria(imagens) {
  const grid = document.querySelector('.gallery-grid');
  
  // Ordenar por campo 'ordem'
  const imagensOrdenadas = [...imagens].sort((a, b) => a.ordem - b.ordem);
  
  grid.innerHTML = imagensOrdenadas.map(img => `
    <div class="gallery-item fade-in-up" data-id="${img.id}" style="opacity: 1; transform: scale(1);">
      <img src="./assets/galeria/${img.filename}" 
           alt="${img.titulo || 'Evento Lulú'}" 
           loading="lazy"
           style="display: block; width: 100%; height: 100%; object-fit: cover;"
           onerror="this.parentElement.style.display='none'; console.error('Erro ao carregar:', this.src);">
      <div class="gallery-overlay">
        <span class="gallery-category">${img.titulo || 'Galeria'}</span>
      </div>
    </div>
  `).join('');
  
  console.log(`✅ ${imagensOrdenadas.length} imagens renderizadas na galeria`);
}

/**
 * Exibir mensagem quando galeria vazia
 */
function exibirMensagemVazia() {
  const grid = document.querySelector('.gallery-grid');
  grid.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; opacity: 0.7;">
      <div style="font-size: 4rem; margin-bottom: 1rem;">📸</div>
      <h3>Galeria em actualização</h3>
      <p style="margin-top: 0.5rem;">Em breve teremos fotos dos nossos eventos aqui!</p>
    </div>
  `;
}

// ====== LIGHTBOX ======

/**
 * Inicializar lightbox
 */
function initLightbox() {
  let lightbox = document.querySelector('.lightbox');
  
  if (!lightbox) {
    lightbox = criarLightbox();
    document.body.appendChild(lightbox);
  }
  
  const lightboxImg = lightbox.querySelector('.lightbox-content img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  
  // Abrir ao clicar
  document.addEventListener('click', (e) => {
    const galleryItem = e.target.closest('.gallery-item');
    if (galleryItem) {
      const img = galleryItem.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  });
  
  // Fechar
  lightboxClose.addEventListener('click', () => fecharLightbox(lightbox));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) fecharLightbox(lightbox);
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      fecharLightbox(lightbox);
    }
  });
}

/**
 * Criar elemento lightbox
 */
function criarLightbox() {
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

/**
 * Fechar lightbox
 */
function fecharLightbox(lightbox) {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

console.log('🖼️ Galeria inicializada');