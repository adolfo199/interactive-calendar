#!/bin/bash

# Script para desarrollo en paralelo
echo "🚀 Iniciando desarrollo en paralelo..."

# Función para limpiar procesos
cleanup() {
    echo "🛑 Deteniendo todos los procesos de desarrollo..."
    jobs -p | xargs -r kill
    exit 0
}

trap cleanup SIGINT SIGTERM

# Iniciar Calendar en modo watch en una terminal
echo "📦 Iniciando Calendar en modo watch..."
cd /home/zerocool/proyectos/Calendar
gnome-terminal --tab --title="Calendar Build" -- bash -c "npm run dev; exec bash" &

# Iniciar la aplicación de prueba en otra terminal
echo "🌐 Iniciando aplicación de prueba..."
cd /home/zerocool/proyectos/calendar-test-app
gnome-terminal --tab --title="Test App" -- bash -c "npm run dev; exec bash" &

# Iniciar el script de auto-actualización en una tercera terminal
echo "🔄 Iniciando auto-actualización..."
cd /home/zerocool/proyectos/Calendar
gnome-terminal --tab --title="Auto Update" -- bash -c "./scripts/auto-dev.sh; exec bash" &

echo "✅ Desarrollo en paralelo iniciado!"
echo "📝 Terminales abiertas:"
echo "   - Calendar Build: Compilación automática de TypeScript"
echo "   - Test App: Servidor de desarrollo de la aplicación de prueba"
echo "   - Auto Update: Actualización automática del paquete"
echo ""
echo "🛑 Para detener todo, cierra las terminales o presiona Ctrl+C"

# Esperar hasta que el usuario presione Ctrl+C
wait
