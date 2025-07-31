#!/bin/bash

# Script para enlazar el paquete Calendar para desarrollo
echo "🔗 Configurando enlace de desarrollo para Calendar..."

# Construir el paquete una vez
echo "📦 Construyendo paquete Calendar..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error al construir el paquete Calendar"
    exit 1
fi

# Crear enlace simbólico global
echo "🔗 Creando enlace global..."
npm link

if [ $? -ne 0 ]; then
    echo "❌ Error al crear enlace global"
    exit 1
fi

# Cambiar a la aplicación de prueba y enlazar
cd ../calendar-test-app

echo "🔗 Enlazando paquete en calendar-test-app..."
npm link @interactive/calendar

if [ $? -ne 0 ]; then
    echo "❌ Error al enlazar el paquete"
    exit 1
fi

echo "✅ ¡Enlace de desarrollo configurado exitosamente!"
echo "📝 Ahora puedes usar 'npm run dev:watch' en Calendar para desarrollo en tiempo real"
echo "🚀 Y 'npm run dev' en calendar-test-app para ver los cambios"
