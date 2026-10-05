const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ignore Windows OneDrive desktop.ini files
config.resolver.blockList = [
  /.*desktop\.ini$/,
];

module.exports = config;
