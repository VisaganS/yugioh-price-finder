const puppeteer = require('puppeteer');


async function scrapeDollys(cardName) {
    // format card name and URL
    const searchTerm = cardName.trim().replace(/\s+/g, '+');
    const searchURL = `https://www.dollys.ca/products/search?q=${searchTerm}&c=228`
    const searchTerms = cardName.trim().toLowerCase().split(/\s+/); // Used to filter the searched card name apart from similar names returned by webscraper

    console.log("Navigating to:", searchURL);
    // launch headless browser
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    try {
        await page.goto(searchURL, { waitUntil: 'networkidle2' });
        await new Promise(resolve => setTimeout(resolve, 5000)); 
        await page.evaluate(() => { debugger; });

        // evaluate page and extract product details
        const products = await page.evaluate((searchTerms) => {
         
            const productCards = document.querySelectorAll('.inner');

            return Array.from(productCards).map(card => {
                // extract product name
                const titleEl = card.querySelector('.image-meta .meta .name');
                const name = titleEl ? titleEl.textContent.trim() : null;
                
                // extract product price
                const priceEl = card.querySelector('.name')
                let price = priceEl ? priceEl.textContent.trim() : null;
                //remove CAD from price text
                if (price) {
                    price = price.replace('CAD', '').trim();
                }

                // extract availability
                const stockEl = card.querySelector('.product-card-items-wrapper .image-wrapper .in-stock-wrapper')
                let stock = stockEl ? 'In Stock' : 'Out of Stock';

                return { name, price, stock };
            })
            // filter out products that don't include all search terms
            .filter(product => {
                if (!product.name){
                    return false;
                } else {
                    const lowerName = product.name.toLowerCase();
                    return searchTerms.every(term => lowerName.includes(term));
                } 
            });
        }, searchTerms);
        console.log('Products: ', products);
        return products;
        
    } catch(err) {
        console.error('Error scraping 401 Games: ', err.message);
        return [];
    } finally {
        await browser.close();
    }
}

scrapeDollys("Dark Magician");