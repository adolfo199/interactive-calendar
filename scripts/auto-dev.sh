#!/bin/bash

# Script de desarrollo automático para Calendar
# Observa cambios y actualiza automáticamente la aplicación de prueba

echo "🔄 Iniciando modo de desarrollo automático..."

# Función para limpiar procesos al salir
cleanup() {
    echo "🛑 Deteniendo procesos..."
    jobs -p | xargs -r kill
    exit 0
}

# Capturar señales de salida
trap cleanup SIGINT SIGTERM

# Función para actualizar paquete
update_package() {
    echo "📦 Cambios detectados, actualizando paquete..."
    
    # Construir
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Error en la construcción"
        return 1
    fi
    
    # Empaquetar
    npm pack
    if [ $? -ne 0 ]; then
        echo "❌ Error al empaquetar"
        return 1
    fi
    
    # Instalar en la app de prueba
    cd ../calendar-test-app
    npm install ../Calendar/interactive-calendar-1.0.0.tgz --force --silent
    if [ $? -ne 0 ]; then
        echo "❌ Error al instalar"
        cd ../Calendar
        return 1
    fi
    
    cd ../Calendar
    echo "✅ Paquete actualizado"
}

# Construcción inicial
echo "🏗️ Construcción inicial..."
update_package

# Observar cambios en src/
echo "👀 Observando cambios en src/..."
echo "📝 Presiona Ctrl+C para detener"

# Usar inotify para observar cambios (más eficiente que polling)
if command -v inotifywait >/dev/null 2>&1; then
    while inotifywait -e modify,create,delete -r src/ >/dev/null 2>&1; do
        sleep 1  # Debounce para evitar múltiples actualizaciones
        update_package
    done
else
    # Fallback usando chokidar si inotify no está disponible
    npx chokidar "src/**/*" -c "sleep 1 && ./scripts/auto-dev.sh --update-only" &
    wait
fi
