# Ferramentas de Desenvolvimento PWA - Guia Completo

## O Equivalente ao Android Studio para PWA

O **VS Code** com algumas extensões é o seu novo "Android Studio" para PWA.

---

## 1. VS Code + Extensões Essenciais (GRATUITO)

### Extensões Obrigatórias:

| Extensão | Função | Equivalente no Android Studio |
|----------|--------|------------------------------|
| **Live Server** | Servidor local com hot reload | Run/Apply Changes |
| **Prettier** | Formatação automática de código | Code -> Reformat Code |
| **ESLint** | Detecção de erros JS em tempo real | Lint |
| **Auto Rename Tag** | Renomeia tags HTML pareadas | - |
| **Path Intellisense** | Autocomplete de caminhos | Ctrl+Space |
| **HTML CSS Support** | CSS autocomplete em HTML | - |
| **JavaScript (ES6) snippets** | Snippets de código JS | Live Templates |
| **GitLens** | Controle de versão visualizado | Git tool window |

### Como instalar:
1. Abra o VS Code
2. Pressione `Ctrl+Shift+X` (extensões)
3. Procure cada extensão pelo nome
4. Clique em **Install**

---

## 2. Live Server - Seu "Emulador" PWA

O **Live Server** é o equivalente ao emulador do Android Studio:
- Inicia servidor local instantaneamente
- **Hot reload**: salva o arquivo -> navegador atualiza automaticamente
- Suporta HTTPS (necessário para Service Workers)
- Acesso pelo celular na mesma rede WiFi

### Como usar:
```
1. Clique com botão direito no index.html
2. Selecione "Open with Live Server"
3. Ou clique no botão "Go Live" na barra de status
```

---

## 3. Fluxo de Trabalho Diario (vs Android Studio)

| Tarefa | Android Studio | VS Code + Live Server |
|--------|---------------|----------------------|
| Abrir projeto | File -> Open | File -> Open Folder |
| Rodar app | Run | "Go Live" |
| Ver mudanças | Build & Deploy | Salvar (Ctrl+S) -> atualiza SOZINHO |
| Console de erros | Logcat | Chrome DevTools (F12) |
| Inspecionar | Layout Inspector | Chrome DevTools -> Elements |
| Network | Network Profiler | Chrome DevTools -> Network |
| Storage | Device File Explorer | Chrome DevTools -> Application |
| Service Workers | - | Chrome DevTools -> Application -> SW |
| Cache | - | Chrome DevTools -> Application -> Cache |
| Auditoria | - | Chrome DevTools -> Lighthouse |

---

## 4. Testando no Celular

### Opção A: Mesma rede WiFi
1. Descubra o IP do PC: `Win+R` -> `cmd` -> `ipconfig`
2. No celular: `http://192.168.x.x:5500`

### Opção B: ngrok (tunnel público)
```bash
ngrok http 5500
# Copie o URL HTTPS e acesse no celular
```

---

## 5. Chrome DevTools - Seu "Logcat" + "Profiler"

Pressione `F12` no navegador:

| Aba | Função |
|-----|--------|
| **Elements** | Inspecionar HTML/CSS em tempo real |
| **Console** | Logs de erro, console.log |
| **Network** | Monitorar requisições HTTP |
| **Application** | Service Workers, Cache, IndexedDB, LocalStorage |
| **Lighthouse** | Auditoria de PWA (performance, SEO) |
| **Performance** | Gravar e analisar performance |

### Testar PWA:
1. F12 -> **Application** -> **Service Workers**
2. Marque "Update on reload" e "Bypass for network"
3. Verifique se o SW está registrado
4. Clique "Offline" para simular modo offline
5. Vá em **Manifest** para verificar manifest.json

---

## 6. Ferramentas Adicionais Gratuitas

- **Responsively App** (responsively.app) - múltiplos dispositivos lado a lado
- **PWA Builder** (pwabuilder.com) - analisa e sugere melhorias
- **StackBlitz** (stackblitz.com) - IDE online completa, zero instalação
- **CodeSandbox** (codesandbox.io) - IDE online com colaboração

---

## 7. Setup Ideal - Passo a Passo

1. **Instale VS Code**: https://code.visualstudio.com/download
2. **Instale extensões**: Live Server, Prettier, ESLint
3. **Abra a pasta**: File -> Open Folder -> `relatorio-15bpm`
4. **Clique "Go Live"**: Botão na barra de status inferior
5. **Abra DevTools**: F12 -> Application -> verifique Service Worker
6. **Edite e salve**: Ctrl+S -> navegador atualiza instantaneamente
7. **Teste no celular**: Use IP da rede local ou ngrok

---

## Atalhos de Teclado

| Ação | Atalho |
|------|--------|
| Salvar arquivo | `Ctrl+S` |
| Formatar documento | `Shift+Alt+F` |
| Abrir terminal | ``Ctrl+` `` |
| Go Live | `Ctrl+Shift+P` -> "Live Server" |
| Chrome DevTools | `F12` |
| Device Toolbar (mobile) | `Ctrl+Shift+M` |
| Recarregar sem cache | `Ctrl+Shift+R` |

---

**Pronto! Ambiente de desenvolvimento PWA tão poderoso quanto o Android Studio.**
