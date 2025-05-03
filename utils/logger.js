// utils/logger.js

const info = (...params) => {
    console.log('[INFO]', ...params);
  };
  
  const warn = (...params) => {
    console.warn('[WARN]', ...params);
  };
  
  const error = (...params) => {
    console.error('[ERROR]', ...params);
  };
  
  module.exports = {
    info,
    warn,
    error
  };
  