import 'dotenv/config'
import cron   from 'node-cron'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join }  from 'path'

const __dir   = dirname(fileURLToPath(import.meta.url))
const SCRAPER = join(__dir, 'scrapers/index.js')
const SCHEDULE = '0 */6 * * *'   // every 6 hours on the hour

// ── Run scrape:all as a child process ────────────────────────
// Using spawn (not execSync) so the event loop stays alive for cron.
function runScraper() {
  return new Promise(resolve => {
    const start = Date.now()
    const ts    = () => new Date().toISOString()
    console.log(`\n[${ts()}] ▶ Iniciando scrape:all`)

    const child = spawn('node', [SCRAPER], {
      stdio: 'inherit',
      env:   process.env,
    })

    child.on('close', code => {
      const elapsed = ((Date.now() - start) / 1000).toFixed(0)
      if (code === 0 || code === null) {
        console.log(`[${ts()}] ✅ scrape:all concluído em ${elapsed}s`)
      } else {
        console.error(`[${ts()}] ❌ scrape:all finalizou com código ${code} em ${elapsed}s`)
      }
      resolve()
    })

    child.on('error', err => {
      console.error(`[${new Date().toISOString()}] ❌ Erro ao iniciar scraper: ${err.message}`)
      resolve()
    })
  })
}

// ── Setup ────────────────────────────────────────────────────
console.log('[SOMA Scheduler] Iniciando processo de agendamento')
console.log(`[SOMA Scheduler] Schedule: ${SCHEDULE} (a cada 6 horas)`)
console.log('[SOMA Scheduler] Executando UMA vez imediatamente...')

// Register cron first so the schedule is live before the first run starts
cron.schedule(SCHEDULE, async () => {
  console.log(`\n[${new Date().toISOString()}] ⏰ Cron disparado`)
  await runScraper()
})

// Run once immediately on startup — ensures priceHistory is captured now
runScraper().then(() => {
  console.log(`\n[${new Date().toISOString()}] [SOMA Scheduler] Execução inicial concluída`)
  console.log(`[SOMA Scheduler] Aguardando próxima execução agendada...`)
})
