const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const scrape1mg = require('../scrapers/onemg');
const scrapePharmeasy = require('../scrapers/pharmeasy');
const scrapeNetmeds = require('../scrapers/netmeds');
const { getSaltAlternatives } = require('../services/aiService');
const MedicineCache = require('../models/MedicineCache');

const getBrowser = async () => {
  console.log('NODE_ENV:', process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'production') {
    console.log('Launching production browser...');
    return puppeteer.launch({
      args: chromium.args,
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

const searchMedicine = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Medicine name is required' });
  }

  let browser = null;

  try {
    const query = name.toLowerCase().trim();

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

    browser = await getBrowser();

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

    const parsePrice = (priceStr) => {
      const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
      return isNaN(num) ? Infinity : num;
    };

    const sorted = all.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    const aiAnalysis = await getSaltAlternatives(name, sorted);

    await MedicineCache.create({ query, results: sorted, aiAnalysis });

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