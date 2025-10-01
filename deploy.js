const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting manual deployment...');

try {
  // Build the project
  console.log('📦 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Check if dist directory exists
  if (!fs.existsSync('dist')) {
    throw new Error('Build failed - dist directory not found');
  }
  
  console.log('✅ Build completed successfully!');
  console.log('📁 Built files are in the dist/ directory');
  console.log('🌐 You can now manually upload the dist/ contents to GitHub Pages');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
