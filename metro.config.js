const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Ensure Metro resolves CJS builds (not ESM) for packages like Zustand
// that use import.meta.env in their ESM builds, which breaks in Metro's
// non-module web script output.
config.resolver.unstable_conditionNames = [
  "react-native",
  "require",
  "default",
];

module.exports = config;
