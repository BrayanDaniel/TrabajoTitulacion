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
    
    return config;
  },
  
  // Configuraciones adicionales de Next.js
  reactStrictMode: true,
  swcMinify: true,
  
  // Configuración de transpilación para PrimeReact
  transpilePackages: ['primereact'],
  
  // Configuración experimental si es necesaria
  experimental: {
    esmExternals: false
  }
}

module.exports = nextConfig;