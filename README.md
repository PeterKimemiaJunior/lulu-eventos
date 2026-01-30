# Lulú Eventos - Website

Website de ornamentação e decoração de eventos.

## Estrutura de Edição

### Para editar conteúdo (Admin Leigo):

1. Abra o arquivo `data/content.json` em qualquer editor de texto
2. Edite os preços, textos e informações de contacto
3. Salve o arquivo

### Para adicionar fotos:

1. Coloque as imagens na pasta `assets/galeria/` na subpasta correspondente:
   - `casamentos/` - Fotos de casamentos
   - `aniversarios/` - Fotos de aniversários
   - `baptizados/` - Fotos de baptizados
   - `corporativos/` - Eventos corporativos
   - `churrascos/` - Churrasco e eventos informais

2. Renomeie as fotos de forma simples: foto1.jpg, foto2.jpg, etc.

### Cores do Tema (Não alterar sem conhecimento):

- Dourado: #D4AF37
- Preto: #0a0a0a
- Branco/Creme: #f5f5f0

## Deploy na Netlify

Arraste a pasta inteira para https://app.netlify.com/drop

# 🎨 Lulú Eventos - Website Oficial

Website profissional para a **Lulú Eventos**, empresa especializada em decoração de eventos de luxo em Moçambique.

## 📋 Sobre o Projeto

Site desenvolvido com tecnologias web modernas (HTML5, CSS3, JavaScript vanilla) com foco em:

- ✨ Design sofisticado e elegante (preto, dourado, creme)
- 📱 100% Responsivo (mobile-first)
- ⚡ Performance otimizada
- 🎯 SEO configurado para Moçambique
- 🔧 Sistema de edição simplificado

## 🚀 Como Fazer Deploy na Netlify

### Opção 1: Arrastar e Soltar (Mais Fácil)

1. Acesse [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Arraste a pasta `lulu-eventos` completa para a área indicada
3. Aguarde o upload completar
4. Seu site estará online em segundos!

### Opção 2: Conectar com GitHub

1. Faça upload do projeto para um repositório GitHub
2. Conecte sua conta Netlify ao GitHub
3. Selecione o repositório
4. Deploy automático configurado!

## 📝 Como Editar o Conteúdo do Site

### Método 1: Painel Admin Local (Recomendado)

1. **Abra o arquivo `admin.html`** no seu navegador
   - Clique duas vezes no arquivo
   - Ou clique com botão direito → "Abrir com" → Seu navegador

2. **Edite os campos desejados:**
   - Informações da empresa
   - Telefones e redes sociais
   - Preços (adicione ou remova linhas)
   - Serviços incluídos
   - Texto sobre a empresa

3. **Clique em "Exportar config.json"**
   - O arquivo será baixado automaticamente

4. **Substitua o arquivo antigo:**
   - Vá até a pasta `data/`
   - Substitua o `content.json` pelo novo arquivo baixado

5. **Faça upload na Netlify:**
   - Entre no painel da Netlify
   - Vá em "Deploys" → "Drag and drop"
   - Arraste a pasta `lulu-eventos` atualizada

### Método 2: Editar JSON Diretamente

Abra o arquivo `data/content.json` em qualquer editor de texto e edite os valores:

```json
{
  "empresa": {
    "nome": "Lulú Eventos",
    "slogan": "Seu novo slogan aqui"
  },
  "contactos": {
    "telefone": "+258 865771736",
    "whatsapp": "258865771736"
  }
}
```

**⚠️ IMPORTANTE:** Mantenha a estrutura do JSON (aspas, vírgulas, chaves)

### Método 3: Google Sheets (Avançado)

Para editar pelo celular usando o app do Google Sheets:

1. **Configure o Google Sheets:**
   - Crie uma planilha com as colunas: `campo`, `valor`
   - Preencha com seus dados
   - Vá em "Arquivo" → "Compartilhar" → "Publicar na Web"
   - Selecione "Valores separados por vírgula (.csv)"
   - Copie o link gerado

2. **Conecte ao site:**
   - Abra o arquivo `js/data.js`
   - Encontre a linha `useGoogleSheets: false`
   - Mude para `useGoogleSheets: true`
   - Cole o link do Sheets em `googleSheetsURL`

3. **Edite pelo celular:**
   - Abra o app Google Sheets
   - Edite os valores
   - As mudanças aparecem automaticamente em até 5 minutos!

## 🖼️ Como Adicionar Fotos na Galeria

1. **Organize suas fotos:**

   ```
   assets/galeria/
   ├── casamento/
   │   ├── img1.jpg
   │   ├── img2.jpg
   │   └── img3.jpg
   ├── aniversario/
   │   └── ...
   ├── corporativo/
   │   └── ...
   └── baptizado/
       └── ...
   ```

2. **Edite o arquivo de configuração:**
   - Abra `js/gallery.js`
   - Encontre a seção `GALLERY_CONFIG`
   - Adicione suas imagens seguindo o padrão:

   ```javascript
   {
     id: 17,
     category: 'casamento',
     src: 'assets/galeria/casamento/img5.jpg',
     alt: 'Descrição da foto'
   }
   ```

3. **Otimize as imagens (Recomendado):**
   - Use ferramentas online como [TinyPNG](https://tinypng.com)
   - Redimensione para máximo 1920px de largura
   - Mantenha qualidade entre 70-85%

## 📞 Informações de Contacto

**Telefone:** +258 865771736  
**WhatsApp:** 258865771736  
**Facebook:** @ornamentacaolulu  
**Instagram:** @ornamentacaolulu

## 🛠️ Estrutura do Projeto

```
lulu-eventos/
├── index.html              # Página inicial
├── galeria.html            # Galeria de fotos
├── precos.html             # Tabela de preços
├── sobre.html              # Sobre a empresa
├── contacto.html           # Página de contacto
├── admin.html              # Painel de administração
├── css/
│   ├── style.css           # Estilos principais
│   └── animations.css      # Animações e efeitos
├── js/
│   ├── main.js             # JavaScript principal
│   ├── data.js             # Gerenciamento de dados
│   ├── gallery.js          # Funcionalidades da galeria
│   └── admin.js            # Painel admin
├── assets/
│   ├── logo.jpg            # Logo da empresa
│   └── galeria/            # Fotos dos eventos
└── data/
    └── content.json        # Dados do site (EDITE AQUI!)
```

## 🎨 Cores do Site

Você pode mudar as cores editando o arquivo `css/style.css`:

```css
:root {
  --preto-profundo: #0a0a0a; /* Fundo principal */
  --dourado-metalico: #d4af37; /* Cor de destaque */
  --branco-cream: #f5f5f0; /* Texto principal */
}
```

## ✅ Checklist de Deploy

- [ ] Editei as informações de contacto
- [ ] Atualizei os preços
- [ ] Adicionei fotos na galeria
- [ ] Testei o site localmente (abri index.html no navegador)
- [ ] Verifiquei se todos os links funcionam
- [ ] Fiz upload na Netlify
- [ ] Testei o site online
- [ ] Compartilhei o link nas redes sociais!

## 🆘 Problemas Comuns

### As imagens não aparecem

- Verifique se os nomes dos arquivos estão corretos
- Certifique-se de que as fotos estão nas pastas corretas
- Extensões devem ser `.jpg`, `.jpeg`, `.png` ou `.webp`

### Meu JSON deu erro

- Use um validador JSON online: [jsonlint.com](https://jsonlint.com)
- Verifique vírgulas, aspas e chaves
- Ou use o painel admin.html que faz isso automaticamente!

### O site não atualiza

- Limpe o cache do navegador (Ctrl+Shift+Delete ou Cmd+Shift+Delete)
- Na Netlify, force um novo deploy
- Aguarde até 5 minutos para propagação

## 📱 Redes Sociais

Não esqueça de atualizar seus perfis sociais:

- Adicione o link do site na bio do Instagram
- Fixe o link na página do Facebook
- Compartilhe posts anunciando o novo site!

## 💡 Dicas de Uso

1. **Fotos de Qualidade:** Use fotos profissionais, bem iluminadas
2. **Atualize Regularmente:** Adicione fotos de eventos recentes
3. **Responda Rápido:** Configure notificações do WhatsApp Business
4. **Google Sheets:** Ideal se você edita do celular frequentemente
5. **Backup:** Sempre faça backup do `content.json` antes de editar

## 🔒 Segurança

- Não compartilhe seu painel admin publicamente
- Mantenha backups dos arquivos importantes
- Use senhas fortes na Netlify

## 📈 Próximos Passos (Opcional)

- [ ] Configurar domínio próprio (www.lulueventos.co.mz)
- [ ] Adicionar Google Analytics
- [ ] Configurar formulário de contacto com Netlify Forms
- [ ] Adicionar mais idiomas (português e inglês)
- [ ] Integrar com Instagram API para galeria automática

---

## 🎉 Pronto!

Seu site está online e pronto para receber clientes!

**Desenvolvido com ❤️ para a Lulú Eventos**

Para suporte ou dúvidas, consulte a documentação da Netlify ou entre em contacto com seu desenvolvedor.
