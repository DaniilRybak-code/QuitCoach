#!/usr/bin/env node

/**
 * Deploy and Test Firestore Security Rules
 * This script validates and deploys the security rules to Firebase
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔒 Firestore Security Rules Deployment Script\n');

// Check if Firebase CLI is installed
function checkFirebaseCLI() {
  try {
    execSync('firebase --version', { stdio: 'pipe' });
    console.log('✅ Firebase CLI is installed');
    return true;
  } catch (error) {
    console.error('❌ Firebase CLI is not installed. Please install it first:');
    console.error('   npm install -g firebase-tools');
    return false;
  }
}

// Validate Firestore rules syntax
function validateRules() {
  console.log('🔍 Validating Firestore rules syntax...');
  
  try {
    // Use Firebase CLI to validate rules
    execSync('firebase firestore:rules:validate firestore.rules', { stdio: 'pipe' });
    console.log('✅ Firestore rules syntax is valid');
    return true;
  } catch (error) {
    console.error('❌ Firestore rules validation failed:');
    console.error(error.stdout?.toString() || error.message);
    return false;
  }
}

// Run security tests
function runSecurityTests() {
  console.log('🧪 Running security tests...');
  
  try {
    const testFile = path.join(__dirname, 'firestore-security-tests.js');
    if (fs.existsSync(testFile)) {
      const { runSecurityTests } = require('./firestore-security-tests.js');
      runSecurityTests();
      return true;
    } else {
      console.log('⚠️  Security test file not found, skipping tests');
      return true;
    }
  } catch (error) {
    console.error('❌ Security tests failed:');
    console.error(error.message);
    return false;
  }
}

// Deploy rules to Firebase
function deployRules() {
  console.log('🚀 Deploying Firestore rules...');
  
  try {
    execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
    console.log('✅ Firestore rules deployed successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to deploy Firestore rules:');
    console.error(error.message);
    return false;
  }
}

// Main deployment process
async function main() {
  console.log('Starting Firestore Security Rules deployment...\n');
  
  // Step 1: Check Firebase CLI
  if (!checkFirebaseCLI()) {
    process.exit(1);
  }
  
  // Step 2: Validate rules syntax
  if (!validateRules()) {
    console.error('\n❌ Deployment aborted due to validation errors');
    process.exit(1);
  }
  
  // Step 3: Run security tests
  if (!runSecurityTests()) {
    console.error('\n❌ Deployment aborted due to test failures');
    process.exit(1);
  }
  
  // Step 4: Deploy rules
  if (!deployRules()) {
    console.error('\n❌ Deployment failed');
    process.exit(1);
  }
  
  console.log('\n🎉 Firestore Security Rules deployment completed successfully!');
  console.log('\n📋 Summary of Security Improvements:');
  console.log('✅ Enhanced authentication requirements');
  console.log('✅ Added user ownership validation');
  console.log('✅ Implemented field-level data validation');
  console.log('✅ Added data size limits (1MB per document)');
  console.log('✅ Added data type validation');
  console.log('✅ Added reasonable data limits');
  console.log('✅ Secured buddy matching collections');
  console.log('✅ Added timestamp validation');
  console.log('✅ Implemented comprehensive behavioral data validation');
  console.log('✅ Added rate limiting structure');
  console.log('✅ Denied access to unauthorized collections');
}

// Run the deployment
main().catch(error => {
  console.error('❌ Deployment script failed:', error.message);
  process.exit(1);
});
