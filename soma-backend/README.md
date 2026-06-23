# SOMA Backend

API REST para o comparador de suplementos SOMA.

## Rotas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/products | Todos os produtos (filtros: brand, category, goal, featured) |
| GET | /api/products/:id | Produto por ID |
| GET | /api/deals | Produtos em oferta ou destaque |
| GET | /api/bestsellers | Top 4 por avaliação |
| GET | /health | Health check |

## Setup

```bash
cd soma-backend
npm install
cp .env.example .env
# Edite .env com sua MONGODB_URI
npm run seed   # Popula o banco com 12 produtos
npm run dev    # Inicia a API em http://localhost:4000
```

## Rotas adicionais

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/deals | Ofertas reais (queda de preço) ou fallback top-rated |
| GET | /api/compare | Comparativo de preço por categoria |
| GET | /api/compare/:category | Comparativo detalhado de uma categoria |
| GET | /api/stats/top-clicked | Top 10 produtos por cliques de saída |
| POST | /api/products/:id/click | Registrar clique de saída (outbound tracking) |

## Scrapers

Raspa as 4 lojas e faz upsert idempotente por `sku` (não duplica em execuções repetidas). `priceHistory` só cresce quando o preço muda.

```bash
npm run scrape:all        # todas as 4 lojas em sequência
npm run scrape:growth     # Growth Supplements (Playwright + JSON-LD)
npm run scrape:max        # Max Titanium (Playwright + ProductGroup VTEX)
npm run scrape:essential  # Essential Nutrition (axios + JSON-LD + aggregateRating)
npm run scrape:darklab    # DarkLab (axios + JSON-LD Shopify)
```

## Agendamento de Scraper

### Caminho A — Render Cron Job (produção recomendada)

Configure um **Cron Job separado** no Render (não dentro do Web Service, para não ser afetado pela hibernação):

| Campo | Valor |
|-------|-------|
| **Nome** | `soma-scraper` |
| **Comando** | `npm run scrape:all` |
| **Schedule** | `0 */6 * * *` (a cada 6 horas) |
| **Root Dir** | `soma-backend` |
| **Env vars** | As mesmas do Web Service (`MONGODB_URI`, `CORS_ORIGIN`) |

> A cada execução o scraper atualiza preços, registra `priceHistory` e alimenta o endpoint `/api/deals` com ofertas reais (queda de preço vs. pico histórico).

### Caminho B — Scheduler local (rodar agora, sem Render)

Processo standalone que usa `node-cron`. **Independente da API** — rode em terminal separado:

```bash
npm run scheduler
```

- Executa `scrape:all` **imediatamente** ao iniciar (captura preços agora).
- Agenda execuções a cada 6 horas (`0 */6 * * *`).
- Falha isolada por loja: se Growth falhar, Max/Essential/DarkLab continuam.
- Nunca crasha o agendador por erro pontual de um scraper.
- Pode rodar em paralelo com `npm run dev` (processos independentes).

## Variáveis de ambiente

```
PORT=4000
MONGODB_URI=mongodb+srv://...
CORS_ORIGIN=http://localhost:5173
```
