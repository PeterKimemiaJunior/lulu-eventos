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
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🎨 Admin inicializado');
  configurarEventos();
  configurarAlertaSaida();
  
  // Verify if we have a persisted session password
  const savedPassword = sessionStorage.getItem('lulu_admin_password');
  if (savedPassword) {
    const success = await verificarCredenciais(savedPassword);
    if (success) {
      const overlay = document.getElementById('loginOverlay');
      if (overlay) overlay.style.display = 'none';
      await tentarCarregamentoAutomatico();
      return;
    }
  }
  
  // Otherwise, ensure overlay is visible and ready
  const overlay = document.getElementById('loginOverlay');
  if (overlay) overlay.style.display = 'flex';
});

/**
 * Verifica as credenciais junto do servidor
 */
async function verificarCredenciais(password) {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await response.json();
    return response.ok && data.success;
  } catch (erro) {
    console.error('Erro na verificação de credenciais:', erro);
    return false;
  }
}

/**
 * Tenta fazer login com a palavra-passe introduzida
 */
async function tentarLogin() {
  const passwordInput = document.getElementById('inputPassword');
  const errorEl = document.getElementById('loginErro');
  if (!passwordInput || !errorEl) return;
  
  const password = passwordInput.value;
  errorEl.textContent = '';
  
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    
    const data = await response.json();
    if (response.ok && data.success) {
      sessionStorage.setItem('lulu_admin_password', password);
      const overlay = document.getElementById('loginOverlay');
      if (overlay) overlay.style.display = 'none';
      mostrarToast('Acesso autorizado com sucesso!', 'success');
      await tentarCarregamentoAutomatico();
    } else {
      errorEl.textContent = data.error || 'Palavra-passe inválida.';
    }
  } catch (erro) {
    errorEl.textContent = 'Erro ao conectar-se ao servidor.';
    console.error(erro);
  }
}

/**
 * Tenta carregar automaticamente content.json do servidor
 */
async function tentarCarregamentoAutomatico() {
  try {
    let response;
    try {
      response = await fetch('/data/content.json');
      if (!response.ok) {
        throw new Error(`Erro HTTP no caminho absoluto: ${response.status}`);
      }
    } catch (e) {
      console.warn('Erro ao carregar caminho absoluto do admin, tentando relativo...', e);
      response = await fetch('./data/content.json');
    }
    
    if (response.ok) {
      const dados = await response.json();
      estadoActual = dados;
      imagensExistentes = [...dados.galeria];
      iniciarInterface();
      mostrarToast('Dados ativos do site carregados automaticamente!', 'success');
    } else {
      console.warn('Não foi possível carregar content.json automaticamente.');
    }
  } catch (erro) {
    console.error('Erro no carregamento automático:', erro);
  }
}

/**
 * Importa e carrega dados de um arquivo backup File
 */
function handleBackupUpload(file) {
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
 * Configurar todos os event listeners
 */
function configurarEventos() {
  // Tela inicial
  document.getElementById('carregarBackup').addEventListener('change', carregarBackup);
  document.getElementById('iniciarVazio').addEventListener('click', iniciarVazio);
  
  // Header Import Backup
  const carregarBackupHeader = document.getElementById('carregarBackupHeader');
  if (carregarBackupHeader) {
    carregarBackupHeader.addEventListener('change', (e) => {
      handleBackupUpload(e.target.files[0]);
    });
  }

  // Novo Pacote de Preço button
  const addPacotePrecoBtn = document.getElementById('addPacotePreco');
  if (addPacotePrecoBtn) {
    addPacotePrecoBtn.addEventListener('click', adicionarPacotePreco);
  }
  
  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => trocarTab(btn.dataset.tab));
  });
  
  // Upload de fotos
  const uploadZone = document.getElementById('uploadZone');
  const inputFotos = document.getElementById('inputFotos');
  
  if (uploadZone) {
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
  }
  
  // Botões principais
  const btnSalvarServidor = document.getElementById('btnSalvarServidor');
  if (btnSalvarServidor) {
    btnSalvarServidor.addEventListener('click', salvarNoServidor);
  }
  document.getElementById('btnExportar').addEventListener('click', exportarZIP);
  document.getElementById('btnVisualizar').addEventListener('click', () => window.open('index.html', '_blank'));
  document.getElementById('addInclusao').addEventListener('click', adicionarInclusao);
  document.getElementById('modalFechar').addEventListener('click', fecharModal);
}

/**
 * Carregar arquivo JSON de backup
 */
function carregarBackup(e) {
  handleBackupUpload(e.target.files[0]);
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
  const telaInicial = document.getElementById('telaInicial');
  const areaEdicao = document.getElementById('areaEdicao');
  if (telaInicial) telaInicial.classList.add('hidden');
  if (areaEdicao) areaEdicao.classList.remove('hidden');
  
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
  
  const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
  if (activeBtn) activeBtn.classList.add('active');
  const activeContent = document.getElementById(tabId);
  if (activeContent) activeContent.classList.add('active');
}

// ====== RENDERIZAÇÃO ======

/**
 * Renderizar formulário de preços com suporte dinâmico para adição e remoção
 */
function renderizarPrecos() {
  const container = document.getElementById('precosForm');
  if (!container) return;
  
  if (!estadoActual.precos.pacoteStandard || estadoActual.precos.pacoteStandard.length === 0) {
    container.innerHTML = `<p style="opacity: 0.6; margin-bottom: 1.5rem;">Nenhum pacote de preço cadastrado.</p>`;
    return;
  }
  
  container.innerHTML = estadoActual.precos.pacoteStandard.map((item, index) => `
    <div class="form-group" style="display: flex; gap: 1rem; align-items: flex-end; background: #222; padding: 1rem; border-radius: 4px; border-left: 2px solid #D4AF37; margin-bottom: 1rem;">
      <div style="flex: 2;">
        <label style="font-size: 0.85rem; margin-bottom: 0.25rem; display: block; color: #D4AF37; font-weight: 600;">Nº de Pessoas (Capacidade)</label>
        <input type="number" value="${item.pessoas}" 
               onchange="actualizarPessoasPreco(${index}, this.value)"
               placeholder="Qtd. Pessoas" min="1" style="width: 100%; padding: 0.5rem; background: #2a2a2a; border: 1px solid #3a3a3a; color: #f5f5f0; border-radius: 4px;">
      </div>
      <div style="flex: 3;">
        <label style="font-size: 0.85rem; margin-bottom: 0.25rem; display: block; color: #D4AF37; font-weight: 600;">Valor do Pacote (MT)</label>
        <input type="number" value="${item.valor}" 
               onchange="actualizarValorPreco(${index}, this.value)"
               placeholder="Preço em MT" style="width: 100%; padding: 0.5rem; background: #2a2a2a; border: 1px solid #3a3a3a; color: #f5f5f0; border-radius: 4px;">
      </div>
      <div style="flex-shrink: 0;">
        <button class="btn btn-danger" onclick="removerPacotePreco(${index})" style="height: 38px; padding: 0 1rem; font-size: 0.9rem; font-weight: bold; margin-bottom: 0px;">
          Excluir
        </button>
      </div>
    </div>
  `).join('');
}

/**
 * Actualizar valor de preço
 */
function actualizarValorPreco(index, valor) {
  estadoActual.precos.pacoteStandard[index].valor = parseInt(valor) || 0;
  marcarAlteracoes();
}

/**
 * Actualizar número de pessoas
 */
function actualizarPessoasPreco(index, pessoas) {
  estadoActual.precos.pacoteStandard[index].pessoas = parseInt(pessoas) || 0;
  marcarAlteracoes();
}

/**
 * Remover um pacote de preços
 */
function removerPacotePreco(index) {
  estadoActual.precos.pacoteStandard.splice(index, 1);
  renderizarPrecos();
  marcarAlteracoes();
  mostrarToast('Pacote de preço removido!', 'success');
}

/**
 * Adicionar novo pacote de preços
 */
function adicionarPacotePreco() {
  if (!estadoActual.precos.pacoteStandard) {
    estadoActual.precos.pacoteStandard = [];
  }
  const ultimoPacote = estadoActual.precos.pacoteStandard[estadoActual.precos.pacoteStandard.length - 1];
  const novasPessoas = ultimoPacote ? ultimoPacote.pessoas + 10 : 20;
  const novoValor = ultimoPacote ? ultimoPacote.valor + 1500 : 9000;
  
  estadoActual.precos.pacoteStandard.push({
    pessoas: novasPessoas,
    valor: novoValor,
    moeda: "MT"
  });
  
  renderizarPrecos();
  marcarAlteracoes();
  mostrarToast('Novo pacote de preço adicionado!', 'success');
}

/**
 * Renderizar inclusões do pacote
 */
function renderizarInclusoes() {
  const container = document.getElementById('inclusoesForm');
  if (!container) return;
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
  const historiaEl = document.getElementById('historia');
  const missaoEl = document.getElementById('missao');
  
  if (historiaEl) {
    historiaEl.value = estadoActual.sobre.historia || '';
    historiaEl.addEventListener('input', (e) => {
      estadoActual.sobre.historia = e.target.value;
      marcarAlteracoes();
    });
  }
  
  if (missaoEl) {
    missaoEl.value = estadoActual.sobre.missao || '';
    missaoEl.addEventListener('input', (e) => {
      estadoActual.sobre.missao = e.target.value;
      marcarAlteracoes();
    });
  }
}

/**
 * Renderizar galeria
 */
function renderizarGaleria() {
  const container = document.getElementById('galeriaGrid');
  if (!container) return;
  
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

// ====== SALVAMENTO NO SERVIDOR (AUTOMATIZADO) ======

/**
 * Salva todas as alterações de JSON e imagens directamente no servidor e publica
 */
async function salvarNoServidor() {
  const totalImagens = imagensExistentes.filter(img => !imagensParaRemover.includes(img.id)).length + novasImagens.length;
  
  if (totalImagens === 0) {
    mostrarModal('Erro', 'A galeria não pode ficar vazia. Adicione pelo menos uma foto.');
    return;
  }
  
  mostrarToast('A enviar e a publicar alterações...', 'info');
  
  try {
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
    
    // 2. Converter novas imagens para Base64 no envio
    const novasImagensPayload = [];
    for (let i = 0; i < novasImagens.length; i++) {
      const nova = novasImagens[i];
      const base64 = await fileToBase64(nova.file);
      novasImagensPayload.push({
        filename: nova.filename,
        base64: base64
      });
      
      galeriaFinal.push({
        id: nova.id,
        filename: nova.filename,
        titulo: nova.titulo,
        ordem: imagensExistentes.length + i
      });
    }
    
    // 3. Actualizar meta estado
    estadoActual.meta.totalImagens = galeriaFinal.length;
    estadoActual.meta.ultimaAtualizacao = new Date().toISOString().split('T')[0];
    estadoActual.galeria = galeriaFinal;
    
    // 4. Preparar lista de imagens físicas para apagar
    const deleteImages = [...imagensParaRemover].map(id => {
      const img = imagensExistentes.find(i => i.id === id);
      return img ? img.filename : null;
    }).filter(Boolean);
    
    // 5. Enviar POST ao servidor
    const password = sessionStorage.getItem('lulu_admin_password') || '';
    const response = await fetch('/api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Password': password
      },
      body: JSON.stringify({
        content: estadoActual,
        images: novasImagensPayload,
        deleteImages: deleteImages
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erro HTTP ${response.status}`);
    }
    
    const result = await response.json();
    
    // Sucesso! Atualizar estado local
    imagensExistentes = [...galeriaFinal];
    novasImagens = [];
    imagensParaRemover = [];
    
    alteracoesNaoSalvas = false;
    
    renderizarGaleria();
    mostrarModal('Sucesso!', 'Todas as alterações de conteúdo e imagens foram salvas e publicadas automaticamente no site!');
    
  } catch (erro) {
    console.error('Erro ao salvar no servidor:', erro);
    mostrarModal('Erro ao Salvar', `Não foi possível guardar no servidor: ${erro.message}`);
  }
}

/**
 * Auxiliar para converter ficheiro para Base64 encodado
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const content = reader.result.split(',')[1];
      resolve(content);
    };
    reader.onerror = error => reject(error);
  });
}

// ====== EXPORTAÇÃO ZIP ======

/**
 * Exportar pacote ZIP completo
 */
async function exportarZIP() {
  // Validar galeria
  const totalImagens = imagensExistentes.filter(img => !imagensParaRemover.includes(img.id)).length + novasImagens.length;
  
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
  const totalExistentes = imagensExistentes.filter(img => !imagensParaRemover.includes(img.id)).length;
  const total = totalExistentes + novasImagens.length;
  
  const totalEl = document.getElementById('statImagens');
  const novasEl = document.getElementById('statNovas');
  const removerEl = document.getElementById('statRemover');
  
  if (totalEl) totalEl.textContent = total;
  if (novasEl) novasEl.textContent = novasImagens.length;
  if (removerEl) removerEl.textContent = imagensParaRemover.length;
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
  if (!toast) return;
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
  const modalTitulo = document.getElementById('modalTitulo');
  const modalMsg = document.getElementById('modalMensagem');
  const modal = document.getElementById('modal');
  
  if (modalTitulo) modalTitulo.textContent = titulo;
  if (modalMsg) modalMsg.textContent = mensagem;
  if (modal) modal.classList.add('show');
}

/**
 * Fechar modal
 */
function fecharModal() {
  const modal = document.getElementById('modal');
  if (modal) modal.classList.remove('show');
}

// Exportar funções globalmente para uso nos event handlers inline
window.actualizarValorPreco = actualizarValorPreco;
window.actualizarPessoasPreco = actualizarPessoasPreco;
window.removerPacotePreco = removerPacotePreco;
window.adicionarPacotePreco = adicionarPacotePreco;
window.handleBackupUpload = handleBackupUpload;
window.salvarNoServidor = salvarNoServidor;
window.actualizarInclusao = actualizarInclusao;
window.removerInclusao = removerInclusao;
window.actualizarTitulo = actualizarTitulo;
window.actualizarTituloNova = actualizarTituloNova;
window.marcarParaRemover = marcarParaRemover;
window.removerNova = removerNova;
window.moverImagem = moverImagem;
window.tentarLogin = tentarLogin;
window.verificarCredenciais = verificarCredenciais;

console.log('✅ Admin carregado');
