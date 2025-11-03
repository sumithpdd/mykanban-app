/**
 * Test Firebase Admin SDK Connection
 * This verifies your service account can connect to Firestore
 */

const admin = require('firebase-admin');
const path = require('path');

console.log('🔍 Testing Firebase connection...\n');

// Check environment variable
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
console.log('📋 Service Account Path:', serviceAccountPath || 'NOT SET');

if (!serviceAccountPath) {
  console.error('\n❌ Error: GOOGLE_APPLICATION_CREDENTIALS environment variable not set');
  console.log('\nSet it with:');
  console.log('  set GOOGLE_APPLICATION_CREDENTIALS=C:\\path\\to\\serviceAccountKey.json');
  process.exit(1);
}

// Check if file exists
const fs = require('fs');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('\n❌ Error: Service account file not found at:', serviceAccountPath);
  process.exit(1);
}

console.log('✅ Service account file exists\n');

// Read and check project ID
try {
  const serviceAccount = require(path.resolve(serviceAccountPath));
  console.log('📁 Project ID in service account:', serviceAccount.project_id);
  console.log('📧 Service account email:', serviceAccount.client_email);
  console.log('✅ Service account file is valid');
} catch (e) {
  console.error('\n❌ Error reading service account file:', e.message);
  process.exit(1);
}

// Initialize Firebase
try {
  admin.initializeApp({
    credential: admin.credential.cert(require(path.resolve(serviceAccountPath)))
  });
  console.log('\n✅ Firebase Admin initialized successfully');
} catch (e) {
  console.error('\n❌ Error initializing Firebase Admin:', e.message);
  process.exit(1);
}

// Test Firestore connection
const db = admin.firestore();

async function testConnection() {
  try {
    console.log('\n🔍 Testing Firestore connection...');
    
    // List existing collections
    const collections = await db.listCollections();
    console.log('\n📚 Existing collections:');
    collections.forEach(col => {
      console.log('  -', col.id);
    });
    
    // Test creating OKR collection
    console.log('\n🎯 Attempting to create test OKR document...');
    const testOkr = {
      ownerId: 'test@example.com',
      objective: 'TEST - Delete this',
      keyResults: [{
        id: 'test-kr-1',
        text: 'Test key result',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }],
      status: 'In Progress',
      category: ['Test'],
      progress: 0,
      archived: false,
      isOrganizational: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const okrRef = await db.collection('okrs').add(testOkr);
    console.log('✅ Test OKR created with ID:', okrRef.id);
    
    // Verify it was created
    const okrDoc = await okrRef.get();
    if (okrDoc.exists) {
      console.log('✅ Test OKR verified in Firestore');
      console.log('   Objective:', okrDoc.data().objective);
    }
    
    // Clean up - delete test document
    await okrRef.delete();
    console.log('✅ Test OKR deleted (cleanup complete)');
    
    console.log('\n✨ All tests passed! Connection working correctly.');
    console.log('\n🚀 Now you can run:');
    console.log('   node data-migration/seed-categories.js');
    console.log('   node data-migration/seed-okrs-with-tasks.js your-email@example.com');
    
  } catch (error) {
    console.error('\n❌ Error during Firestore test:', error);
    console.error('\nDetails:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  } finally {
    await admin.app().delete();
  }
}

testConnection();

