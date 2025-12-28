#!/usr/bin/env node

/**
 * Translation Validation Script
 *
 * Validates that English and Urdu translation files have identical key structures.
 * Exits with error if mismatches are found.
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'locales');
const EN_FILE = path.join(LOCALES_DIR, 'en.json');
const UR_FILE = path.join(LOCALES_DIR, 'ur.json');

// Load JSON files
function loadJSON(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error loading ${filepath}:`, error.message);
    process.exit(1);
  }
}

// Extract all keys from nested object
function extractKeys(obj, prefix = '') {
  let keys = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys = keys.concat(extractKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

// Main validation
console.log('🔍 Validating translation files...\n');

const enData = loadJSON(EN_FILE);
const urData = loadJSON(UR_FILE);

const enKeys = extractKeys(enData).sort();
const urKeys = extractKeys(urData).sort();

// Find missing keys
const missingInUrdu = enKeys.filter(key => !urKeys.includes(key));
const extraInUrdu = urKeys.filter(key => !enKeys.includes(key));

let hasErrors = false;

if (missingInUrdu.length > 0) {
  console.error('❌ Missing keys in ur.json:');
  missingInUrdu.forEach(key => console.error(`   - ${key}`));
  console.error('');
  hasErrors = true;
}

if (extraInUrdu.length > 0) {
  console.warn('⚠️  Extra keys in ur.json (not in en.json):');
  extraInUrdu.forEach(key => console.warn(`   - ${key}`));
  console.warn('');
  hasErrors = true;
}

if (hasErrors) {
  console.error('❌ Translation validation FAILED\n');
  process.exit(1);
} else {
  console.log('✅ Translation validation PASSED');
  console.log(`   Total keys: ${enKeys.length}`);
  console.log(`   All keys match between en.json and ur.json\n`);
  process.exit(0);
}
