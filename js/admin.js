// ============================================
// LULÚ EVENTOS - PAINEL DE ADMINISTRAÇÃO
// Sistema simplificado para edição de conteúdo
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🔧 Painel de administração carregado');
  loadAdminData();
  setupEventListeners();
  initGalleryUpload();
});

// ============================================
// CARREGAR DADOS NO PAINEL
// ============================================
async function loadAdminData() {
  try {
    const data = await dataManager.fetchData();
    
    // Preencher formulários
    populateEmpresaForm(data.empresa);
    populateContactosForm(data.contactos);
    populateEstatisticasForm(data.estatisticas);
    populatePrecosTable(data.precos);
    populateServicosForm(data.servicos_incluidos);
    populateSobreForm(data.sobre);
    
    console.log('✅ Dados carregados no painel');
  } catch (error) {
    console.error('❌ Erro ao carregar dados:', error);
    showNotification('Erro ao carregar dados', 'error');
  }
}

// ============================================
// PREENCHER FORMULÁRIOS
// ============================================
function populateEmpresaForm(empresa) {
  document.getElementById('empresa_nome').value = empresa.nome || '';
  document.getElementById('empresa_slogan').value = empresa.slogan || '';
  document.getElementById('empresa_descricao').value = empresa.descricao || '';
}

function populateContactosForm(contactos) {
  document.getElementById('telefone').value = contactos.telefone || '';
  document.getElementById('whatsapp').value = contactos.whatsapp || '';
  document.getElementById('email').value = contactos.email || '';
  document.getElementById('facebook').value = contactos.facebook || '';
  document.getElementById('instagram').value = contactos.instagram || '';
}

function populateEstatisticasForm(stats) {
  document.getElementById('eventos_realizados').value = stats.eventos_realizados || 0;
  document.getElementById('anos_experiencia').value = stats.anos_experiencia || 0;
  document.getElementById('clientes_satisfeitos').value = stats.clientes_satisfeitos || 0;
}

function populatePrecosTable(precos) {
  const tbody = document.getElementById('precosTableBody');
  tbody.innerHTML = precos.map((p, index) => `
    <tr>
      <td><input type="number" value="${p.pessoas}" data-index="${index}" data-field="pessoas"></td>
      <td><input type="number" value="${p.preco}" data-index="${index}" data-field="preco"></td>
      <td><input type="text" value="${p.categoria}" data-index="${index}" data-field="categoria"></td>
      <td><button onclick="removePreco(${index})" class="btn-remove">Remover</button></td>
    </tr>
  `).join('');
}

function populateServicosForm(servicos) {
  const container = document.getElementById('servicosList');
  container.innerHTML = servicos.map((s, index) => `
    <div class="servico-item">
      <input type="text" value="${s}" data-index="${index}" placeholder="Serviço incluído">
      <button onclick="removeServico(${index})" class="btn-remove">Remover</button>
    </div>
  `).join('');
}

function populateSobreForm(sobre) {
  document.getElementById('historia').value = sobre.historia || '';
  document.getElementById('missao').value = sobre.missao || '';
  
  const valoresContainer = document.getElementById('valoresList');
  valoresContainer.innerHTML = sobre.valores.map((v, index) => `
    <div class="valor-item">
      <input type="text" value="${v}" data-index="${index}" placeholder="Valor">
      <button onclick="removeValor(${index})" class="btn-remove">Remover</button>
    </div>
  `).join('');
}

// ============================================
// SETUP EVENT LISTENERS
// ============================================
function setupEventListeners() {
  // Botão de exportar
  document.getElementById('exportBtn').addEventListener('click', exportConfig);
  
  // Botão de adicionar preço
  document.getElementById('addPrecoBtn').addEventListener('click', addNovoPreco);
  
  // Botão de adicionar serviço
  document.getElementById('addServicoBtn').addEventListener('click', addNovoServico);
  
  // Botão de adicionar valor
  document.getElementById('addValorBtn').addEventListener('click', addNovoValor);
  
  // Preview do site
  document.getElementById('previewBtn').addEventListener('click', () => {
    window.open('index.html', '_blank');
  });
  
  // Limpar galeria
  document.getElementById('clearGalleryBtn').addEventListener('click', clearGallery);
}

// ============================================
// ADICIONAR NOVOS ITENS
// ============================================
function addNovoPreco() {
  const tbody = document.getElementById('precosTableBody');
  const index = tbody.children.length;
  
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td><input type="number" value="0" data-index="${index}" data-field="pessoas"></td>
    <td><input type="number" value="0" data-index="${index}" data-field="preco"></td>
    <td><input type="text" value="standard" data-index="${index}" data-field="categoria"></td>
    <td><button onclick="removePreco(${index})" class="btn-remove">Remover</button></td>
  `;
  
  tbody.appendChild(newRow);
  showNotification('Novo preço adicionado', 'success');
}

function addNovoServico() {
  const container = document.getElementById('servicosList');
  const index = container.children.length;
  
  const newServico = document.createElement('div');
  newServico.className = 'servico-item';
  newServico.innerHTML = `
    <input type="text" value="" data-index="${index}" placeholder="Novo serviço">
    <button onclick="removeServico(${index})" class="btn-remove">Remover</button>
  `;
  
  container.appendChild(newServico);
  showNotification('Novo serviço adicionado', 'success');
}

function addNovoValor() {
  const container = document.getElementById('valoresList');
  const index = container.children.length;
  
  const newValor = document.createElement('div');
  newValor.className = 'valor-item';
  newValor.innerHTML = `
    <input type="text" value="" data-index="${index}" placeholder="Novo valor">
    <button onclick="removeValor(${index})" class="btn-remove">Remover</button>
  `;
  
  container.appendChild(newValor);
  showNotification('Novo valor adicionado', 'success');
}

// ============================================
// REMOVER ITENS
// ============================================
function removePreco(index) {
  const tbody = document.getElementById('precosTableBody');
  tbody.children[index].remove();
  showNotification('Preço removido', 'success');
}

function removeServico(index) {
  const container = document.getElementById('servicosList');
  container.children[index].remove();
  showNotification('Serviço removido', 'success');
}

function removeValor(index) {
  const container = document.getElementById('valoresList');
  container.children[index].remove();
  showNotification('Valor removido', 'success');
}

// ============================================
// EXPORTAR CONFIGURAÇÃO
// ============================================
function exportConfig() {
  try {
    // Coletar todos os dados dos formulários
    const configData = {
      empresa: {
        nome: document.getElementById('empresa_nome').value,
        slogan: document.getElementById('empresa_slogan').value,
        descricao: document.getElementById('empresa_descricao').value
      },
      contactos: {
        telefone: document.getElementById('telefone').value,
        whatsapp: document.getElementById('whatsapp').value,
        email: document.getElementById('email').value,
        facebook: document.getElementById('facebook').value,
        instagram: document.getElementById('instagram').value
      },
      estatisticas: {
        eventos_realizados: parseInt(document.getElementById('eventos_realizados').value),
        anos_experiencia: parseInt(document.getElementById('anos_experiencia').value),
        clientes_satisfeitos: parseInt(document.getElementById('clientes_satisfeitos').value)
      },
      precos: collectPrecosData(),
      servicos_incluidos: collectServicosData(),
      sobre: {
        historia: document.getElementById('historia').value,
        missao: document.getElementById('missao').value,
        valores: collectValoresData()
      },
      depoimentos: dataManager.data.depoimentos, // Manter depoimentos
      categorias_galeria: dataManager.data.categorias_galeria // Manter categorias
    };
    
    // Criar arquivo JSON
    const dataStr = JSON.stringify(configData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    // Download automático
    const link = document.createElement('a');
    link.href = url;
    link.download = 'content.json';
    link.click();
    
    URL.revokeObjectURL(url);
    
    showNotification('Configuração exportada com sucesso!', 'success');
    
    // Mostrar instruções
    showInstructions();
    
  } catch (error) {
    console.error('Erro ao exportar:', error);
    showNotification('Erro ao exportar configuração', 'error');
  }
}

function collectPrecosData() {
  const inputs = document.querySelectorAll('#precosTableBody input');
  const precos = [];
  const rows = document.querySelectorAll('#precosTableBody tr');
  
  rows.forEach(row => {
    const inputsInRow = row.querySelectorAll('input');
    precos.push({
      pessoas: parseInt(inputsInRow[0].value) || 0,
      preco: parseInt(inputsInRow[1].value) || 0,
      categoria: inputsInRow[2].value || 'standard'
    });
  });
  
  return precos;
}

function collectServicosData() {
  const inputs = document.querySelectorAll('#servicosList input');
  return Array.from(inputs).map(input => input.value).filter(v => v.trim() !== '');
}

function collectValoresData() {
  const inputs = document.querySelectorAll('#valoresList input');
  return Array.from(inputs).map(input => input.value).filter(v => v.trim() !== '');
}

// ============================================
// NOTIFICAÇÕES
// ============================================
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function showInstructions() {
  const modal = document.getElementById('instructionsModal');
  modal.style.display = 'flex';
}

function closeInstructions() {
  const modal = document.getElementById('instructionsModal');
  modal.style.display = 'none';
}

// Exportar funções globais
window.removePreco = removePreco;
window.removeServico = removeServico;
window.removeValor = removeValor;
window.closeInstructions = closeInstructions;

// ============================================
// GESTÃO DA GALERIA DE FOTOS
// ============================================
function initGalleryUpload() {
  const uploadArea = document.getElementById('uploadArea');
  const imageUpload = document.getElementById('imageUpload');
  const galleryGridAdmin = document.getElementById('galleryGridAdmin');
  
  // Carregar galeria existente
  loadGalleryPreview();
  
  // Click para abrir seletor de arquivos
  uploadArea.addEventListener('click', () => {
    imageUpload.click();
  });
  
  // Upload de arquivos
  imageUpload.addEventListener('change', handleFileSelect);
  
  // Drag & Drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });
  
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });
  
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  });
}

function handleFileSelect(e) {
  const files = e.target.files;
  handleFiles(files);
}

function handleFiles(files) {
  if (!files || files.length === 0) return;
  
  let processed = 0;
  const total = files.length;
  
  Array.from(files).forEach((file, index) => {
    if (!file.type.startsWith('image/')) {
      console.warn('Arquivo ignorado (não é imagem):', file.name);
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const imageData = e.target.result;
      
      // Adicionar à galeria
      addImageToGallery(imageData, file.name);
      
      processed++;
      if (processed === total) {
        showNotification(`${processed} foto(s) adicionada(s) com sucesso!`, 'success');
        document.getElementById('imageUpload').value = ''; // Limpar input
      }
    };
    
    reader.readAsDataURL(file);
  });
}

function addImageToGallery(imageData, filename) {
  // Carregar galeria atual
  let gallery = [];
  const stored = localStorage.getItem('lulu_gallery');
  if (stored) {
    try {
      gallery = JSON.parse(stored);
    } catch (e) {
      console.error('Erro ao carregar galeria:', e);
    }
  }
  
  // Gerar ID único
  const newId = gallery.length > 0 ? Math.max(...gallery.map(img => img.id)) + 1 : 1;
  
  // Criar novo item
  const newImage = {
    id: newId,
    category: 'geral',
    src: imageData, // Base64 data URL
    alt: filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '), // Nome do arquivo como alt
    filename: filename
  };
  
  gallery.push(newImage);
  
  // Salvar no localStorage
  localStorage.setItem('lulu_gallery', JSON.stringify(gallery));
  
  // Atualizar preview
  loadGalleryPreview();
}

function loadGalleryPreview() {
  const galleryGridAdmin = document.getElementById('galleryGridAdmin');
  const photoCount = document.getElementById('photoCount');
  
  // Carregar do localStorage
  let gallery = [];
  const stored = localStorage.getItem('lulu_gallery');
  if (stored) {
    try {
      gallery = JSON.parse(stored);
    } catch (e) {
      console.error('Erro ao carregar galeria:', e);
    }
  }
  
  // Atualizar contador
  photoCount.textContent = gallery.length;
  
  // Renderizar grid
  if (gallery.length === 0) {
    galleryGridAdmin.innerHTML = '<p style="opacity: 0.6; text-align: center; grid-column: 1/-1;">Nenhuma foto adicionada ainda</p>';
    return;
  }
  
  galleryGridAdmin.innerHTML = gallery.map(img => `
    <div class="gallery-item-admin">
      <img src="${img.src}" alt="${img.alt}">
      <button class="delete-btn" onclick="removeImageFromGallery(${img.id})" title="Remover foto">×</button>
    </div>
  `).join('');
}

function removeImageFromGallery(id) {
  if (!confirm('Tem certeza que deseja remover esta foto?')) return;
  
  // Carregar galeria
  let gallery = [];
  const stored = localStorage.getItem('lulu_gallery');
  if (stored) {
    try {
      gallery = JSON.parse(stored);
    } catch (e) {
      console.error('Erro ao carregar galeria:', e);
      return;
    }
  }
  
  // Remover imagem
  gallery = gallery.filter(img => img.id !== id);
  
  // Salvar
  localStorage.setItem('lulu_gallery', JSON.stringify(gallery));
  
  // Atualizar preview
  loadGalleryPreview();
  
  showNotification('Foto removida com sucesso', 'success');
}

// Exportar função global
window.removeImageFromGallery = removeImageFromGallery;

function clearGallery() {
  if (!confirm('⚠️ ATENÇÃO: Isso vai remover TODAS as fotos da galeria. Tem certeza?')) return;
  
  if (!confirm('Última confirmação: Deseja realmente apagar todas as fotos?')) return;
  
  localStorage.removeItem('lulu_gallery');
  loadGalleryPreview();
  showNotification('Galeria limpa com sucesso', 'success');
}

console.log('🎛️ Admin.js carregado!');