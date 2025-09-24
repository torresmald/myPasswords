import { writeFileSync, mkdirSync } from 'fs'

import dotenv from 'dotenv'

dotenv.config()

const targetPath = './src/environments/environment.ts'
const targetGit = './src/environments/.gitkeep'
const targetPathDev = './src/environments/environment.development.ts'

// Para desarrollo local usa localhost, para producción usa variable de entorno
const API_URL_DEV = process.env['API_URL_DEV'] || 'http://localhost:3000/api'
const API_URL_PROD = process.env['API_URL_PROD'] || 'https://your-backend-production.com/api'

// En Vercel, solo necesitamos la URL de producción
const envFileContentProd = `export const environment = {
  production: true,
  API_URL: "${API_URL_PROD}"
};
`

// Para desarrollo local, usa localhost
const envFileContentDev = `export const environment = {
  production: false,
  API_URL: "${API_URL_DEV}"
};
`
const gitKeep = ``

mkdirSync('./src/environments', {recursive: true})

writeFileSync(targetPath, envFileContentProd)
writeFileSync(targetGit, gitKeep)
writeFileSync(targetPathDev, envFileContentDev)

console.log('✅ Environment files generated:')
console.log(`📁 Production (environment.ts): ${API_URL_PROD}`)
console.log(`🔧 Development (environment.development.ts): ${API_URL_DEV}`)
