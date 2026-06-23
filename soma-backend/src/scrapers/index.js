import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))

const scrapers = ['growth', 'maxtitanium', 'essential', 'darklab']

for (const name of scrapers) {
  console.log(`\n${'═'.repeat(50)}`)
  console.log(`▶  Scraper: ${name}`)
  console.log('═'.repeat(50))
  try {
    execSync(`node ${join(__dir, name + '.js')}`, { stdio: 'inherit' })
  } catch (err) {
    console.error(`❌ Scraper ${name} encerrou com erro (código ${err.status})`)
  }
}

console.log(`\n${'═'.repeat(50)}`)
console.log('✅ Todos os scrapers concluídos')

// Force-exit so open handles (Playwright, mongoose) don't hang the process
process.exit(0)
