# Relatório de Serviço - 15º BPM (PWA)

Sistema de Relatórios de Serviço da **Polícia Militar da Paraíba - 15º BPM**, convertido em **Progressive Web App (PWA)** instalável.

## 🚀 Acesso

O app está hospedado no **GitHub Pages** e pode ser acessado diretamente pelo navegador:

👉 **[https://SEU-USUARIO.github.io/relatorio-15bpm](https://SEU-USUARIO.github.io/relatorio-15bpm)**

*(Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub)*

## 📱 Instalação

### Android (Chrome/Edge)
1. Acesse o link acima no navegador
2. Toque no menu (⋮) → **"Adicionar à tela inicial"** ou **"Instalar app"**
3. O ícone aparecerá na tela inicial como um app nativo

### iOS (Safari)
1. Acesse o link no Safari
2. Toque no botão **Compartilhar** (□⬆️)
3. Role para baixo e toque em **"Adicionar à Tela de Início"**

### Desktop (Chrome/Edge)
1. Acesse o link no navegador
2. Clique no ícone de instalação (📲) na barra de endereço
3. Ou vá em Menu → **"Instalar Relatório 15º BPM"**

## ⚡ Funcionalidades PWA

| Recurso | Descrição |
|---------|-----------|
| **Instalável** | Adiciona à tela inicial como app nativo |
| **Offline** | Funciona sem internet após primeiro acesso |
| **Standalone** | Roda em modo tela cheia, sem barra de navegação |
| **Cache** | Assets cacheados para carregamento instantâneo |
| **Background Sync** | Sincroniza dados quando a conexão retorna |
| **Ícones Adaptativos** | Ícones otimizados para Android e iOS |

## 📁 Estrutura do Projeto

```
relatorio-15bpm/
├── index.html              # App principal (modificado para PWA)
├── manifest.json           # Configuração do PWA
├── sw.js                   # Service Worker (cache + offline)
├── icons/
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
├── img/
│   └── relatorio-15bpm-icon-transparent.png
└── README.md               # Este arquivo
```

## 🛠️ Como Publicar no GitHub Pages

### 1. Criar o repositório
```bash
# Crie um novo repositório no GitHub chamado "relatorio-15bpm"
# Marque como público e NÃO inicialize com README
```

### 2. Clonar e enviar os arquivos
```bash
git clone https://github.com/SEU-USUARIO/relatorio-15bpm.git
cd relatorio-15bpm

# Copie todos os arquivos deste projeto para a pasta
# (index.html, manifest.json, sw.js, pasta icons/, pasta img/)

git add .
git commit -m "Primeira versão PWA - Relatório 15º BPM"
git push origin main
```

### 3. Ativar GitHub Pages
1. No GitHub, vá em **Settings** → **Pages**
2. Em **Source**, selecione **Deploy from a branch**
3. Selecione a branch **main** e pasta **/(root)**
4. Clique em **Save**
5. Aguarde 1-2 minutos e acesse o link gerado

### 4. Configurar domínio customizado (opcional)
Se quiser usar um domínio próprio (ex: `relatorio15bpm.pmpb.pb.gov.br`):
1. Crie um arquivo `CNAME` na raiz com o domínio
2. Configure o DNS apontando para `SEU-USUARIO.github.io`

## 🔒 Segurança

- **HTTPS obrigatório**: GitHub Pages já serve via HTTPS
- **Service Worker**: Isolado e seguro, só funciona em HTTPS
- **Dados locais**: Todos os dados ficam no dispositivo (IndexedDB/localStorage)
- **Sem servidor**: Não há backend, todo processamento é local

## 📝 Notas Técnicas

### Diferenças do App Android Original
| Recurso | Android Nativo | PWA |
|---------|---------------|-----|
| Biometria | Android BiometricPrompt | Não disponível (Web API limitada) |
| Compartilhar imagem | Android Intent | Web Share API |
| Salvar PDF | Android MediaStore | Download do navegador |
| Storage nativo | Arquivo JSON nativo | IndexedDB + localStorage |
| Vibração | Android Vibrator | Vibration API |
| Clipboard | Android ClipboardManager | Clipboard API |

### Compatibilidade de Browsers
| Navegador | Instalação | Offline | Notificações |
|-----------|-----------|---------|-------------|
| Chrome (Android) | ✅ Completo | ✅ | ✅ |
| Chrome (Desktop) | ✅ Completo | ✅ | ✅ |
| Edge | ✅ Completo | ✅ | ✅ |
| Safari (iOS) | ✅ Adicionar à tela | ✅ | ✅ (iOS 16.4+) |
| Safari (macOS) | ✅ | ✅ | ✅ |
| Firefox | ⚠️ Limitado | ✅ | ⚠️ |
| Samsung Internet | ✅ | ✅ | ✅ |

## 🔄 Atualizações

O Service Worker detecta automaticamente quando há uma nova versão:
1. O usuário acessa o app
2. O SW verifica se há atualização em background
3. Nova versão é baixada silenciosamente
4. Na próxima visita, o app já está atualizado

Para forçar atualização imediata:
- **Android**: Feche o app completamente e abra novamente
- **iOS**: Remova da tela inicial e adicione novamente
- **Desktop**: Ctrl+F5 (Windows) ou Cmd+Shift+R (Mac)

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de TI do 15º BPM.

---

**Polícia Militar da Paraíba - 15º BPM**  
*Sistema de Relatórios de Serviço - Versão PWA*
