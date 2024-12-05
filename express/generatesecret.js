const crypto = require('crypto');

// Generate a secure random key
const secureKey = crypto.randomBytes(32).toString('hex'); // 256-bit key
console.log('Generated Secure Key:', secureKey);
