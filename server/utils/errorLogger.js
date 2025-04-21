const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '../logs');
const ERROR_LOG_FILE = path.join(LOG_DIR, 'errors.log');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function logError(context, error) {
  const timestamp = new Date().toISOString();
  const errorMessage = error.message || 'Unknown error';
  const stackTrace = error.stack || '';
  
  const logEntry = `[${timestamp}] ${context}\nError: ${errorMessage}\nStack: ${stackTrace}\n\n`;
  
  try {
    fs.appendFileSync(ERROR_LOG_FILE, logEntry);
    console.error(`[${timestamp}] ${context}: ${errorMessage}`);
  } catch (writeError) {
    console.error('Failed to write to error log:', writeError);
  }
}

module.exports = {
  logError
}; 