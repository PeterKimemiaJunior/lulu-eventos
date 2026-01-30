# 🖼️ Sistema de Galeria - Lulú Eventos

## Como Funciona

O sistema de galeria usa **LocalStorage** do navegador para armazenar as fotos em formato Base64. Isso significa:

✅ **Upload fácil** via interface visual  
✅ **Sem necessidade de servidor** para gerenciar fotos  
✅ **Funciona offline** uma vez carregado  
✅ **Deploy simples** na Netlify  

---

## 📸 Como Adicionar Fotos

### Método 1: Arrastar e Soltar (Recomendado)

1. Abra `admin.html` no navegador
2. Vá até a seção **"🖼️ Galeria de Fotos"**
3. **Arraste suas fotos** para a área indicada
4. Pronto! As fotos são adicionadas instantaneamente

### Método 2: Selecionar Arquivos

1. Abra `admin.html` no navegador
2. Clique na área de upload
3. Selecione as fotos do seu computador
4. Clique em "Abrir"

**Formatos aceitos:** JPG, PNG, WebP  
**Tamanho recomendado:** Até 2MB por foto (para melhor performance)

---

## 🗑️ Gerenciar Fotos

### Remover Foto Individual
- Passe o mouse sobre a foto no painel admin
- Clique no botão **×** vermelho que aparece
- Confirme a remoção

### Limpar Toda Galeria
- Clique no botão **"🗑️ Limpar Galeria"**
- Confirme duas vezes (segurança)
- Todas as fotos serão removidas

---

## 🚀 Como as Fotos Aparecem no Site

### Localmente (seu computador):

1. Adicione fotos via `admin.html`
2. Abra qualquer página do site (`index.html`, `galeria.html`, etc.)
3. As fotos aparecerão automaticamente!

### Online (Netlify):

As fotos ficam armazenadas no **código JavaScript** (Base64), então:

1. Faça upload da pasta completa para Netlify
2. As fotos vão junto automaticamente
3. Tudo funciona normalmente online!

---

## 💾 Onde as Fotos Ficam Armazenadas?

As fotos são armazenadas em:
- **Navegador:** `localStorage` (chave: `lulu_gallery`)
- **Código:** Arquivo `js/gallery.js` carrega do localStorage

**IMPORTANTE:** As fotos ficam salvas **no navegador onde você fez o upload**. Se limpar cache do navegador ou usar outro computador, as fotos não aparecerão.

### Solução para Múltiplos Dispositivos:

Sempre use o **mesmo navegador** no mesmo computador para gerenciar a galeria, OU:

1. Faça backup exportando regularmente (botão "Exportar Tudo")
2. Mantenha as fotos originais em uma pasta segura
3. Re-upload se trocar de navegador/computador

---

## 🎨 Personalização (Futuro)

Atualmente todas as fotos estão em **uma única categoria**. No futuro, para separar por tipo de evento:

1. Edite `js/gallery.js`
2. Modifique a propriedade `category` das imagens
3. Descomente os filtros em `galeria.html`

Categorias disponíveis:
- `casamento`
- `aniversario`
- `corporativo`
- `baptizado`
- `churrasco`

---

## ⚠️ Limitações do LocalStorage

### Limite de Tamanho:
- Navegadores limitam localStorage a ~5-10MB
- Com fotos em Base64, isso equivale a aproximadamente **30-50 fotos** (dependendo do tamanho)

### Soluções se Atingir o Limite:

1. **Comprima as fotos** antes do upload:
   - Use [TinyPNG](https://tinypng.com)
   - Redimensione para máximo 1200px de largura
   
2. **Mantenha apenas fotos essenciais** na galeria

3. **Rotacione as fotos** periodicamente (remova antigas, adicione novas)

---

## 🔧 Troubleshooting

### "As fotos não aparecem no site"
- Verifique se está usando o **mesmo navegador** onde fez upload
- Abra o console (F12) e veja se há erros
- Tente recarregar a página (Ctrl+F5)

### "Erro ao adicionar foto"
- Verifique o tamanho do arquivo (máx 2-3MB recomendado)
- Confirme que é um arquivo de imagem válido
- Tente comprimir a foto primeiro

### "Atingi o limite de armazenamento"
- Remova fotos antigas
- Comprima as fotos antes de fazer upload
- Considere reduzir a quantidade de fotos na galeria

---

## 📱 Uso Mobile

O sistema funciona perfeitamente em tablets/celulares:

1. Abra `admin.html` no navegador mobile
2. Use o botão de "Selecionar arquivos"
3. Escolha fotos da galeria do celular
4. Upload instantâneo!

---

## 💡 Dicas de Otimização

### Antes de Fazer Upload:

1. **Redimensione** para 1200-1600px de largura (máximo)
2. **Comprima** usando ferramentas online
3. **Renomeie** com nomes descritivos (ex: `casamento-mesa-honra.jpg`)
4. **Converta** para WebP se possível (menor tamanho)

### Ferramentas Recomendadas:

- [TinyPNG](https://tinypng.com) - Compressão PNG/JPG
- [Squoosh](https://squoosh.app) - Compressão e conversão
- [iLoveIMG](https://www.iloveimg.com/resize-image) - Redimensionar

---

## ✅ Checklist de Galeria

- [ ] Fotos comprimidas (< 500KB cada)
- [ ] Fotos redimensionadas (1200px largura)
- [ ] Nomes descritivos nos arquivos
- [ ] Upload via admin.html
- [ ] Testado localmente
- [ ] Pronto para deploy!

---

**🎉 Galeria configurada e pronta para uso!**

Para dúvidas, consulte o README.md principal ou o GUIA_RAPIDO.md.