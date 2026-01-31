/**
 * ============================================
 * LULÚ EVENTOS - PAINEL DE ADMINISTRAÇÃO
 * Sistema de gestão offline com exportação ZIP
 * ============================================
 * 
 * FLUXO:
 * 1. Admin carrega backup ou inicia vazio
 * 2. Edita preços, textos e fotos
 * 3. Gera ZIP com content.json + imagens
 * 4. Envia ZIP ao técnico por WhatsApp
 * 5. Técnico descompacta no servidor
 */

// ====== ESTADO GLOBAL ======
let estadoActual = {
  meta: {},
  empresa: {},
  precos: { pacoteStandard: [], inclusoesPacote: [] },
  sobre: {},
  galeria: []
};

// Arrays temporários para gestão de imagens
let imagensExistentes = []; // Imagens que já estavam no sistema
let novasImagens = []; // Arquivos File de fotos novas
let imagensParaRemover = []; // IDs marcados para exclusão
let alteracoesNaoSalvas = false;

// ====== INICIALIZAÇÃO ======
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎨 Admin inicializado');
  configurarEventos();
  configurarAlertaSaida();
});

/**
 * Configurar todos os event listeners
 */
function configurarEventos() {
  // Tela inicial
  document.getElementById('carregarBackup').addEventListener('change', carregarBackup);
  document.getElementById('iniciarVazio').addEventListener('click', iniciarVazio);
  
  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => trocarTab(btn.dataset.tab));
  });
  
  // Upload de fotos
  const uploadZone = document.getElementById('uploadZone');
  const inputFotos = document.getElementById('inputFotos');
  
  uploadZone.addEventListener('click', () => inputFotos.click());
  inputFotos.addEventListener('change', handleNovasFotos);
  
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = '#D4AF37';
  });
  
  uploadZone.addEventListener('dragleave', () => {
    uploadZone.style.borderColor = '';
  });
  
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = '';
    handleNovasFotos({ target: { files: e.dataTransfer.files } });
  });
  
  // Botões principais
  document.getElementById('btnExportar').addEventListener('click', exportarZIP);
  document.getElementById('btnVisualizar').addEventListener('click', () => window.open('index.html', '_blank'));
  document.getElementById('addInclusao').addEventListener('click', adicionarInclusao);
  document.getElementById('modalFechar').addEventListener('click', fecharModal);
}

/**
 * Carregar arquivo JSON de backup
 */
function carregarBackup(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const dados = JSON.parse(event.target.result);
      estadoActual = dados;
      imagensExistentes = [...dados.galeria];
      iniciarInterface();
      mostrarToast('Backup carregado com sucesso!', 'success');
    } catch (erro) {
      mostrarToast('Erro ao ler arquivo. Verifique se é um JSON válido.', 'error');
      console.error(erro);
    }
  };
  reader.readAsText(file);
}

/**
 * Iniciar com dados vazios
 */
function iniciarVazio() {
  estadoActual = {
    meta: {
      versao: "1.0",
      ultimaAtualizacao: new Date().toISOString().split('T')[0],
      totalImagens: 0
    },
    empresa: {
      nome: "Lulú Eventos",
      slogan: "Ornamentação para momentos especiais",
      telefone: "+258865771736",
      whatsapp: "258865771736",
      email: "contacto@lulueventos.com",
      facebook: "@ornamentacaolulu",
      instagram: "@ornamentacaolulu",
      endereco: "Moçambique"
    },
    precos: {
      pacoteStandard: [
        {pessoas: 20, valor: 9000, moeda: "MT"},
        {pessoas: 30, valor: 10500, moeda: "MT"},
        {pessoas: 40, valor: 12000, moeda: "MT"},
        {pessoas: 50, valor: 13500, moeda: "MT"},
        {pessoas: 100, valor: 22000, moeda: "MT"},
        {pessoas: 150, valor: 30000, moeda: "MT"}
      ],
      inclusoesPacote: [
        "Mesa de honra",
        "Painel de fotos",
        "Mesa de buffet",
        "Mesinha de bolo",
        "Tapete vermelho",
        "Transporte"
      ]
    },
    sobre: {
      titulo: "Sobre Nós",
      historia: "A Lulú Eventos nasceu da paixão por criar momentos inesquecíveis.",
      missao: "Transformar seus sonhos em realidade com elegância e sofisticação."
    },
    galeria: []
  };
  
  imagensExistentes = [];
  iniciarInterface();
  mostrarToast('Iniciado com dados padrão', 'success');
}

/**
 * Iniciar interface de edição
 */
function iniciarInterface() {
  document.getElementById('telaInicial').classList.add('hidden');
  document.getElementById('areaEdicao').classList.remove('hidden');
  
  renderizarPrecos();
  renderizarInclusoes();
  renderizarSobre();
  renderizarGaleria();
  actualizarEstatisticas();
}

/**
 * Trocar de tab
 */
function trocarTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

// ====== RENDERIZAÇÃO ======

/**
 * Renderizar formulário de preços
 */
function renderizarPrecos() {
  const container = document.getElementById('precosForm');
  container.innerHTML = estadoActual.precos.pacoteStandard.map((item, index) => `
    <div class="form-group">
      <label>${item.pessoas} Pessoas</label>
      <input type="number" value="${item.valor}" 
             onchange="actualizarPreco(${index}, this.value)"
             placeholder="Valor em MT">
    </div>
  `).join('');
}

/**
 * Actualizar preço
 */
function actualizarPreco(index, valor) {
  estadoActual.precos.pacoteStandard[index].valor = parseInt(valor);
  marcarAlteracoes();
}

/**
 * Renderizar inclusões do pacote
 */
function renderizarInclusoes() {
  const container = document.getElementById('inclusoesForm');
  container.innerHTML = estadoActual.precos.inclusoesPacote.map((item, index) => `
    <div class="form-group" style="display: flex; gap: 0.5rem; align-items: center;">
      <input type="text" value="${item}" 
             onchange="actualizarInclusao(${index}, this.value)"
             style="flex: 1;">
      <button class="btn btn-danger" onclick="removerInclusao(${index})" style="flex-shrink: 0;">Remover</button>
    </div>
  `).join('');
}

/**
 * Actualizar inclusão
 */
function actualizarInclusao(index, valor) {
  estadoActual.precos.inclusoesPacote[index] = valor;
  marcarAlteracoes();
}

/**
 * Remover inclusão
 */
function removerInclusao(index) {
  estadoActual.precos.inclusoesPacote.splice(index, 1);
  renderizarInclusoes();
  marcarAlteracoes();
}

/**
 * Adicionar nova inclusão
 */
function adicionarInclusao() {
  estadoActual.precos.inclusoesPacote.push("Novo item");
  renderizarInclusoes();
  marcarAlteracoes();
}

/**
 * Renderizar formulário sobre
 */
function renderizarSobre() {
  document.getElementById('historia').value = estadoActual.sobre.historia || '';
  document.getElementById('missao').value = estadoActual.sobre.missao || '';
  
  document.getElementById('historia').addEventListener('input', (e) => {
    estadoActual.sobre.historia = e.target.value;
    marcarAlteracoes();
  });
  
  document.getElementById('missao').addEventListener('input', (e) => {
    estadoActual.sobre.missao = e.target.value;
    marcarAlteracoes();
  });
}

/**
 * Renderizar galeria
 */
function renderizarGaleria() {
  const container = document.getElementById('galeriaGrid');
  
  // Imagens existentes
  const htmlExistentes = imagensExistentes
    .filter(img => !imagensParaRemover.includes(img.id))
    .map((img, index) => `
      <div class="gallery-item">
        <img src="assets/galeria/${img.filename}" alt="${img.titulo}">
        ${imagensParaRemover.includes(img.id) ? '<div class="badge badge-remove">REMOVER</div>' : ''}
        <div class="controls">
          <input type="text" class="titulo-input" value="${img.titulo}" 
                 onchange="actualizarTitulo('${img.id}', this.value)" 
                 placeholder="Título da foto">
          <button class="btn btn-secondary" onclick="moverImagem(${index}, -1)">↑</button>
          <button class="btn btn-secondary" onclick="moverImagem(${index}, 1)">↓</button>
          <button class="btn btn-danger" onclick="marcarParaRemover('${img.id}')">Remover</button>
        </div>
      </div>
    `).join('');
  
  // Novas imagens
  const htmlNovas = novasImagens.map((item, index) => `
    <div class="gallery-item">
      <img src="${item.preview}" alt="${item.titulo}">
      <div class="badge">NOVO</div>
      <div class="controls">
        <input type="text" class="titulo-input" value="${item.titulo}" 
               onchange="actualizarTituloNova(${index}, this.value)" 
               placeholder="Título da foto">
        <button class="btn btn-danger" onclick="removerNova(${index})">Remover</button>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = htmlExistentes + htmlNovas;
  actualizarEstatisticas();
}

/**
 * Handle de novas fotos selecionadas
 */
function handleNovasFotos(e) {
  const files = Array.from(e.target.files);
  
  files.forEach((file, index) => {
    // Validar tipo
    if (!file.type.startsWith('image/')) {
      mostrarToast(`${file.name} não é uma imagem válida`, 'error');
      return;
    }
    
    // Criar preview
    const preview = URL.createObjectURL(file);
    
    // Gerar nome único
    const timestamp = Date.now();
    const novoNome = `img-${timestamp}-${index}.${file.name.split('.').pop()}`;
    
    // Gerar ID único
    const id = gerarUUID();
    
    novasImagens.push({
      id,
      file,
      preview,
      titulo: file.name.replace(/\.[^/.]+$/, ''),
      filename: novoNome
    });
  });
  
  renderizarGaleria();
  marcarAlteracoes();
  mostrarToast(`${files.length} foto(s) adicionada(s)`, 'success');
}

/**
 * Actualizar título de imagem existente
 */
function actualizarTitulo(id, novoTitulo) {
  const img = imagensExistentes.find(i => i.id === id);
  if (img) {
    img.titulo = novoTitulo;
    marcarAlteracoes();
  }
}

/**
 * Actualizar título de imagem nova
 */
function actualizarTituloNova(index, novoTitulo) {
  novasImagens[index].titulo = novoTitulo;
  marcarAlteracoes();
}

/**
 * Marcar imagem existente para remoção
 */
function marcarParaRemover(id) {
  if (imagensParaRemover.includes(id)) {
    imagensParaRemover = imagensParaRemover.filter(i => i !== id);
  } else {
    imagensParaRemover.push(id);
  }
  renderizarGaleria();
  marcarAlteracoes();
}

/**
 * Remover imagem nova (ainda não salva)
 */
function removerNova(index) {
  URL.revokeObjectURL(novasImagens[index].preview);
  novasImagens.splice(index, 1);
  renderizarGaleria();
  marcarAlteracoes();
}

/**
 * Mover imagem na ordem
 */
function moverImagem(index, direcao) {
  const novoIndex = index + direcao;
  if (novoIndex < 0 || novoIndex >= imagensExistentes.length) return;
  
  [imagensExistentes[index], imagensExistentes[novoIndex]] = 
  [imagensExistentes[novoIndex], imagensExistentes[index]];
  
  // Actualizar campo ordem
  imagensExistentes.forEach((img, i) => img.ordem = i);
  
  renderizarGaleria();
  marcarAlteracoes();
}

// ====== EXPORTAÇÃO ZIP ======

/**
 * Exportar pacote ZIP completo
 */
async function exportarZIP() {
  // Validar galeria
  const totalImagens = imagensExistentes.filter(i => !imagensParaRemover.includes(i.id)).length + novasImagens.length;
  
  if (totalImagens === 0) {
    mostrarModal('Erro', 'A galeria não pode ficar vazia. Adicione pelo menos uma foto.');
    return;
  }
  
  mostrarToast('Gerando pacote ZIP...', 'success');
  
  try {
    const zip = new JSZip();
    
    // 1. Preparar galeria final
    const galeriaFinal = [];
    
    // Adicionar imagens existentes (não removidas)
    imagensExistentes
      .filter(img => !imagensParaRemover.includes(img.id))
      .forEach((img, index) => {
        img.ordem = index;
        galeriaFinal.push({
          id: img.id,
          filename: img.filename,
          titulo: img.titulo,
          ordem: img.ordem
        });
      });
    
    // Adicionar novas imagens ao ZIP
    for (let i = 0; i < novasImagens.length; i++) {
      const nova = novasImagens[i];
      zip.file(`assets/galeria/${nova.filename}`, nova.file);
      
      galeriaFinal.push({
        id: nova.id,
        filename: nova.filename,
        titulo: nova.titulo,
        ordem: imagensExistentes.length + i
      });
    }
    
    // 2. Actualizar meta
    estadoActual.meta.totalImagens = galeriaFinal.length;
    estadoActual.meta.ultimaAtualizacao = new Date().toISOString().split('T')[0];
    estadoActual.galeria = galeriaFinal;
    
    // 3. Criar content.json
    const jsonContent = JSON.stringify(estadoActual, null, 2);
    zip.file('data/content.json', jsonContent);
    
    // 4. Gerar ZIP
    const blob = await zip.generateAsync({ type: 'blob' });
    
    // 5. Download
    const dataAtual = new Date().toISOString().split('T')[0];
    const nomeArquivo = `lulu-update-${dataAtual}.zip`;
    saveAs(blob, nomeArquivo);
    
    alteracoesNaoSalvas = false;
    mostrarModal('Sucesso!', `Pacote ${nomeArquivo} gerado com sucesso! Envie ao técnico por WhatsApp.`);
    
  } catch (erro) {
    console.error('Erro ao gerar ZIP:', erro);
    mostrarModal('Erro', 'Erro ao gerar pacote ZIP. Tente novamente.');
  }
}

// ====== UTILITÁRIOS ======

/**
 * Actualizar estatísticas
 */
function actualizarEstatisticas() {
  const totalExistentes = imagensExistentes.filter(i => !imagensParaRemover.includes(i.id)).length;
  const total = totalExistentes + novasImagens.length;
  
  document.getElementById('statImagens').textContent = total;
  document.getElementById('statNovas').textContent = novasImagens.length;
  document.getElementById('statRemover').textContent = imagensParaRemover.length;
}

/**
 * Marcar que há alterações não salvas
 */
function marcarAlteracoes() {
  alteracoesNaoSalvas = true;
}

/**
 * Alerta ao sair sem salvar
 */
function configurarAlertaSaida() {
  window.addEventListener('beforeunload', (e) => {
    if (alteracoesNaoSalvas) {
      e.preventDefault();
      e.returnValue = '';
    }
  });
}

/**
 * Gerar UUID
 */
function gerarUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Mostrar toast
 */
function mostrarToast(mensagem, tipo = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = mensagem;
  toast.className = `toast ${tipo}`;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/**
 * Mostrar modal
 */
function mostrarModal(titulo, mensagem) {
  document.getElementById('modalTitulo').textContent = titulo;
  document.getElementById('modalMensagem').textContent = mensagem;
  document.getElementById('modal').classList.add('show');
}

/**
 * Fechar modal
 */
function fecharModal() {
  document.getElementById('modal').classList.remove('show');
}

// Exportar funções globalmente para uso nos event handlers inline
window.actualizarPreco = actualizarPreco;
window.actualizarInclusao = actualizarInclusao;
window.removerInclusao = removerInclusao;
window.actualizarTitulo = actualizarTitulo;
window.actualizarTituloNova = actualizarTituloNova;
window.marcarParaRemover = marcarParaRemover;
window.removerNova = removerNova;
window.moverImagem = moverImagem;

console.log('✅ Admin carregado');