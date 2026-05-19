const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const scrape1mg = require('../scrapers/onemg');
const scrapePharmeasy = require('../scrapers/pharmeasy');
const scrapeNetmeds = require('../scrapers/netmeds');
const { getSaltAlternatives } = require('../services/aiService');
const MedicineCache = require('../models/MedicineCache');

const getBrowser = async () => {
  const isProduction = process.env.RENDER || process.env.NODE_ENV === 'production';
  console.log('Is production:', isProduction);

  if (isProduction) {
    return puppeteer.launch({
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--single-process',
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  } else {
    return puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    });
  }
};

// Filter results to only relevant medicines
const filterResults = (results, query) => {
  const words = query.toLowerCase().split(' ').filter(w => w.length > 1);

  // Single word query — trust pharmacy search, return all results
  if (words.length === 1) return results;

  // Multi-word query — filter by first word only (main medicine name)
  const mainKeyword = words[0];
  const filtered = results.filter(item =>
    item.name.toLowerCase().includes(mainKeyword)
  );

  // Safety net — if filter removes everything, return all results
  return filtered.length > 0 ? filtered : results;
};

const parsePrice = (priceStr) => {
  const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? Infinity : num;
};

const searchMedicine = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Medicine name is required' });
  }

  let browser = null;

  try {
    // Normalize query — handles Calpol-500, CALPOL 500, calpol  500 etc.
    const query = name
      .toLowerCase()
      .trim()
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ');

    // Check cache first
    const cached = await MedicineCache.findOne({ query });
    if (cached) {
      console.log('Serving from cache:', query);
      return res.json({
        query,
        totalResults: cached.results.length,
        results: cached.results,
        aiAnalysis: cached.aiAnalysis,
      });
    }

    console.log(`Searching for: ${name}`);
    const start = Date.now();

    browser = await getBrowser();

    // Run all 3 scrapers in parallel
    const [onemgResults, pharmaeasyResults, netmedsResults] = await Promise.allSettled([
      scrape1mg(name, browser),
      scrapePharmeasy(name, browser),
      scrapeNetmeds(name, browser),
    ]);

    await browser.close();
    browser = null;

    const all = [
      ...(onemgResults.status === 'fulfilled' ? onemgResults.value : []),
      ...(pharmaeasyResults.status === 'fulfilled' ? pharmaeasyResults.value : []),
      ...(netmedsResults.status === 'fulfilled' ? netmedsResults.value : []),
    ];

    // Filter irrelevant results first
    const filtered = filterResults(all, query);

    // Sort by price
    const sorted = filtered.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));

    // Now pass filtered results to AI — much more accurate
    const aiAnalysis = await getSaltAlternatives(name, sorted);

    // Save to cache
    await MedicineCache.create({ query, results: sorted, aiAnalysis });

    console.log(`✅ Search completed in ${Date.now() - start}ms`);

    return res.json({
      query,
      totalResults: sorted.length,
      results: sorted,
      aiAnalysis,
    });

  } catch (error) {
    console.error('Search error:', error.message);
    if (browser) await browser.close();
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = { searchMedicine };