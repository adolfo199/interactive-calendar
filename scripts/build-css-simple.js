import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import process from 'process';

console.log('🎨 Generando CSS simplificado...');

// Configuración simple de Tailwind
const simpleConfig = `
export default {
  content: [
    '../src/**/*.{js,ts,jsx,tsx}',
    '../dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {}
  },
  plugins: [],
  // Safelist con todas las clases que necesitamos
  safelist: [
    // Clases básicas
    'flex', 'grid', 'block', 'inline', 'hidden', 'relative', 'absolute', 'fixed',
    'w-full', 'h-full', 'min-h-screen', 'max-w-7xl', 'mx-auto',
    
    // Espaciado crítico - ESTO ES LO IMPORTANTE
    'space-y-0', 'space-y-0.5', 'space-y-1', 'space-y-1.5', 'space-y-2', 'space-y-3', 'space-y-4', 'space-y-6',
    'space-x-0', 'space-x-0.5', 'space-x-1', 'space-x-1.5', 'space-x-2', 'space-x-3', 'space-x-4', 'space-x-6',
    
    // Padding y margin
    'p-1', 'p-2', 'p-3', 'p-4', 'p-6', 'p-8',
    'px-1', 'px-2', 'px-3', 'px-4', 'px-6', 'px-8',
    'py-1', 'py-1.5', 'py-2', 'py-3', 'py-4', 'py-6',
    'm-1', 'm-2', 'm-3', 'm-4', 'm-6', 'm-8',
    'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-6', 'mb-8',
    'mt-1', 'mt-2', 'mt-3', 'mt-4', 'mt-6', 'mt-8',
    
    // Tamaños
    'w-1', 'w-2', 'w-3', 'w-4', 'w-5', 'w-6', 'w-7', 'w-8', 'w-9', 'w-10',
    'h-1', 'h-2', 'h-3', 'h-4', 'h-5', 'h-6', 'h-7', 'h-8', 'h-9', 'h-10',
    'min-h-[120px]', 'min-h-[2rem]', 'min-h-[3rem]', 'min-h-[4rem]',
    
    // Colores
    'bg-white', 'bg-gray-50', 'bg-gray-100', 'bg-gray-900',
    'bg-blue-50', 'bg-blue-100', 'bg-blue-500', 'bg-blue-600',
    'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500',
    'text-white', 'text-gray-600', 'text-gray-900',
    'text-blue-600', 'text-green-600', 'text-yellow-600', 'text-red-600',
    'border-gray-200', 'border-primary',
    
    // Layout
    'flex-col', 'flex-row', 'items-center', 'justify-center', 'justify-between',
    'grid-cols-7', 'grid-cols-8', 'gap-1', 'gap-2', 'gap-4',
    
    // Estados
    'hover:bg-gray-100', 'hover:scale-105', 'hover:shadow-lg',
    'focus:outline-none', 'focus:ring-2',
    
    // Borders y rounded
    'border', 'border-2', 'rounded', 'rounded-lg', 'rounded-xl', 'rounded-full',
    
    // Transiciones
    'transition-all', 'duration-200', 'duration-300',
    
    // Shadows
    'shadow', 'shadow-sm', 'shadow-md', 'shadow-lg',
    
    // Otros importantes
    'cursor-pointer', 'select-none', 'truncate', 'opacity-50', 'opacity-90',
    'z-10', 'z-20', 'z-50',
  ]
};
`;

// CSS de entrada simple
const inputCSS = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

try {
  const scriptsDir = path.dirname(new URL(import.meta.url).pathname);
  const distDir = path.join(process.cwd(), 'dist');
  
  // Crear directorios
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Escribir archivos temporales
  const tempConfigPath = path.join(scriptsDir, 'tailwind.simple.config.js');
  const tempCSSPath = path.join(scriptsDir, 'input.simple.css');
  const outputPath = path.join(distDir, 'styles.css');
  
  fs.writeFileSync(tempConfigPath, simpleConfig);
  fs.writeFileSync(tempCSSPath, inputCSS);

  console.log('📦 Compilando CSS con configuración simple...');
  
  // Comando más simple
  const command = `npx tailwindcss -c "${tempConfigPath}" -i "${tempCSSPath}" -o "${outputPath}" --minify`;
  console.log('🔧 Ejecutando:', command);
  
  execSync(command, { stdio: 'inherit' });

  // Limpiar
  fs.unlinkSync(tempConfigPath);
  fs.unlinkSync(tempCSSPath);

  // Verificar
  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    console.log(`✅ CSS generado: ${Math.round(stats.size / 1024)}KB`);
    
    // Verificar que space-y-1.5 esté incluido
    const content = fs.readFileSync(outputPath, 'utf8');
    if (content.includes('space-y-1\\.5')) {
      console.log('✅ space-y-1.5 confirmado en el CSS');
    } else {
      console.log('⚠️ space-y-1.5 NO encontrado en el CSS');
    }
  } else {
    throw new Error('No se pudo generar el archivo CSS');
  }

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
