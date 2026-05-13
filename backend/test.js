const scrapeNetmeds = require('./scrapers/netmeds');

scrapeNetmeds('paracetamol').then((results) => {
  console.log('Results:', JSON.stringify(results, null, 2));
});