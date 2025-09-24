const fs = require('fs');
const path = require('path');
const successColor = '\x1b[32m%s\x1b[0m';
const checkSign = '\u{2705}';

// Load environment variables
require('dotenv').config();

// Generate environment files content
const generateEnvironment = (production = false) => `export const environment = {
  production: ${production},
  API_URL: '${process.env.API_URL_PROD || (production ? process.env.API_URL_PROD : process.env.API_URL_DEV)}'
};
`;

// Generate production environment
const prodEnvFile = generateEnvironment(true);
const prodTargetPath = path.join(__dirname, './src/environments/environment.ts');

fs.writeFileSync(prodTargetPath, prodEnvFile);
console.log(successColor, `${checkSign} Successfully generated environment.ts`);

// Generate development environment
const devEnvFile = generateEnvironment(false);
const devTargetPath = path.join(__dirname, './src/environments/environment.development.ts');

fs.writeFileSync(devTargetPath, devEnvFile);
console.log(successColor, `${checkSign} Successfully generated environment.development.ts`);

console.log('Environment files generated successfully!');
console.log('Production API_URL:', process.env.API_URL_PROD || 'Using default');
console.log('Development API_URL: http://localhost:3000/api');
