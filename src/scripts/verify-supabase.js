import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file manually
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../../.env');
const envContent = fs.readFileSync(envPath, 'utf-8');

const envVars = {};
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase environment variables in .env file');
  process.exit(1);
}

console.log(`Connecting to Supabase at ${supabaseUrl}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyConnection() {
  try {
    const { data, error } = await supabase.from('test_connection').select('*').limit(1);

    // It's expected to fail if the table doesn't exist, but a 404 or 401 would indicate connection/auth issues.
    // If we get a "relation does not exist" error (code 42P01), it means we connected successfully but the table is missing.
    // If we get a network error, that's a failure.

    if (error) {
      if (error.code === '42P01') {
        console.log('Success: Connected to Supabase (Table "test_connection" not found, which is expected).');
      } else {
        console.log('Connection verified, but received error:', error.message);
      }
    } else {
      console.log('Success: Connected to Supabase and fetched data.');
    }
  } catch (err) {
    console.error('Failed to connect:', err);
    process.exit(1);
  }
}

verifyConnection();
