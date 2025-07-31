#!/bin/bash

# Git Workflow Script for @interactive/calendar
# Automatiza el flujo de desarrollo con GitFlow

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo -e "${BLUE}Git Workflow Script para @interactive/calendar${NC}"
    echo ""
    echo "Uso: ./scripts/git-workflow.sh [comando] [argumentos]"
    echo ""
    echo "Comandos disponibles:"
    echo "  setup                    - Configurar GitFlow inicial"
    echo "  feature <nombre>         - Crear nueva rama feature"
    echo "  finish-feature <nombre>  - Finalizar feature y merge a develop"
    echo "  release <version>        - Crear rama release"
    echo "  finish-release <version> - Finalizar release y merge a main"
    echo "  hotfix <version>         - Crear rama hotfix"
    echo "  finish-hotfix <version>  - Finalizar hotfix"
    echo "  commit <mensaje>         - Commit con mensaje estructurado"
    echo "  status                   - Mostrar estado del repositorio"
    echo ""
    echo "Ejemplos:"
    echo "  ./scripts/git-workflow.sh setup"
    echo "  ./scripts/git-workflow.sh feature calendar-month-view"
    echo "  ./scripts/git-workflow.sh commit 'feat: add month navigation'"
    echo "  ./scripts/git-workflow.sh finish-feature calendar-month-view"
}

# Función para setup inicial de GitFlow
setup_gitflow() {
    echo -e "${BLUE}Configurando GitFlow...${NC}"
    
    # Crear rama develop si no existe
    if ! git show-ref --verify --quiet refs/heads/develop; then
        echo -e "${YELLOW}Creando rama develop...${NC}"
        git checkout -b develop
        git push -u origin develop
    fi
    
    # Volver a main
    git checkout master
    
    echo -e "${GREEN}✅ GitFlow configurado correctamente${NC}"
    echo -e "${BLUE}Ramas principales:${NC}"
    echo "  - master: Código de producción"
    echo "  - develop: Desarrollo activo"
}

# Función para crear feature
create_feature() {
    local feature_name=$1
    if [ -z "$feature_name" ]; then
        echo -e "${RED}❌ Error: Nombre de feature requerido${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}Creando feature: $feature_name${NC}"
    
    # Asegurar que estamos en develop
    git checkout develop
    git pull origin develop
    
    # Crear rama feature
    git checkout -b "feature/$feature_name"
    
    echo -e "${GREEN}✅ Feature '$feature_name' creada${NC}"
    echo -e "${YELLOW}Puedes empezar a desarrollar. Usa commits frecuentes:${NC}"
    echo "  ./scripts/git-workflow.sh commit 'feat: descripción del cambio'"
}

# Función para finalizar feature
finish_feature() {
    local feature_name=$1
    if [ -z "$feature_name" ]; then
        echo -e "${RED}❌ Error: Nombre de feature requerido${NC}"
        exit 1
    fi
    
    local current_branch=$(git branch --show-current)
    if [ "$current_branch" != "feature/$feature_name" ]; then
        echo -e "${YELLOW}Cambiando a feature/$feature_name...${NC}"
        git checkout "feature/$feature_name"
    fi
    
    echo -e "${BLUE}Finalizando feature: $feature_name${NC}"
    
    # Asegurar que todo está commitado
    if ! git diff-index --quiet HEAD --; then
        echo -e "${RED}❌ Error: Tienes cambios sin commitear${NC}"
        exit 1
    fi
    
    # Merge a develop
    git checkout develop
    git pull origin develop
    git merge "feature/$feature_name" --no-ff -m "feat: merge feature $feature_name"
    
    # Eliminar rama feature
    git branch -d "feature/$feature_name"
    
    # Push develop
    git push origin develop
    
    echo -e "${GREEN}✅ Feature '$feature_name' finalizada y mergeada a develop${NC}"
}

# Función para commit estructurado
make_commit() {
    local message=$1
    if [ -z "$message" ]; then
        echo -e "${RED}❌ Error: Mensaje de commit requerido${NC}"
        exit 1
    fi
    
    # Verificar que el mensaje sigue el formato convencional
    if [[ ! "$message" =~ ^(feat|fix|docs|style|refactor|test|chore|perf)(\(.+\))?: ]]; then
        echo -e "${YELLOW}⚠️  Advertencia: El mensaje no sigue el formato convencional${NC}"
        echo "Formato recomendado: tipo(scope): descripción"
        echo "Tipos válidos: feat, fix, docs, style, refactor, test, chore, perf"
        echo ""
        read -p "¿Continuar de todos modos? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    # Build antes del commit si estamos en una feature
    local current_branch=$(git branch --show-current)
    if [[ "$current_branch" == feature/* ]]; then
        echo -e "${BLUE}Compilando proyecto antes del commit...${NC}"
        npm run build
    fi
    
    # Hacer el commit
    git add .
    git commit -m "$message"
    
    echo -e "${GREEN}✅ Commit realizado: $message${NC}"
    
    # Sugerir push si estamos en una rama remota
    if git ls-remote --exit-code --heads origin "$current_branch" >/dev/null 2>&1; then
        echo -e "${YELLOW}💡 Sugerencia: git push origin $current_branch${NC}"
    fi
}

# Función para mostrar estado
show_status() {
    echo -e "${BLUE}Estado del Repositorio${NC}"
    echo "===================="
    
    local current_branch=$(git branch --show-current)
    echo -e "Rama actual: ${GREEN}$current_branch${NC}"
    
    echo ""
    echo "Ramas locales:"
    git branch --color=always
    
    echo ""
    echo "Estado de archivos:"
    git status --short
    
    echo ""
    echo "Últimos commits:"
    git log --oneline -5 --color=always
}

# Main script
case "$1" in
    "setup")
        setup_gitflow
        ;;
    "feature")
        create_feature "$2"
        ;;
    "finish-feature")
        finish_feature "$2"
        ;;
    "commit")
        make_commit "$2"
        ;;
    "status")
        show_status
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Comando desconocido: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
