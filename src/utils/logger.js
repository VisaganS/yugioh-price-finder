// logger that conditionally outputs messages based on DEBUG env value
const isDebug = process.env.DEBUG.toLowerCase() === 'true';

// outputs debug message to console if debugging is enabled
function debug(...args) {
    if (isDebug) {
        console.log('[DEBUG]', ...args);
    }
}

module.exports = { debug };