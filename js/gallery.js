let imagensGaleria = [];
let currentIndex = 0;

document.addEventListener('DOMContentLoaded', async () => {
    if (document.querySelector('.gallery-grid')) {
        await carregarEExibirGaleria();
        setupLightbox();
    }
});

async function carregarEExibirGaleria() {
    try {
        const dados = await carregarDados();
        imagensGaleria = (dados.galeria || []).sort((a, b) => a.ordem - b.ordem);
        
        if (imagensGaleria.length === 0) {
            exibirMensagemVazia();
            return;
        }
        
        const grid = document.querySelector('.gallery-grid');
        grid.innerHTML = imagensGaleria.map((img, index) => `
            <div class="gallery-item" onclick="openLightbox(${index})">
                <img src="./assets/galeria/${img.filename}" 
                     alt="${img.titulo || 'Evento Lulú'}" 
                     loading="lazy">
                <div class="gallery-overlay">
                    <span class="gallery-category">${img.titulo || 'Ver Foto'}</span>
                </div>
            </div>
        `).join('');
        
    } catch (erro) {
        console.error('Erro:', erro);
    }
}

// ====== LÓGICA DO LIGHTBOX COM SWIPE ======

function setupLightbox() {
    // Criar elemento se não existir
    if (!document.getElementById('custom-lightbox')) {
        const lb = document.createElement('div');
        lb.id = 'custom-lightbox';
        lb.className = 'lightbox';
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
        lb.querySelector('.lightbox-close').onclick = closeLightbox;
        lb.onclick = (e) => { if(e.target.id === 'custom-lightbox') closeLightbox(); };

        // Suporte a Teclado
        document.addEventListener('keydown', (e) => {
            if (!lb.classList.contains('active')) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") changeImage(-1);
            if (e.key === "ArrowRight") changeImage(1);
        });

        // --- LÓGICA DE SWIPE (DESLIZAR) ---
        let touchStartX = 0;
        let touchEndX = 0;

        lb.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        lb.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});

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
    document.getElementById('custom-lightbox').classList.add('active');
    document.body.style.overflow = 'hidden'; // Trava o scroll do fundo
}

function closeLightbox() {
    document.getElementById('custom-lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function changeImage(step) {
    currentIndex += step;
    if (currentIndex >= imagensGaleria.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = imagensGaleria.length - 1;
    updateLightboxContent();
}

function updateLightboxContent() {
    const imgData = imagensGaleria[currentIndex];
    const lbImg = document.getElementById('lightbox-img');
    const lbCaption = document.querySelector('.lightbox-caption');
    const lbCounter = document.querySelector('.lightbox-counter');

    // Efeito de fade simples ao trocar
    lbImg.style.opacity = '0';
    
    setTimeout(() => {
        lbImg.src = `./assets/galeria/${imgData.filename}`;
        lbCaption.textContent = imgData.titulo || "";
        lbCounter.textContent = `${currentIndex + 1} / ${imagensGaleria.length}`;
        lbImg.style.opacity = '1';
    }, 150);
}

function exibirMensagemVazia() {
    document.querySelector('.gallery-grid').innerHTML = `<p class="text-center" style="grid-column: 1/-1;">Nenhuma imagem encontrada.</p>`;
}