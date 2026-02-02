# 🎉 Lulú Eventos - Website Oficial

Website profissional para **Lulú Eventos**, empresa especializada em decoração e ornamentação de eventos em Moçambique.

## 📋 Sobre o Projeto

Sistema de website completo com painel administrativo offline para gestão de conteúdo, incluindo galeria de fotos, preços e informações da empresa.

### ✨ Características Principais

- **Design Responsivo** - Adaptado para desktop, tablet e mobile
- **Paleta Elegante** - Preto (#0a0a0a) e Dourado (#D4AF37)
- **Painel Admin Offline** - Gestão de conteúdo sem necessidade de servidor
- **Sistema de Galeria** - Suporta múltiplas fotos com metadata
- **Exportação ZIP** - Workflow profissional admin → técnico → deploy
- **SEO Otimizado** - Meta tags e estrutura semântica

## 🗂️ Estrutura do Projeto

```
lulu-eventos/
├── admin.html              # Painel administrativo
├── index.html              # Página inicial
├── galeria.html            # Galeria de fotos
├── precos.html             # Tabela de preços
├── sobre.html              # Sobre a empresa
├── contacto.html           # Formulário de contato
│
├── css/
│   ├── style.css           # Estilos principais
│   └── animations.css      # Animações e efeitos
│
├── js/
│   ├── data.js             # Sistema de carregamento de dados
│   ├── main.js             # Scripts principais
│   ├── gallery.js          # Funcionalidades da galeria
│   └── admin.js            # Lógica do painel admin
│
├── data/
│   └── content.json        # Conteúdo dinâmico (preços, galeria, textos)
│
├── assets/
│   ├── galeria/            # Fotos dos eventos
│   ├── logo.png
│   ├── logo.svg
│   └── logo-branco.png
│
└── README_ADMIN.md         # Guia de uso do admin
```

## 🚀 Como Usar

### Pré-requisitos

- Servidor web local (Python, PHP, Node.js, ou similar)
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Instalação e Execução

1. **Clone ou baixe o projeto:**
   ```bash
   cd ~/projects
   # Copie a pasta lulu-eventos aqui
   ```

2. **Inicie um servidor local:**

   **Opção 1 - Python:**
   ```bash
   cd lulu-eventos
   python3 -m http.server 8000
   ```

   **Opção 2 - PHP:**
   ```bash
   cd lulu-eventos
   php -S localhost:8000
   ```

   **Opção 3 - Node.js:**
   ```bash
   cd lulu-eventos
   npx http-server -p 8000
   ```

3. **Acesse no navegador:**
   ```
   http://localhost:8000
   ```

### Testando o Sistema

Para verificar se tudo está funcionando:

1. **Teste de Debug:**
   ```
   http://localhost:8000/test-debug.html
   ```
   Esta página mostra o status de todos os componentes.

2. **Verifique cada página:**
   - `index.html` - Deve carregar sem erros
   - `galeria.html` - Deve mostrar as fotos
   - `precos.html` - Deve mostrar os pacotes de preços
   - `sobre.html` - Deve mostrar informações da empresa
   - `contacto.html` - Formulário funcional

## 📊 Sistema de Dados

Todo o conteúdo dinâmico é armazenado em `data/content.json`:

### Estrutura do JSON

```json
{
  "meta": {
    "versao": "1.0",
    "ultimaAtualizacao": "2026-01-31",
    "totalImagens": 12
  },
  "empresa": {
    "nome": "Lulú Eventos",
    "slogan": "Ornamentação para momentos especiais",
    "telefone": "+258865771736",
    "whatsapp": "258865771736",
    "email": "contacto@lulueventos.com",
    "facebook": "@ornamentacaolulu",
    "instagram": "@ornamentacaolulu",
    "endereco": "Moçambique"
  },
  "precos": {
    "pacoteStandard": [
      {"pessoas": 20, "valor": 9000, "moeda": "MT"},
      {"pessoas": 30, "valor": 10500, "moeda": "MT"},
      {"pessoas": 40, "valor": 12000, "moeda": "MT"},
      {"pessoas": 50, "valor": 13500, "moeda": "MT"},
      {"pessoas": 100, "valor": 22000, "moeda": "MT"},
      {"pessoas": 150, "valor": 30000, "moeda": "MT"}
    ],
    "inclusoesPacote": [
      "Mesa de honra",
      "Painel de fotos",
      "Mesa de buffet",
      "Mesinha de bolo",
      "Tapete vermelho",
      "Transporte"
    ]
  },
  "sobre": {
    "titulo": "Sobre Nós",
    "historia": "A Lulú Eventos nasceu da paixão...",
    "missao": "Transformar seus sonhos em realidade..."
  },
  "galeria": [
    {
      "id": "uuid",
      "filename": "img-timestamp.jpg",
      "titulo": "Descrição da foto",
      "ordem": 0
    }
  ]
}
```

## 🔧 Painel Administrativo

O sistema inclui um painel administrativo (`admin.html`) para gestão de conteúdo.

### Funcionalidades do Admin

- ✅ Gerenciar preços e inclusões
- ✅ Editar textos (Sobre, História, Missão)
- ✅ Upload de fotos da galeria
- ✅ Reordenar imagens (↑↓)
- ✅ Renomear e organizar fotos
- ✅ Exportar tudo em ZIP para deploy

### Como Usar o Admin

1. **Acesse:**
   ```
   http://localhost:8000/admin.html
   ```

2. **Escolha:**
   - **Carregar Backup** - Se já tem um `content.json` anterior
   - **Iniciar do Zero** - Para começar com dados padrão

3. **Edite o conteúdo:**
   - **Aba Preços** - Ajuste valores e inclusões
   - **Aba Sobre** - Edite textos institucionais
   - **Aba Galeria** - Adicione/remova/reordene fotos

4. **Exporte:**
   - Clique em "Gerar Pacote ZIP"
   - Baixe o arquivo `lulu-update-YYYY-MM-DD.zip`

5. **Deploy:**
   - Extraia o ZIP
   - Copie `data/content.json` para o servidor
   - Copie fotos de `assets/galeria/` para o servidor

**Documentação completa:** `README_ADMIN.md`

## 📸 Gestão de Fotos

### Adicionar Fotos

1. Vá em `admin.html` → Aba "Galeria"
2. Arraste fotos ou clique para selecionar
3. Edite os títulos conforme necessário
4. Use ↑↓ para reordenar
5. Exporte o ZIP

### Formato Recomendado

- **Formato:** JPG ou PNG
- **Tamanho ideal:** 1200px de largura
- **Peso:** 300-800 KB (use TinyPNG ou similar)
- **Proporção:** Quadrada ou 4:3

### Ferramentas de Otimização

- [TinyPNG](https://tinypng.com) - Compressão online
- [iLoveIMG](https://iloveimg.com) - Redimensionar e otimizar
- Photoshop/GIMP - Edição profissional

## 🎨 Personalização

### Cores

Edite em `css/style.css`:

```css
:root {
  --preto-profundo: #0a0a0a;
  --dourado-metalico: #D4AF37;
  --branco-cream: #f8f8f8;
  --cinza-suave: #1a1a1a;
}
```

### Fontes

Atualmente usando:
- **Display:** Playfair Display (serifada, elegante)
- **Body:** Montserrat (sem serifa, moderna)

Para alterar, edite as importações do Google Fonts nos arquivos HTML.

### Layout

- **Grid da Galeria:** `galeria.html` (linha ~14)
- **Cards de Preço:** `precos.html` (linha ~13)
- **Responsividade:** `css/style.css` (media queries no final)

## 🔍 Troubleshooting

### Problema: Fotos não aparecem na galeria

**Solução:**
```bash
# Verificar se content.json tem galeria preenchida
cat data/content.json | grep -A 5 '"galeria"'

# Verificar se fotos existem
ls -la assets/galeria/
```

### Problema: Preços não carregam

**Solução:**
1. Abrir Console do navegador (F12)
2. Verificar erros em vermelho
3. Testar manualmente:
   ```javascript
   carregarDados().then(d => console.log(d.precos));
   ```

### Problema: Servidor não inicia

**Solução:**
```bash
# Verificar se porta está ocupada
netstat -an | grep 8000

# Usar porta diferente
python3 -m http.server 8001
```

### Problema: Cache do navegador

**Solução:**
- Firefox/Chrome: `Ctrl + Shift + R`
- Safari: `Cmd + Shift + R`
- Ou limpar cache nas configurações

## 📱 Compatibilidade

### Navegadores Suportados

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile (iOS Safari, Chrome Mobile)

### Recursos Utilizados

- CSS Grid & Flexbox
- ES6+ JavaScript
- Fetch API
- IntersectionObserver (lazy loading)
- File API (admin)
- Blob/ZIP (JSZip + FileSaver)

## 📞 Informações de Contato

**Lulú Eventos**
- 📱 Telefone: +258 865771736
- 📧 Email: contacto@lulueventos.com
- 📘 Facebook: @ornamentacaolulu
- 📸 Instagram: @ornamentacaolulu
- 📍 Localização: Maputo, Moçambique

## 🛠️ Stack Tecnológica

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla ES6+)
- **Fontes:** Google Fonts (Playfair Display, Montserrat)
- **Admin:** JSZip 3.10.1, FileSaver.js 2.0.5
- **Servidor:** Qualquer servidor HTTP estático
- **Dados:** JSON (sem banco de dados)

## 📄 Licença

© 2026 Lulú Eventos. Todos os direitos reservados.

## 🔄 Workflow de Atualização

### Para Atualizar Conteúdo

1. **Admin edita** em `admin.html`
2. **Exporta ZIP** com alterações
3. **Envia ZIP** para técnico (WhatsApp, email, etc)
4. **Técnico extrai** e substitui arquivos no servidor
5. **Site atualiza** automaticamente

### Para Atualizar Design/Código

1. Editar arquivos HTML/CSS/JS localmente
2. Testar em servidor local
3. Fazer deploy manual para servidor de produção

## 📚 Documentação Adicional

- **README_ADMIN.md** - Guia completo do painel administrativo
- **GUIA-TESTE.md** - Instruções de teste e troubleshooting
- **test-debug.html** - Página de diagnóstico do sistema

## 🚀 Roadmap Futuro

### Funcionalidades Planejadas

- [ ] Categorização de fotos (Casamentos, Aniversários, etc)
- [ ] Sistema de depoimentos de clientes
- [ ] Integração com Google Sheets (gestão não-técnica)
- [ ] Formulário de orçamento funcional
- [ ] Blog/Notícias
- [ ] Multiidioma (PT-MZ / EN)
- [ ] PWA (Progressive Web App)

### Melhorias Técnicas

- [ ] Compressão de imagens automática
- [ ] Lazy loading de imagens otimizado
- [ ] Cache Service Worker
- [ ] Analytics (Google Analytics ou similar)
- [ ] Sistema de backup automático

---

**Versão:** 1.0  
**Última Atualização:** 31 de Janeiro de 2026  
**Desenvolvido para:** Lulú Eventos, Moçambique

---

## 🆘 Suporte

Para questões técnicas ou suporte, consulte:
1. `test-debug.html` - Diagnóstico automático
2. `GUIA-TESTE.md` - Troubleshooting detalhado
3. Console do navegador (F12) - Logs de erro

**Status Atual do Sistema:**
- ✅ Galeria funcionando (12 fotos)
- ✅ Admin funcionando (export ZIP)
- ✅ Dados estruturados (content.json)
- ⚠️ Preços em correção
- ✅ Mobile responsivo
- ✅ WhatsApp integrado