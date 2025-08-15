const JavaScriptObfuscator = require('webpack-obfuscator');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    // Solo aplicar obfuscación en producción y del lado del cliente
    if (!dev && !isServer) {
      config.plugins.push(
        new JavaScriptObfuscator({
          // Configuración moderada para mantener compatibilidad
          compact: true,
          controlFlowFlattening: false,
          deadCodeInjection: false,
          debugProtection: false,
          debugProtectionInterval: 0,
          disableConsoleOutput: true,
          identifierNamesGenerator: 'hexadecimal',
          log: false,
          numbersToExpressions: false,
          renameGlobals: false,
          rotateStringArray: true,
          selfDefending: true,
          shuffleStringArray: true,
          splitStrings: true,
          splitStringsChunkLength: 5,
          stringArray: true,
          stringArrayEncoding: ['base64'],
          stringArrayIndexShift: true,
          stringArrayThreshold: 0.8,
          transformObjectKeys: true,
          unicodeEscapeSequence: false
        }, [
          // Excluir archivos que pueden causar problemas
          'node_modules/**',
          'primereact/**'
        ])
      );
    }
    
    // ✅ Configuración para evitar errores de resolución de módulos
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false
    };
    
    return config;
  },
  
  // ✅ Configuraciones adicionales de Next.js corregidas
  reactStrictMode: false, // ✅ Desactivar para evitar doble renderizado
  swcMinify: true,
  
  // ✅ Configuración de transpilación para PrimeReact
  transpilePackages: ['primereact'],
  
  // ✅ Configuración experimental corregida
  experimental: {
    esmExternals: 'loose', // ✅ Cambiado de false a 'loose'
    optimizeCss: false // ✅ Evitar conflictos con PrimeReact
  },
  
  // ✅ Configuración de imágenes para evitar errores 404
  images: {
    domains: ['via.placeholder.com', 'localhost'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true // ✅ Para evitar errores de optimización
  },
  
  // ✅ Configuración para archivos estáticos
  async rewrites() {
    return [
      {
        source: '/logo.png',
        destination: '/layout/images/logo-dark.svg'
      },
      {
        source: '/logo-dark.svg',
        destination: '/layout/images/logo-dark.svg'
      },
      {
        source: '/logo-white.svg',
        destination: '/layout/images/logo-white.svg'
      }
    ];
  },
  
  // ✅ Headers para evitar errores CORS y cache
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          }
        ]
      }
    ];
  },
  
  // ✅ Configuración del compilador
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false
  }
};

module.exports = nextConfig;