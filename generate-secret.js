#!/usr/bin/env node

/**
 * Generate NextAuth Secret
 * 
 * This script generates a cryptographically secure random string
 * suitable for use as NEXTAUTH_SECRET in your .env.local file.
 * 
 * Usage: node generate-secret.js
 */

const crypto = require('crypto');

function generateNextAuthSecret() {
  // Generate 32 random bytes and encode as base64
  const secret = crypto.randomBytes(32).toString('base64');
  
  console.log('🔐 Generated NextAuth Secret:');
  console.log('');
  console.log(`NEXTAUTH_SECRET=${secret}`);
  console.log('');
  console.log('📝 Copy this line to your .env.local file');
  console.log('⚠️  Keep this secret secure and never commit it to version control!');
  console.log('');
  console.log('💡 You can also run: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"');
}

// Run the generator
generateNextAuthSecret();
