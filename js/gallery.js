let imagensGaleria = [];
let imagensExibidas = 0;
let currentIndex = 0;
const FOTOS_POR_PAGINA = 12; // Quantas fotos aparecem de cada vez

document.addEventListener("DOMContentLoaded", async () => {
  if (document.querySelector(".gallery-grid")) {
    await inicializarGaleria();
    setupLightbox();
  }
});

async function inicializarGaleria() {
  try {
    const dados = await carregarDados();
    // Ordena e guarda todas as 50 fotos na memória
    imagensGaleria = (dados.galeria || []).sort((a, b) => a.ordem - b.ordem);

    if (imagensGaleria.length === 0) {
      exibirMensagemVazia();
      return;
    }

    // Carrega o primeiro lote
    carregarLote();

    // Configura o botão "Ver Mais"
    const btnLoadMore = document.getElementById("btn-load-more");
    btnLoadMore.addEventListener("click", () => carregarLote());
  } catch (erro) {
    console.error("Erro ao inicializar:", erro);
  }
}

function carregarLote() {
    const grid = document.querySelector('.gallery-grid');
    if (!grid) return;

    const proximoLote = imagensGaleria.slice(imagensExibidas, imagensExibidas + FOTOS_POR_PAGINA);
    
    const html = proximoLote.map((img, index) => {
        const actualIndex = imagensExibidas + index;
        // Removi a classe fade-in-up para garantir visibilidade imediata
        return `
            <div class="gallery-item" onclick="openLightbox(${actualIndex})" style="opacity: 1; transform: none;">
                <img src="./assets/galeria/${img.filename}" 
                     alt="${img.titulo || 'Evento Lulú'}" 
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/400?text=Erro+ao+Carregar'">
                <div class="gallery-overlay">
                    <span class="gallery-category">${img.titulo || 'Ver Foto'}</span>
                </div>
            </div>
        `;
    }).join('');

    grid.insertAdjacentHTML('beforeend', html);
    imagensExibidas += proximoLote.length;

    if (imagensExibidas >= imagensGaleria.length) {
        const btnContainer = document.getElementById('load-more-container');
        if (btnContainer) btnContainer.style.display = 'none';
    }
}

// O resto das funções (openLightbox, changeImage, etc.) permanecem IGUAIS
// porque elas já usam o array 'imagensGaleria' que contém as 50 fotos.

// ====== LÓGICA DO LIGHTBOX COM SWIPE ======

function setupLightbox() {
  // Criar elemento se não existir
  if (!document.getElementById("custom-lightbox")) {
    const lb = document.createElement("div");
    lb.id = "custom-lightbox";
    lb.className = "lightbox";
    lb.innerHTML = `
            <div class="lightbox-counter"></div>
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img id="lightbox-img" src="" alt="">
                <div class="lightbox-nav">
                    <div class="nav-btn" onclick="changeImage(-1)">&#10094;</div>
                    <div class="nav-btn" onclick="changeImage(1)">&#10095;</div>
                </div>
            </div>
            <div class="lightbox-caption"></div>
        `;
    document.body.appendChild(lb);

    // Eventos de fechar
    lb.querySelector(".lightbox-close").onclick = closeLightbox;
    lb.onclick = (e) => {
      if (e.target.id === "custom-lightbox") closeLightbox();
    };

    // Suporte a Teclado
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("active")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") changeImage(-1);
      if (e.key === "ArrowRight") changeImage(1);
    });

    // --- LÓGICA DE SWIPE (DESLIZAR) ---
    let touchStartX = 0;
    let touchEndX = 0;

    lb.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );

    lb.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      },
      { passive: true },
    );

    function handleSwipe() {
      const threshold = 50; // pixels mínimos para considerar swipe
      if (touchEndX < touchStartX - threshold) changeImage(1); // Deslizou para esquerda -> Próxima
      if (touchEndX > touchStartX + threshold) changeImage(-1); // Deslizou para direita -> Anterior
    }
  }
}

function openLightbox(index) {
  currentIndex = index;
  updateLightboxContent();
  document.getElementById("custom-lightbox").classList.add("active");
  document.body.style.overflow = "hidden"; // Trava o scroll do fundo
}

function closeLightbox() {
  document.getElementById("custom-lightbox").classList.remove("active");
  document.body.style.overflow = "";
}

function changeImage(step) {
  currentIndex += step;
  if (currentIndex >= imagensGaleria.length) currentIndex = 0;
  if (currentIndex < 0) currentIndex = imagensGaleria.length - 1;
  updateLightboxContent();
}

function updateLightboxContent() {
  const imgData = imagensGaleria[currentIndex];
  const lbImg = document.getElementById("lightbox-img");
  const lbCaption = document.querySelector(".lightbox-caption");
  const lbCounter = document.querySelector(".lightbox-counter");

  // Efeito de fade simples ao trocar
  lbImg.style.opacity = "0";

  setTimeout(() => {
    lbImg.src = `./assets/galeria/${imgData.filename}`;
    lbCaption.textContent = imgData.titulo || "";
    lbCounter.textContent = `${currentIndex + 1} / ${imagensGaleria.length}`;
    lbImg.style.opacity = "1";
  }, 150);
}

function exibirMensagemVazia() {
  document.querySelector(".gallery-grid").innerHTML =
    `<p class="text-center" style="grid-column: 1/-1;">Nenhuma imagem encontrada.</p>`;
}
