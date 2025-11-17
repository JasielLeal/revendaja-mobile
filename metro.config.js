const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Configuração para resolver imports do TanStack Query
config.resolver.sourceExts.push('cjs');

module.exports = withNativeWind(config, { input: './app/globals.css' });