// ============================================
// LULÚ EVENTOS - CARREGAMENTO DE DADOS
// Sistema simplificado para carregar content.json
// ============================================

let dadosCache = null;

/**
 * Carrega os dados do arquivo content.json
 * @returns {Promise<Object>} Dados do site
 */
async function carregarDados() {
  // Retornar cache se já carregado
  if (dadosCache) {
    return dadosCache;
  }

  try {
    const response = await fetch('./data/content.json');
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    dadosCache = await response.json();
    console.log('✅ Dados carregados com sucesso');
    return dadosCache;
    
  } catch (erro) {
    console.error('❌ Erro ao carregar dados:', erro);
    
    // Dados mínimos de fallback
    return {
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
          {"pessoas": 20, "valor": 9000, "moeda": "MT"},
          {"pessoas": 50, "valor": 13500, "moeda": "MT"},
          {"pessoas": 100, "valor": 22000, "moeda": "MT"}
        ],
        inclusoesPacote: [
          "Mesa de honra",
          "Painel de fotos",
          "Mesa de buffet",
          "Transporte"
        ]
      },
      sobre: {
        titulo: "Sobre Nós",
        historia: "Especialistas em decoração de eventos.",
        missao: "Transformar seus sonhos em realidade."
      },
      galeria: []
    };
  }
}

/**
 * Formata valor em Meticais
 * @param {number} valor 
 * @returns {string}
 */
function formatarPreco(valor) {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'decimal',
    minimumFractionDigits: 0
  }).format(valor) + ' MT';
}

/**
 * Cria link do WhatsApp
 * @param {string} numero 
 * @param {string} mensagem 
 * @returns {string}
 */
function criarLinkWhatsApp(numero, mensagem = '') {
  const numeroLimpo = numero.replace(/\D/g, '');
  const mensagemCodificada = encodeURIComponent(mensagem);
  return `https://wa.me/${numeroLimpo}?text=${mensagemCodificada}`;
}

/**
 * Abre WhatsApp com mensagem padrão
 */
async function abrirWhatsApp(mensagem = 'Olá! Gostaria de solicitar um orçamento.') {
  try {
    const dados = await carregarDados();
    const link = criarLinkWhatsApp(dados.empresa.whatsapp, mensagem);
    window.open(link, '_blank');
  } catch (erro) {
    console.error('Erro ao abrir WhatsApp:', erro);
  }
}

// Exportar funções globalmente
window.carregarDados = carregarDados;
window.formatarPreco = formatarPreco;
window.criarLinkWhatsApp = criarLinkWhatsApp;
window.abrirWhatsApp = abrirWhatsApp;

console.log('📊 Sistema de dados inicializado');