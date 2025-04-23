const { scrape401games } = require('../scrapers/scrape401games');
const { scrapeDollys } = require('../scrapers/scrapeDollys')
const { scrapeHBV } = require('../scrapers/scrapeHBV')

/**
 * Execute all scrapers for a specified card,
 * merge results, and sort by lowest price.
 * 
 * @param {string} cardName
 * @returns {Promise<Array<{name: string, priceOptions: Array}}
**/
async function getCardPrices(cardName) {

    // Run each scraper in parallel
    const [dollys, games401, hbv ] =  await Promise.all([
        scrapeDollys(cardName),
        scrape401games(cardName),
        scrapeHBV(cardName)
    ]);
    

    const flatResults = [];

    for (product of dollys) {
        for (opt of product.priceOptions) {
            flatResults.push({
                name: product.name,
                store: 'Dollys',
                condition: opt.condition,
                stock: opt.stock,
                price: opt.price,
                link: product.link,
            });
        }
    }

    for (product of games401) {
        for (opt of product.priceOptions) {
            flatResults.push({
                name: product.name,
                store: '401Games',
                condition: opt.condition,
                stock: opt.stock,
                price: opt.price,
                link: product.link,
            });
        }
    }

    for (const product of hbv) {
        for (const opt of product.priceOptions) {
          flatResults.push({
            name: product.name,
            store: 'HobbiesVille',
            condition: opt.condition,
            stock: opt.stock,
            price: opt.price,
            link: product.link,
          });
        }
    }

    flatResults.sort((a, b) => {
        //// convert value from string to numeric, and sort from lowest to highest
        const pa = parseFloat(a.price.replace('$', '')); 
        const pb = parseFloat(b.price.replace('$', ''));
        return pa - pb;
    });

    console.log(flatResults);
    return flatResults;
}

module.exports = { getCardPrices };
