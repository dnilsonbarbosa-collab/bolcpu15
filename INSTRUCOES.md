# 🚀 Instruções Rápidas de Deploy

## Opção 1: Deploy Automático (Terminal)

```bash
# 1. Navegue até a pasta do projeto
cd relatorio-15bpm

# 2. Execute o script de deploy
./deploy.sh
```

## Opção 2: Deploy Manual (GitHub Web)

### Passo 1: Criar Repositório
1. Acesse [github.com/new](https://github.com/new)
2. Nome: `relatorio-15bpm`
3. Descrição: `Relatório de Serviço - 15º BPM (PWA)`
4. **Público** ✅
5. **NÃO** marque "Add a README"
6. Clique **Create repository**

### Passo 2: Enviar Arquivos
1. Na página do repositório, clique em **"uploading an existing file"**
2. Arraste TODOS os arquivos desta pasta para a área de upload
3. Em "Commit changes", escreva: `Primeira versão PWA`
4. Clique **Commit changes**

### Passo 3: Ativar GitHub Pages
1. Vá em **Settings** (aba superior)
2. No menu lateral esquerdo, clique em **Pages**
3. Em "Source", selecione:
   - **Deploy from a branch**
   - Branch: **main**
   - Folder: **/(root)**
4. Clique **Save**
5. Aguarde 1-2 minutos

### Passo 4: Acessar
- O link aparecerá em: `https://SEU-USUARIO.github.io/relatorio-15bpm`
- Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub

## 📱 Testar Instalação

### Android (Chrome)
1. Abra o link no Chrome
2. Toque no menu (⋮) → **"Instalar app"** ou **"Adicionar à tela inicial"**
3. Confirme → Ícone aparece na tela inicial

### iOS (Safari)
1. Abra o link no Safari
2. Toque em **Compartilhar** (□⬆️)
3. Role para baixo → **"Adicionar à Tela de Início"**
4. Toque **Adicionar**

### Desktop (Chrome/Edge)
1. Abra o link no navegador
2. Clique no ícone 📲 na barra de endereço
3. Ou: Menu → **"Instalar Relatório 15º BPM"**

## ⚠️ Importante

- **HTTPS**: GitHub Pages já serve via HTTPS (obrigatório para PWA)
- **Primeiro acesso**: O app precisa de internet no primeiro carregamento para cachear os assets
- **Offline**: Após o primeiro acesso, o app funciona sem internet
- **Atualizações**: O Service Worker atualiza automaticamente em background

## 🔄 Atualizar o App

Para publicar uma nova versão:
1. Faça as alterações nos arquivos
2. Execute `./deploy.sh` (ou faça commit manual)
3. O Service Worker detecta a nova versão automaticamente
4. Usuários verão a atualização na próxima visita
