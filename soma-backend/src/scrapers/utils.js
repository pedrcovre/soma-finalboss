import axios from 'axios'

export const SCRAPE_DELAY_MS = 2000
export const MAX_PER_LIST   = 5

export const delay = ms => new Promise(res => setTimeout(res, ms))

const HEADERS = {
  'User-Agent':      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'pt-BR,pt;q=0.9',
  'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

// Returns raw HTML string — no bot challenges on Magento/similar sites
export async function fetchHTML(url) {
  const { data } = await axios.get(url, { headers: HEADERS, timeout: 20000 })
  return data
}

// "R$219,90(Cada)" | "R$ 244,33" → 219.90 | 244.33
export function parsePriceBRL(text) {
  if (!text) return null
  const clean = text.replace(/\s/g, '')
  const match = clean.match(/[\d]+[.,][\d]{2}/)
  if (!match) return null
  return parseFloat(match[0].replace(',', '.')) || null
}

// Only records a new entry when price actually changed
export function pushPrice(history = [], newPrice) {
  const last = history[history.length - 1]
  if (!last || last.price !== newPrice) {
    return [...history, { price: newPrice, date: new Date() }]
  }
  return history
}

// Extract weight/serving from product name: "1Kg", "250gr", "120 caps", "60 cápsulas"
export function extractWeight(name) {
  const m = name.match(/(\d+(?:[.,]\d+)?\s*(?:kg|gr?|ml|l|cápsulas?|caps?|comprimidos?))/i)
  return m ? m[1].replace(',', '.').trim() : null
}

// Infer category from URL context label (passed from list) – used as primary source
// This function is a fallback for any case where list context isn't available
export function inferCategory(name) {
  const n = name.toLowerCase()
  if (/whey|proteína|protein|caseína|albumina/.test(n))         return 'Proteínas'
  if (/creatina|creatine/.test(n))                              return 'Creatina'
  if (/pré-treino|pre-treino|pre treino|pump|energy/.test(n))  return 'Pré-Treino'
  if (/bcaa|glutamina|aminoácido|leucina|valina|isoleucina/.test(n)) return 'Aminoácidos'
  if (/vitamina|ômega|omega|zinco|magnésio|cálcio|ferro/.test(n))   return 'Vitaminas'
  if (/termogênico|termogenico|carnitina|emagrecimento|burn/.test(n)) return 'Emagrecimento'
  return 'Outros'
}

export function inferGoals(category) {
  const map = {
    'Proteínas':    ['hipertrofia', 'saude'],
    'Creatina':     ['hipertrofia', 'energia'],
    'Pré-Treino':   ['energia', 'hipertrofia'],
    'Aminoácidos':  ['hipertrofia', 'saude'],
    'Vitaminas':    ['saude'],
    'Emagrecimento':['emagrecimento'],
  }
  return map[category] || ['saude']
}
