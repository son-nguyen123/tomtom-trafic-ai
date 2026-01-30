#!/usr/bin/env node

/**
 * Setup Validation Script
 * Checks if the environment is properly configured for TomTom Traffic AI
 */

require('dotenv').config();
const fs = require('fs');
const http = require('http');

const CHECKS = {
  ENV_FILE: '✓ .env file exists',
  API_KEY: '✓ TomTom API key is configured',
  API_KEY_VALID: '✓ API key is not placeholder',
  NODE_MODULES: '✓ Dependencies are installed',
  PORT_AVAILABLE: '✓ Port 5000 is available',
  INTERNET: '✓ Internet connection available'
};

const WARNINGS = [];
const ERRORS = [];

console.log('\n🔍 TomTom Traffic AI - Setup Validation\n');
console.log('='.repeat(50) + '\n');

// Check 1: .env file exists
if (fs.existsSync('.env')) {
  console.log('✅', CHECKS.ENV_FILE);
} else {
  console.log('❌', CHECKS.ENV_FILE.replace('✓', '✗'));
  ERRORS.push('Missing .env file. Run: cp .env.example .env');
}

// Check 2: API key is configured
const apiKey = process.env.TOMTOM_API_KEY;
if (apiKey) {
  console.log('✅', CHECKS.API_KEY);
  
  // Check 3: API key is not placeholder
  if (apiKey !== 'your_tomtom_api_key_here' && apiKey !== 'your_api_key_here') {
    console.log('✅', CHECKS.API_KEY_VALID);
  } else {
    console.log('⚠️ ', CHECKS.API_KEY_VALID.replace('✓', '!'));
    WARNINGS.push('API key appears to be a placeholder. Update TOMTOM_API_KEY in .env');
  }
} else {
  console.log('❌', CHECKS.API_KEY.replace('✓', '✗'));
  ERRORS.push('TOMTOM_API_KEY not found in .env file');
}

// Check 4: Dependencies installed
if (fs.existsSync('node_modules')) {
  console.log('✅', CHECKS.NODE_MODULES);
} else {
  console.log('❌', CHECKS.NODE_MODULES.replace('✓', '✗'));
  ERRORS.push('Dependencies not installed. Run: npm install');
}

// Check 5: Port availability
const PORT = process.env.PORT || 5000;
const server = http.createServer();
let checksCompleted = false;

server.once('error', (err) => {
  if (checksCompleted) return;
  checksCompleted = true;
  
  if (err.code === 'EADDRINUSE') {
    console.log('⚠️ ', CHECKS.PORT_AVAILABLE.replace('✓', '!'));
    WARNINGS.push(`Port ${PORT} is already in use. Change PORT in .env or stop the existing process`);
  } else {
    console.log('❌', CHECKS.PORT_AVAILABLE.replace('✓', '✗'));
    ERRORS.push(`Port check failed: ${err.message}`);
  }
  printSummary();
});

server.once('listening', () => {
  console.log('✅', CHECKS.PORT_AVAILABLE);
  server.close();
  
  // Check 6: Internet connectivity (optional)
  const dns = require('dns');
  dns.resolve('api.tomtom.com', (err) => {
    if (checksCompleted) return;
    checksCompleted = true;
    
    if (err) {
      console.log('⚠️ ', CHECKS.INTERNET.replace('✓', '!'));
      WARNINGS.push('Cannot reach api.tomtom.com. Check your internet connection');
    } else {
      console.log('✅', CHECKS.INTERNET);
    }
    printSummary();
  });
});

server.listen(PORT);

function printSummary() {
  console.log('\n' + '='.repeat(50));
  
  if (ERRORS.length === 0 && WARNINGS.length === 0) {
    console.log('\n✅ All checks passed! You can start the server with: npm start\n');
  } else {
    if (ERRORS.length > 0) {
      console.log('\n❌ ERRORS that must be fixed:\n');
      ERRORS.forEach((err, i) => {
        console.log(`  ${i + 1}. ${err}`);
      });
    }
    
    if (WARNINGS.length > 0) {
      console.log('\n⚠️  WARNINGS (recommended to fix):\n');
      WARNINGS.forEach((warn, i) => {
        console.log(`  ${i + 1}. ${warn}`);
      });
    }
    
    if (ERRORS.length > 0) {
      console.log('\n❌ Cannot start server until errors are fixed.\n');
      console.log('For detailed help, see: TROUBLESHOOTING.md\n');
      process.exit(1);
    } else {
      console.log('\n⚠️  You can start the server, but warnings should be addressed.\n');
      console.log('Run: npm start\n');
    }
  }
}
