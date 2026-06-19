#!/bin/bash
# ==========================================
# SCRIPT DE DEPLOY PARA GITHUB PAGES
# Relatório 15º BPM - PWA
# ==========================================

set -e

REPO_NAME="relatorio-15bpm"
BRANCH="main"

echo "🚀 Deploy do Relatório 15º BPM PWA"
echo "===================================="

# Verificar se git está instalado
if ! command -v git &> /dev/null; then
    echo "❌ Git não encontrado. Instale o Git primeiro."
    exit 1
fi

# Verificar se o repositório remoto está configurado
if ! git remote -v &> /dev/null; then
    echo "⚠️  Nenhum remote configurado."
    read -p "Digite seu nome de usuário do GitHub: " GITHUB_USER
    git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
    echo "✓ Remote configurado: https://github.com/$GITHUB_USER/$REPO_NAME.git"
fi

# Verificar branch atual
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
    echo "⚠️  Branch atual: $CURRENT_BRANCH. Mudando para $BRANCH..."
    git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH"
fi

# Adicionar todos os arquivos
echo "📦 Adicionando arquivos..."
git add .

# Commit
if git diff --cached --quiet; then
    echo "ℹ️  Nenhuma alteração para commitar."
else
    echo "💾 Criando commit..."
    git commit -m "Deploy PWA - $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Push
echo "☁️  Enviando para GitHub..."
git push origin "$BRANCH"

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "🔗 Acesse seu app em:"
echo "   https://$(git remote get-url origin | sed 's/.*github.com\///' | sed 's/\.git//' | cut -d'/' -f1).github.io/$REPO_NAME"
echo ""
echo "📱 Para instalar no celular:"
echo "   Android: Menu → 'Adicionar à tela inicial'"
echo "   iOS: Compartilhar → 'Adicionar à Tela de Início'"
echo ""
echo "⚠️  Lembre-se de ativar GitHub Pages em:"
echo "   Settings → Pages → Source: Deploy from a branch → main → /(root)"
