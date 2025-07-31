import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎨 Generando CSS pre-compilado para @interactive/calendar...');

// Función para extraer clases de archivos TSX de manera más agresiva
function extractClassNames(filePaths) {
  const classNames = new Set();
  
  filePaths.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 1. Buscar className="..." o className={'...'}
      const classRegex = /className\s*=\s*["'`]([^"'`]*)["'`]/g;
      
      // 2. Buscar cn() con mejor regex que capture múltiples líneas
      const cnRegex = /cn\s*\(\s*["'`]([^"'`]*?)["'`]/gs;
      
      // 3. Buscar cva() - critical para componentes UI
      const cvaRegex = /cva\s*\(\s*["'`]([^"'`]*?)["'`]/gs;
      
      // 4. Buscar clases dentro de objetos variant (para cva)
      const variantRegex = /:\s*["'`]([^"'`]*?)["'`]/g;
      
      // 5. Buscar clases data-attribute específicamente
      const dataClassRegex = /data-\[[^\]]+\]:[a-z-]+(?:-[a-z0-9]+)*/g;
      
      let match;
      
      // Extraer clases básicas de className
      while ((match = classRegex.exec(content)) !== null) {
        match[1].split(/\s+/).forEach(cls => {
          if (cls.trim()) classNames.add(cls.trim());
        });
      }
      
      // Extraer clases de cn() - esto es crítico
      while ((match = cnRegex.exec(content)) !== null) {
        match[1].split(/\s+/).forEach(cls => {
          if (cls.trim()) classNames.add(cls.trim());
        });
      }
      
      // Extraer clases de cva() - NUEVO para componentes UI
      while ((match = cvaRegex.exec(content)) !== null) {
        match[1].split(/\s+/).forEach(cls => {
          if (cls.trim()) classNames.add(cls.trim());
        });
      }
      
      // Extraer clases de variants dentro de cva - NUEVO
      const variantSections = content.match(/variants:\s*{[^}]+}/gs);
      if (variantSections) {
        variantSections.forEach(section => {
          while ((match = variantRegex.exec(section)) !== null) {
            match[1].split(/\s+/).forEach(cls => {
              if (cls.trim()) classNames.add(cls.trim());
            });
          }
        });
      }
      
      // Extraer clases data-attribute
      const dataMatches = content.match(dataClassRegex);
      if (dataMatches) {
        dataMatches.forEach(cls => classNames.add(cls));
      }
      
      // Buscar patrones específicos de Tailwind que sabemos que se usan
      const specificPatterns = [
        /hover:scale-\[[0-9.]+\]/g,
        /ring-offset-[0-9]+/g,
        /duration-[0-9]+/g,
        /min-h-\[[0-9a-z]+\]/g,
        /max-w-[a-z0-9]+/g,
        /bg-gradient-to-[a-z]+/g,
        /from-[a-z0-9/]+/g,
        /to-[a-z0-9/]+/g,
        /\[&[^\]]+\]:[a-z-:]+/g, // Para selectores como [&>svg]:size-3
        // Nuevos patrones para detección más agresiva
        /bg-[a-z]+-[0-9]+/g,     // bg-blue-500, bg-red-600, etc.
        /text-[a-z]+-[0-9]+/g,   // text-blue-500, text-red-600, etc.
        /border-[a-z]+-[0-9]+/g, // border-blue-500, etc.
        /hover:[a-z-]+/g,        // hover:cualquier-cosa
        /focus:[a-z-]+/g,        // focus:cualquier-cosa
        /group-hover:[a-z-]+/g,  // group-hover:cualquier-cosa
        /data-\[[^\]]+\]:[a-z-]+/g, // data-[state=open]:animate-in
      ];
      
      specificPatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach(cls => classNames.add(cls));
        }
      });
      
      // NUEVO: Extracción super agresiva de CUALQUIER palabra que parezca clase de Tailwind
      const aggressiveRegex = /\b([a-z]+(?:-[a-z0-9]+)*(?:\/[0-9]+)?(?:\[[^\]]+\])?)\b/g;
      const potentialClasses = content.match(aggressiveRegex) || [];
      
      potentialClasses.forEach(cls => {
        // Solo agregar si REALMENTE parece una clase de Tailwind
        if (cls && (
          // Clases de color
          /^(bg|text|border)-[a-z]+-[0-9]+/.test(cls) ||
          // Clases de tamaño
          /^(w|h|p|m|px|py|mx|my|mt|mb|ml|mr|pt|pb|pl|pr)-/.test(cls) ||
          // Clases de layout
          /^(flex|grid|absolute|relative|fixed|inset|top|bottom|left|right|z)-/.test(cls) ||
          // Clases de estado
          /^(hover|focus|active|group-hover|peer-focus):.+/.test(cls) ||
          // Clases responsive
          /^(sm|md|lg|xl|2xl):.+/.test(cls) ||
          // Clases específicas conocidas
          ['flex', 'grid', 'block', 'inline', 'hidden', 'rounded', 'shadow', 'border', 'cursor-pointer'].includes(cls)
        )) {
          classNames.add(cls);
        }
      });
      
      console.log(`📝 ${path.basename(filePath)}: +${Array.from(content.matchAll(/["'`]([^"'`]+)["'`]/g)).length} strings`);
    }
  });
  
  return Array.from(classNames).filter(cls => cls && cls.length > 1);
}

// Buscar todos los archivos TSX en el proyecto (incluyendo components/ui)
const sourceFiles = [
  '../src/**/*.tsx',
  '../src/**/*.ts',
  '../src/components/ui/*.tsx'  // Asegurar que incluimos los componentes UI
].map(pattern => glob.sync(pattern, { cwd: __dirname })).flat();

console.log(`📁 Escaneando ${sourceFiles.length} archivos...`);
const extractedClasses = extractClassNames(sourceFiles.map(f => path.resolve(__dirname, f)));
console.log(`🎯 Encontradas ${extractedClasses.length} clases CSS`);

// Mostrar algunas clases extraídas para debug
console.log('📋 Algunas clases extraídas automáticamente:');
extractedClasses.slice(0, 10).forEach(cls => console.log(`   - ${cls}`));
if (extractedClasses.length > 10) {
  console.log(`   ... y ${extractedClasses.length - 10} más`);
}

// Crear configuración temporal de Tailwind para generar CSS
const tempConfig = `
import tailwindPlugin from '../src/plugin.js';

export default {
  content: [
    '../src/**/*.{js,ts,jsx,tsx}',
    '../dist/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [tailwindPlugin],
  // Incluir todas las clases encontradas dinámicamente
  safelist: [
    ...${JSON.stringify(extractedClasses)},
    // Clases adicionales comunes
    'min-h-screen', 'max-w-7xl', 'mx-auto',
    'p-4', 'p-6', 'mb-6', 'mt-2', 'space-y-4',
    'text-3xl', 'text-xl', 'text-lg', 'text-sm', 'text-xs',
    'font-bold', 'font-medium', 'font-semibold',
    'bg-gray-50', 'bg-gray-100', 'bg-white',
    'border', 'border-gray-200', 'border-gray-300',
    'rounded', 'rounded-lg', 'rounded-md', 'rounded-sm',
    'shadow', 'shadow-lg', 'shadow-md', 'shadow-sm',
    'flex', 'flex-col', 'flex-row', 'items-center', 'justify-center', 'justify-between',
    'grid', 'grid-cols-7', 'gap-1', 'gap-2', 'gap-4',
    'hover:bg-gray-100', 'hover:bg-blue-50', 'focus:outline-none', 'focus:ring-2',
    'aspect-square', 'cursor-pointer', 'select-none',
    'relative', 'absolute', 'fixed', 'inset-0',
    'z-10', 'z-20', 'z-50',
    'opacity-50', 'opacity-75',
    'w-full', 'h-full',
    
    // ===== CLASES ESPECÍFICAS QUE FALTAN =====
    // Tamaños específicos que se usan en el calendario
    'w-1', 'w-2', 'w-3', 'w-4', 'w-5', 'w-6', 'w-7', 'w-8', 'w-9', 'w-10', 'w-11', 'w-12',
    'h-1', 'h-2', 'h-3', 'h-4', 'h-5', 'h-6', 'h-7', 'h-8', 'h-9', 'h-10', 'h-11', 'h-12',
    'min-h-[10px]', 'min-h-[70px]', 'max-w-xs', 'max-w-sm', 'max-w-md', 'max-w-lg',
    
    // Bordes y rounded específicos
    'border-0', 'border-2', 'border-4', 'border-8',
    'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-full',
    'rounded-t-lg', 'rounded-b-lg', 'rounded-l-lg', 'rounded-r-lg',
    
    // Duraciones y easing
    'duration-75', 'duration-100', 'duration-150', 'duration-200', 'duration-300', 'duration-500', 'duration-700', 'duration-1000',
    'ease-linear', 'ease-in', 'ease-out', 'ease-in-out',
    
    // Escalas y transformaciones específicas
    'scale-90', 'scale-95', 'scale-100', 'scale-105', 'scale-110', 'scale-125',
    'hover:scale-[1.02]', 'hover:scale-[1.05]', 'hover:scale-110',
    
    // Ring y outline
    'ring-1', 'ring-2', 'ring-4', 'ring-8',
    'ring-offset-1', 'ring-offset-2', 'ring-offset-4', 'ring-offset-8',
    'ring-primary', 'ring-blue-500', 'ring-green-500', 'ring-red-500',
    'ring-primary/20', 'ring-primary/50',
    
    // Fondos gradient
    'bg-gradient-to-r', 'bg-gradient-to-l', 'bg-gradient-to-t', 'bg-gradient-to-b',
    'bg-gradient-to-tr', 'bg-gradient-to-tl', 'bg-gradient-to-br', 'bg-gradient-to-bl',
    'from-white', 'from-gray-50', 'from-primary/10', 'from-blue-50',
    'to-gray-50/50', 'to-primary/5', 'to-blue-100', 'to-transparent',
    
    // Margins y paddings específicos
    'p-1', 'p-2', 'p-3', 'p-5', 'p-8',
    'm-1', 'm-2', 'm-3', 'm-5', 'm-8',
    'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-5', 'mb-8',
    'mt-1', 'mt-2', 'mt-3', 'mt-4', 'mt-5', 'mt-8',
    'ml-1', 'ml-2', 'ml-3', 'ml-4', 'ml-5', 'ml-8',
    'mr-1', 'mr-2', 'mr-3', 'mr-4', 'mr-5', 'mr-8',
    
    // Espaciado entre elementos
    'space-x-0.5', 'space-x-1', 'space-x-1.5', 'space-x-2', 'space-x-3', 'space-x-4', 'space-x-6',
    'space-y-0.5', 'space-y-1', 'space-y-1.5', 'space-y-2', 'space-y-3', 'space-y-4', 'space-y-6',
    
    // Justificación y alineación
    'justify-start', 'justify-end', 'justify-center', 'justify-between', 'justify-around', 'justify-evenly',
    'items-start', 'items-end', 'items-center', 'items-baseline', 'items-stretch',
    
    // Z-index específicos
    'z-0', 'z-10', 'z-20', 'z-30', 'z-40', 'z-50', '-z-10',
    
    // Clases de animación para tooltips y componentes UI
    'animate-in', 'animate-out',
    'fade-in-0', 'fade-out-0',
    'zoom-in-95', 'zoom-out-95',
    'slide-in-from-top-2', 'slide-in-from-bottom-2',
    'slide-in-from-left-2', 'slide-in-from-right-2',
    'duration-200', 'duration-300', 'duration-500',
    
    // Estados de data attributes para Radix UI
    'data-[state=open]:animate-in',
    'data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0',
    'data-[state=closed]:zoom-out-95',
    'data-[side=bottom]:slide-in-from-top-2',
    'data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2',
    'data-[side=top]:slide-in-from-bottom-2',
    
    // Colores adicionales para eventos y estados
    'bg-blue-600', 'bg-green-600', 'bg-yellow-600', 'bg-red-600', 'bg-purple-600',
    'text-blue-600', 'text-green-600', 'text-yellow-600', 'text-red-600', 'text-purple-600',
    'border-blue-600', 'border-green-600', 'border-yellow-600', 'border-red-600', 'border-purple-600',
    
    // Clases para popover y modal
    'bg-popover', 'text-popover-foreground', 'border-popover',
    'backdrop-blur-sm', 'backdrop-blur-md',
    
    // Clases de transformación y escala
    'scale-95', 'scale-100', 'scale-105',
    'transform', 'transition-transform', 'transition-all',
    
    // Clases adicionales de spacing y sizing
    'px-1', 'px-2', 'px-3', 'px-4', 'px-6', 'px-8',
    'py-1', 'py-1.5', 'py-2', 'py-3', 'py-4', 'py-6',
    'm-1', 'm-2', 'm-3', 'm-4', 'm-6',
    'mt-1', 'mt-2', 'mt-3', 'mt-4', 'mt-6',
    'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-6',
    'ml-1', 'ml-2', 'ml-3', 'ml-4', 'ml-6',
    'mr-1', 'mr-2', 'mr-3', 'mr-4', 'mr-6',
    
    // Clases de estado hover y focus adicionales
    'hover:shadow-lg', 'hover:shadow-xl', 'hover:scale-105', 'hover:opacity-80',
    'focus:ring-primary', 'focus:ring-blue-500', 'focus:border-primary',
    
    // Clases de texto y tipografía
    'text-center', 'text-left', 'text-right',
    'font-normal', 'font-light', 'font-thin',
    'leading-tight', 'leading-normal', 'leading-relaxed',
    'tracking-tight', 'tracking-normal', 'tracking-wide',
    
    // Clases de layout adicionales
    'space-x-1', 'space-x-2', 'space-x-3', 'space-x-4',
    'space-y-1', 'space-y-2', 'space-y-3', 'space-y-4',
    'divide-x', 'divide-y', 'divide-gray-200',
    
    // ===== CLASES ESPECÍFICAS DE COMPONENTES UI =====
    // Clases de badge.tsx
    'inline-flex', 'justify-center', 'rounded-md', 'px-2', 'py-0.5', 
    'w-fit', 'whitespace-nowrap', 'shrink-0', 'size-3', 'gap-1',
    'pointer-events-none', 'focus-visible:border-ring', 'focus-visible:ring-ring/50',
    'focus-visible:ring-[3px]', 'aria-invalid:ring-destructive/20', 
    'dark:aria-invalid:ring-destructive/40', 'aria-invalid:border-destructive',
    'transition-[color,box-shadow]', 'overflow-hidden',
    
    // Variantes de badge
    'border-transparent', 'bg-primary', 'text-primary-foreground',
    'bg-secondary', 'text-secondary-foreground', 'bg-destructive',
    'text-foreground', 'hover:bg-accent', 'hover:text-accent-foreground',
    'hover:bg-primary/90', 'hover:bg-secondary/90', 'hover:bg-destructive/90',
    'focus-visible:ring-destructive/20', 'dark:focus-visible:ring-destructive/40',
    'dark:bg-destructive/60',
    
    // Clases de button.tsx  
    'gap-2', 'disabled:pointer-events-none', 'disabled:opacity-50',
    'outline-none', 'shadow-xs', 'underline-offset-4', 'hover:underline',
    'h-8', 'h-9', 'h-10', 'has-[>svg]:px-3', 'has-[>svg]:px-2.5', 'has-[>svg]:px-4',
    'size-9', 'dark:bg-input/30', 'dark:border-input', 'dark:hover:bg-input/50',
    'dark:hover:bg-accent/50',
    
    // Clases de card.tsx
    'auto-rows-min', 'grid-rows-[auto_auto]', 'items-start', 'gap-1.5',
    'has-data-[slot=card-action]:grid-cols-[1fr_auto]', '[.border-b]:pb-6',
    'col-start-2', 'row-span-2', 'row-start-1', 'self-start', 'justify-self-end',
    'leading-none', '[.border-t]:pt-6',
    
    // Container queries y selectores complejos
    '@container/card-header', 'grid-cols-[1fr_auto]',
    '[&_svg]:pointer-events-none', '[&_svg:not([class*="size-"])]:size-4',
    '[&_svg]:shrink-0', '[&>svg]:size-3', '[&>svg]:pointer-events-none',
  ]
};
`;

// CSS de entrada con estilos personalizados
const customCSS = fs.existsSync(path.join(process.cwd(), 'src/Calendar.css')) 
  ? fs.readFileSync(path.join(process.cwd(), 'src/Calendar.css'), 'utf8')
  : '';

const inputCSS = `
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Estilos personalizados del calendario */
${customCSS}
`;

try {
  // Crear directorio scripts si no existe
  const scriptsDir = path.dirname(new URL(import.meta.url).pathname);
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
  }

  // Crear directorio dist si no existe
  const distDir = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Escribir configuración temporal
  const tempConfigPath = path.join(scriptsDir, 'tailwind.temp.config.js');
  fs.writeFileSync(tempConfigPath, tempConfig);

  // Escribir CSS de entrada temporal
  const tempCSSPath = path.join(scriptsDir, 'input.temp.css');
  fs.writeFileSync(tempCSSPath, inputCSS);

  // Generar CSS usando Tailwind CLI
  const outputPath = path.join(distDir, 'styles.css');
  
  console.log('📦 Compilando CSS con Tailwind...');
  execSync(
    `npx tailwindcss -c "${tempConfigPath}" -i "${tempCSSPath}" -o "${outputPath}" --minify`,
    { stdio: 'inherit' }
  );

  // Limpiar archivos temporales
  fs.unlinkSync(tempConfigPath);
  fs.unlinkSync(tempCSSPath);

  // Verificar que el archivo fue creado
  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    console.log(`✅ CSS generado exitosamente: dist/styles.css (${Math.round(stats.size / 1024)}KB)`);
  } else {
    throw new Error('No se pudo generar el archivo CSS');
  }

} catch (error) {
  console.error('❌ Error generando CSS:', error.message);
  process.exit(1);
}
