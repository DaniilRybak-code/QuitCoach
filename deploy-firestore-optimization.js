#!/usr/bin/env node

/**
 * Deploy Firestore Optimization
 * Deploys optimized indexes and configuration
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Firestore Optimization Deployment Script\n');

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

// Validate Firestore indexes
function validateIndexes() {
  console.log('🔍 Validating Firestore indexes...');
  
  try {
    // Check if indexes file exists and is valid JSON
    const indexesPath = path.join(__dirname, 'firestore.indexes.json');
    if (!fs.existsSync(indexesPath)) {
      throw new Error('firestore.indexes.json not found');
    }
    
    const indexesContent = fs.readFileSync(indexesPath, 'utf8');
    const indexes = JSON.parse(indexesContent);
    
    // Validate structure
    if (!indexes.indexes || !Array.isArray(indexes.indexes)) {
      throw new Error('Invalid indexes structure');
    }
    
    console.log(`✅ Found ${indexes.indexes.length} indexes to deploy`);
    console.log(`✅ Found ${indexes.fieldOverrides?.length || 0} field overrides`);
    
    return true;
  } catch (error) {
    console.error('❌ Index validation failed:', error.message);
    return false;
  }
}

// Deploy Firestore indexes
function deployIndexes() {
  console.log('🚀 Deploying Firestore indexes...');
  
  try {
    execSync('firebase deploy --only firestore:indexes', { stdio: 'inherit' });
    console.log('✅ Firestore indexes deployed successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to deploy Firestore indexes:', error.message);
    return false;
  }
}

// Deploy Firestore rules
function deployRules() {
  console.log('🚀 Deploying Firestore rules...');
  
  try {
    execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
    console.log('✅ Firestore rules deployed successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to deploy Firestore rules:', error.message);
    return false;
  }
}

// Deploy hosting with optimized code
function deployHosting() {
  console.log('🚀 Deploying optimized hosting...');
  
  try {
    execSync('firebase deploy --only hosting', { stdio: 'inherit' });
    console.log('✅ Optimized hosting deployed successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to deploy hosting:', error.message);
    return false;
  }
}

// Build the application
function buildApplication() {
  console.log('🔨 Building optimized application...');
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Application built successfully');
    return true;
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    return false;
  }
}

// Main deployment process
async function main() {
  console.log('Starting Firestore Optimization deployment...\n');
  
  // Step 1: Check Firebase CLI
  if (!checkFirebaseCLI()) {
    process.exit(1);
  }
  
  // Step 2: Validate indexes
  if (!validateIndexes()) {
    console.error('\n❌ Deployment aborted due to index validation errors');
    process.exit(1);
  }
  
  // Step 3: Build application
  if (!buildApplication()) {
    console.error('\n❌ Deployment aborted due to build failure');
    process.exit(1);
  }
  
  // Step 4: Deploy Firestore indexes
  if (!deployIndexes()) {
    console.error('\n❌ Deployment aborted due to index deployment failure');
    process.exit(1);
  }
  
  // Step 5: Deploy Firestore rules
  if (!deployRules()) {
    console.error('\n❌ Deployment aborted due to rules deployment failure');
    process.exit(1);
  }
  
  // Step 6: Deploy hosting
  if (!deployHosting()) {
    console.error('\n❌ Deployment aborted due to hosting deployment failure');
    process.exit(1);
  }
  
  console.log('\n🎉 Firestore Optimization deployment completed successfully!');
  console.log('\n📋 Summary of Optimizations:');
  console.log('✅ Enhanced composite indexes for complex queries');
  console.log('✅ Optimized behavioral data queries with pagination');
  console.log('✅ Implemented query result caching');
  console.log('✅ Added performance monitoring and analytics');
  console.log('✅ Reduced bandwidth usage for mobile users');
  console.log('✅ Improved real-time listener efficiency');
  console.log('✅ Added batch operation support');
  console.log('✅ Implemented mobile-specific optimizations');
  
  console.log('\n🔧 Next Steps:');
  console.log('1. Monitor query performance in Firebase Console');
  console.log('2. Review optimization recommendations');
  console.log('3. Test mobile performance improvements');
  console.log('4. Consider implementing additional caching strategies');
}

// Run the deployment
main().catch(error => {
  console.error('❌ Deployment script failed:', error.message);
  process.exit(1);
});
