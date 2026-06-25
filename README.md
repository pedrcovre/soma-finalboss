SOMA — Comparador de Suplementos

O SOMA é um comparador de preços de suplementos nacionais. Ele coleta produtos
reais de várias lojas via web scraping, salva no banco, compara preços de forma
imparcial e redireciona o usuário para o site oficial da marca.


Não é uma loja — é um comparador. Não vendemos nada: agregamos, comparamos e
redirecionamos (modelo Buscapé / Google Shopping).




Funcionalidades


Web scraping de 4 lojas reais (Growth, Max Titanium, Essential, DarkLab),
cada uma com a técnica adequada à sua proteção anti-bot.
Comparação de preço por grama (não por preço absoluto) — uma comparação justa
entre tamanhos diferentes.
Redirecionamento para a loja com rastreamento de cliques de saída.
Ofertas reais calculadas a partir do histórico de preços (queda de preço).
Páginas por objetivo (hipertrofia, emagrecimento, saúde, energia) com
produtos recomendados.
Tratamento honesto de avaliações: "Sem avaliações" em vez de "0 estrelas"
quando a loja não expõe rating.



Stack

Frontend: React 18 · Vite · Tailwind CSS · React Router
Backend: Node.js · Express · Mongoose
Banco: MongoDB Atlas
Scraping: Playwright (sites com anti-bot) · axios + cheerio (sites abertos)


Arquitetura

Scraper  →  MongoDB  →  API REST  →  Frontend (React)
(coleta)    (armazena)  (serve)      (exibe)

O scraper coleta os produtos das lojas e salva no MongoDB (upsert por SKU, sem
duplicar). A API REST serve esses dados, e o front consome via hooks, exibindo
catálogo, comparações e ofertas.


Como rodar

Pré-requisitos


Node.js 18+
Uma string de conexão do MongoDB Atlas


Backend

bashcd soma-backend
npm install
cp .env.example .env      # edite o .env com sua MONGODB_URI
npm run seed              # popula o banco (fallback inicial)
npm run dev               # API em http://localhost:4000

Frontend

bashnpm install
npm run dev               # site em http://localhost:5173


Defina VITE_API_URL=http://localhost:4000/api no .env do front.




Web Scraping

Cada loja exigiu uma abordagem diferente:

LojaProteçãoFerramentaVelocidadeGrowthChallenge NOCPlaywrightLentaMax TitaniumCloudflarePlaywrightLentaEssentialNenhumaaxios + cheerioRápidaDarkLabNenhumaaxios + cheerioRápida

A extração prioriza JSON-LD (dados estruturados embutidos nas páginas), mais
estável que ler o HTML diretamente.

Comandos

bashcd soma-backend
npm run scrape:essential   # rápido (segundos)
npm run scrape:darklab     # rápido
npm run scrape:growth      # lento (Playwright)
npm run scrape:max         # lento (Playwright)
npm run scrape:all         # todas em sequência

O scraper faz upsert por SKU: re-executar atualiza os produtos e registra
o histórico de preços, sem duplicar (saída "0 inseridos, X atualizados" é o
comportamento correto).


API — principais rotas

MétodoRotaDescriçãoGET/api/productslista com filtros e ordenaçãoGET/api/products/:iddetalhe de um produtoGET/api/dealsofertas (ou mais avaliados)GET/api/comparecomparação de preços por categoriaPOST/api/products/:id/clickregistra clique de saída


Boas práticas de scraping

Respeitamos o robots.txt de cada loja e aplicamos um intervalo entre requisições
para não sobrecarregar os servidores. O uso é acadêmico, para comparação de preços.


Equipe


Matheus Kilpp Nogueira — Tech Lead
Bernardo Hamilton — Engenheiro de Dados
Pedro Covre — Design
