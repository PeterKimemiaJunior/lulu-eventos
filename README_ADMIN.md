# 🎨 Painel de Administração - Lulú Eventos

## 📋 Como Funciona o Sistema

Este sistema permite que um **administrador sem conhecimentos técnicos** gerencie todo o conteúdo do site (preços, textos e fotos) através de uma interface visual simples, gerando um pacote ZIP para enviar ao técnico.

### Fluxo Completo:

```
1. Admin abre admin.html no navegador/celular
2. Carrega backup atual OU inicia do zero
3. Edita preços, textos e fotos
4. Clica "Gerar Pacote ZIP"
5. Envia o arquivo .zip ao técnico via WhatsApp
6. Técnico descompacta o ZIP na pasta do site
7. Site actualizado automaticamente!
```

---

## 🚀 Como Usar o Painel Admin

### Primeira Vez:

1. **Abra o arquivo `admin.html`** no navegador
   - Pode ser no computador ou celular
   - Funciona offline (sem internet)

2. **Escolha uma opção:**
   - **"Carregar Backup"**: Se já tem um arquivo `content.json` anterior
   - **"Iniciar do Zero"**: Para começar com dados padrão

3. **Pronto!** Agora pode editar tudo

---

## 📝 Guia das Abas

### 💰 Aba "Preços"

**O que fazer aqui:**
- Editar valores para cada quantidade de pessoas
- Adicionar/remover itens incluídos no pacote

**Como editar:**
1. Digite o novo valor no campo
2. As alterações são automáticas
3. Para inclusões: clique "+ Adicionar" para novo item
4. Clique "Remover" para apagar item

**Exemplo:**
```
20 Pessoas → 9000 MT
30 Pessoas → 10500 MT
(etc...)

Inclusões:
✓ Mesa de honra
✓ Painel de fotos
✓ Mesa de buffet
```

---

### ℹ️ Aba "Sobre"

**O que fazer aqui:**
- Escrever/editar a história da empresa
- Escrever/editar a missão da empresa

**Dicas:**
- Escreva de forma natural, como se estivesse a conversar
- A história pode ter 2-3 parágrafos
- A missão deve ser 1-2 frases curtas

---

### 🖼️ Aba "Galeria" (PRINCIPAL)

Esta é a aba mais importante! Aqui gere todas as fotos do site.

#### Como Adicionar Fotos:

**Opção 1: Arrastar e Soltar**
1. Tire fotos no celular ou tenha-as no computador
2. Arraste as fotos para a área marcada
3. Pronto! Fotos adicionadas

**Opção 2: Seleccionar**
1. Clique na área de upload
2. Seleccione as fotos
3. Clique "Abrir"

#### Gerir Fotos:

Cada foto tem:
- **Campo "Título"**: Descreva brevemente a foto
- **Botões ↑ ↓**: Mudar ordem (primeira foto aparece primeiro no site)
- **Botão "Remover"**: Marcar para apagar (fica vermelha)

**IMPORTANTE:**
- Fotos novas têm badge verde "NOVO"
- Fotos marcadas para remover ficam vermelhas
- As alterações só acontecem quando exportar o ZIP!

---

## 💾 Como Exportar (Gerar o Pacote)

### Quando estiver pronto:

1. **Reveja tudo**:
   - Verifique os preços
   - Leia os textos
   - Veja as fotos

2. **Veja as estatísticas no topo**:
   - Total de imagens
   - Novas para adicionar
   - Marcadas para remover

3. **Clique "Gerar Pacote ZIP"**

4. **O sistema vai:**
   - Validar (precisa ter pelo menos 1 foto!)
   - Criar arquivo `lulu-update-2024-01-31.zip`
   - Fazer download automático

5. **Envie o ZIP ao técnico**:
   - Por WhatsApp: +258 865771736
   - Ou por email

---

## 📱 Usar no Celular

O painel funciona perfeitamente no celular!

### Tirar e Adicionar Fotos:

1. Abra `admin.html` no navegador do celular
2. Vá à aba "Galeria"
3. Clique na área de upload
4. Escolha "Câmara" ou "Galeria"
5. Tire fotos ou seleccione existentes
6. Pronto!

### Dicas Mobile:
- Use Chrome ou Safari
- Mantenha o celular na horizontal para melhor visualização
- Os botões são grandes para facilitar o toque

---

## 🔧 Para o Técnico

### Como Actualizar o Site:

1. **Receber o arquivo ZIP** do admin

2. **Descompactar** o arquivo

3. **Substituir arquivos**:
   ```
   Conteúdo do ZIP:
   ├── data/content.json     → Substituir em /data/
   └── assets/galeria/       → Substituir fotos em /assets/galeria/
       ├── img-xxx.jpg
       ├── img-yyy.jpg
       └── ...
   ```

4. **Fazer upload** para o servidor

5. **Testar** o site

6. **Confirmar** ao admin que está actualizado

---

## ⚠️ Avisos Importantes

### ✅ FAÇA:
- Sempre adicione pelo menos 1 foto
- Escreva títulos descritivos nas fotos
- Revise tudo antes de exportar
- Guarde o arquivo ZIP como backup

### ❌ NÃO FAÇA:
- Não feche o navegador sem exportar (perde as alterações!)
- Não adicione fotos muito pesadas (máx 5MB cada)
- Não deixe campos de preço vazios

---

## 💡 Dicas e Truques

### Optimizar Fotos Antes de Adicionar:

**No Celular:**
- Tire fotos com boa iluminação
- Use modo HDR se disponível
- Evite zoom digital (aproxime-se fisicamente)

**No Computador:**
- Use ferramentas gratuitas:
  - [TinyPNG](https://tinypng.com) - comprimir
  - [iLoveIMG](https://www.iloveimg.com/pt/redimensionar-imagem) - redimensionar
- Tamanho ideal: 1200px de largura
- Peso ideal: 300-800KB por foto

### Organizar Fotos:

Organize por tipo de evento:
1. Adicione primeiro fotos de casamentos
2. Depois aniversários
3. Depois eventos corporativos
4. Por último baptizados

Use os botões ↑ ↓ para ordenar!

### Bons Títulos de Fotos:

❌ Mau: "foto1", "IMG_001"
✅ Bom: "Casamento mesa dourada", "Aniversário tema princesa"

---

## 🆘 Resolução de Problemas

### "Erro ao gerar ZIP"
**Solução**: Verifique se tem pelo menos 1 foto na galeria

### "Nada acontece ao clicar Exportar"
**Solução**: 
1. Aguarde alguns segundos (pode demorar se tiver muitas fotos)
2. Verifique se o bloqueador de pop-ups está desactivado

### "Foto não aparece"
**Solução**:
1. Verifique se é imagem válida (JPG, PNG, WebP)
2. Tente comprimir a foto primeiro
3. Tamanho máximo recomendado: 5MB

### "Perdi as alterações"
**Solução**:
- As alterações só são salvas no ZIP exportado
- Se fechou o navegador sem exportar, precisa refazer
- **SEMPRE EXPORTE** antes de fechar!

---

## 📞 Suporte

**Dúvidas Técnicas:**
- WhatsApp: +258 865771736
- Email: contacto@lulueventos.com

**Tutoriais em Vídeo:**
(Em breve disponíveis no canal YouTube)

---

## ✅ Checklist Antes de Exportar

- [ ] Todos os preços estão correctos
- [ ] Textos revisados (sem erros)
- [ ] Fotos com títulos descritivos
- [ ] Pelo menos 5-10 fotos na galeria
- [ ] Fotos ordenadas correctamente
- [ ] Inclusões do pacote actualizadas
- [ ] Revisei as estatísticas no topo
- [ ] Pronto para exportar!

---

**🎉 Parabéns! Agora já sabe gerir todo o conteúdo do site sozinho!**

Qualquer dúvida, não hesite em contactar o suporte técnico.

---

*Última actualização: Janeiro 2024*
*Versão do Sistema: 1.0*