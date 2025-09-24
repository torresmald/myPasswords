import { writeFileSync, mkdirSync } from 'fs'

import dotenv from 'dotenv'

dotenv.config()

const targetPath = './src/environments/environment.ts'
const targetGit = './src/environments/.gitkeep'
const targetPathDev = './src/environments/environment.development.ts'

const API_URL = process.env['API_URL']
const API_URL_PROD = process.env['API_URL_PROD']

if (!API_URL || !API_URL_PROD) {
  throw new Error('API URL not found')
}

const envFileContent = `
export const environment = {
  API_URL: "${API_URL}",
  API_URL_PROD: "${API_URL_PROD}"
};
`
const gitKeep = ``

mkdirSync('./src/environments', {recursive: true})

writeFileSync(targetPath, envFileContent)
writeFileSync(targetGit, gitKeep)
writeFileSync(targetPathDev, envFileContent)
