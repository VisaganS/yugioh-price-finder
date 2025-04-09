const puppeteer = require('puppeteer')


async function scrape401games(cardName) {
    // format card name and URL
    const searchTerm = cardName.trim().replace(/\s+/g, '+');
    const searchURL = `https://store.401games.ca/pages/search-results?q=${searchTerm}`
    
    // launch headless browser 
    let browser;
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
        // set page configs and navigate to the search URL
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36');
        page.setDefaultNavigationTimeout(2 * 60 * 1000);
        await page.goto(searchURL, { waitUntil: 'networkidle2'});

        // evaluate page and extract product details
        const products = await page.evaluate(() => {
            // get all products inside product grid
            const productCards = Array.from(document.querySelectorAll('.products-grid .product-card')); // use Array.from() to convert nodelist to array for .map() operations

            return productCards.forEach(card => {
                // extract product name
                const titleEl = card.querySelector('.product-card-items-wrapper .info-container .title-container .title-wrapper .title');
                const name = titleEl ? titleEl.textContent.trim() : null;
                
                // extract product price
                const priceEl = product.querySelector('.product-card-items-wrapper .info-container .price-container .price')
                let price = priceEl ? priceEl.textContent.trim() : null;
                //remove CAD from price text

                return { name, price };
            }); 
        });
        console.log('Products: ', products);
        await browser.close();
        return products;
    } catch(err) {
        console.error('Error scraping 401 Games: ', err.message);
        return [];
    }
}

scrape401games('Bystial Lubellion')