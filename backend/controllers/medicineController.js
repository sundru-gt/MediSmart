const scrape1mg = require('../scrapers/onemg');
const scrapePharmeasy = require('../scrapers/pharmeasy');
const scrapeNetmeds = require('../scrapers/netmeds');
const { getSaltAlternatives } = require('../services/aiService');
const MedicineCache = require('../models/MedicineCache');

const searchMedicine = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Medicine name is required' });
  }

  try {
    const query = name.toLowerCase().trim();

    // Check cache first
    const cached = await MedicineCache.findOne({ query });
    if (cached) {
      console.log('Serving from cache:', query);
      return res.json({
        query,
        totalResults: cached.results.length,
        results: cached.results,
        aiAnalysis: cached.aiAnalysis,
        fromCache: true
      });
    }

    console.log(`Searching for: ${name}`);

    const [onemgResults, pharmaeasyResults, netmedsResults] = await Promise.allSettled([
      scrape1mg(name),
      scrapePharmeasy(name),
      scrapeNetmeds(name)
    ]);

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

    // Save to cache
    await MedicineCache.create({
      query,
      results: sorted,
      aiAnalysis
    });

    console.log('Saved to cache:', query);

    return res.json({
      query,
      totalResults: sorted.length,
      results: sorted,
      aiAnalysis,
      fromCache: false
    });

  } catch (error) {
    console.error('Search error:', error.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = { searchMedicine };