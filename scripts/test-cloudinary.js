#!/usr/bin/env node

// This script tests connectivity to Cloudinary
// Run with: node scripts/test-cloudinary.js

const { v2: cloudinary } = require('cloudinary');
const https = require('https');
const dns = require('dns');
const { promisify } = require('util');

const lookup = promisify(dns.lookup);

// Load environment variables
require('dotenv').config();

async function testCloudinaryConnectivity() {
  console.log('Testing Cloudinary connectivity...');
  
  // Test DNS resolution
  try {
    console.log('Resolving api.cloudinary.com...');
    const { address } = await lookup('api.cloudinary.com');
    console.log(`Resolved to IP: ${address}`);
  } catch (error) {
    console.error('DNS resolution failed:', error.message);
  }
  
  // Test HTTPS connection
  try {
    console.log('Testing HTTPS connection to api.cloudinary.com...');
    const req = https.get('https://api.cloudinary.com', (res) => {
      console.log(`HTTPS connection successful. Status: ${res.statusCode}`);
      res.on('data', () => {}); // Consume data
      res.on('end', () => {
        console.log('HTTPS connection closed');
      });
    });
    
    req.on('error', (error) => {
      console.error('HTTPS connection failed:', error.message);
    });
    
    req.setTimeout(10000, () => {
      console.log('HTTPS connection timed out');
      req.destroy();
    });
  } catch (error) {
    console.error('HTTPS request failed:', error.message);
  }
  
  // Test Cloudinary API
  try {
    console.log('Testing Cloudinary API...');
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      timeout: 60000,
    });
    
    const result = await cloudinary.api.ping();
    console.log('Cloudinary API test successful:', result);
  } catch (error) {
    console.error('Cloudinary API test failed:', error.message);
  }
}

// Run the test
testCloudinaryConnectivity().catch(console.error); 