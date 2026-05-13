const scrape1mg = require('../scrapers/onemg');
const scrapePharmeasy = require('../scrapers/pharmeasy');
const scrapeNetmeds = require('../scrapers/netmeds');

const searchMedicine = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Medicine name is required' });
  }

  try {
    console.log(`Searching for: ${name}`);

    // Run all 3 scrapers simultaneously
    const [onemgResults, pharmaeasyResults, netmedsResults] = await Promise.allSettled([
      scrape1mg(name),
      scrapePharmeasy(name),
      scrapeNetmeds(name)
    ]);

    // Extract values safely (if a scraper fails, use empty array)
    const all = [
      ...(onemgResults.status === 'fulfilled' ? onemgResults.value : []),
      ...(pharmaeasyResults.status === 'fulfilled' ? pharmaeasyResults.value : []),
      ...(netmedsResults.status === 'fulfilled' ? netmedsResults.value : []),
    ];

    // Convert price string like "₹26.34" to a number for sorting
    const parsePrice = (priceStr) => {
      const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
      return isNaN(num) ? Infinity : num;
    };

    // Sort by price low to high
    const sorted = all.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));

    return res.json({
      query: name,
      totalResults: sorted.length,
      results: sorted
    });

  } catch (error) {
    console.error('Search error:', error.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = { searchMedicine };