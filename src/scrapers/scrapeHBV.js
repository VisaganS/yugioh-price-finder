const puppeteer = require('puppeteer');


async function scrapeHBV(cardName) {
    // format card name and URL
    const searchTerm = cardName.trim().replace(/\s+/g, '+');
    const searchURL = `https://hobbiesville.com/search.php?product_line=YuGiOh&sort=Relevance&limit=30&name=${searchTerm}&search_query=${searchTerm}`
    const searchTerms = cardName.trim().toLowerCase().split(/\s+/); // Used to filter the searched card name apart from similar names returned by webscraper

    console.log("Navigating to:", searchURL);
    // launch headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    try {
        await page.goto(searchURL, { waitUntil: 'networkidle2' });
        await new Promise(resolve => setTimeout(resolve, 5000)); 
        await page.evaluate(() => { debugger; });

        // evalulate page and click on in stock filter
        await page.evaluate(() => {

            // find instock filter
            const filters = document.querySelectorAll('.store-pass-collapsible-menu-content .RhJb8nzabad51bGhpkvw');
            const inStockFilter = Array.from(filters).find(filter => filter.textContent.trim().includes('In Stock'));
            
            // click on filter
            if(inStockFilter){
                inStockFilter.click();
            } else {
                console.log("No In Stock filter found");
            }
        })

        // wait for results to load from clicking instock filter
        await page.waitForFunction(() => {
            return document.querySelectorAll('.store-pass-products-section .store-pass-product').length > 0;
          }, { timeout: 10000 })

        // evaluate page and extract product details
        const products = await page.evaluate((searchTerms) => {
 
            const productCards = document.querySelectorAll('.store-pass-products-section .store-pass-product');

            return Array.from(productCards).map(card => {
                // extract product name
                const titleEl = card.querySelector('.store-pass-product-info .store-pass-product-title a');
                const name = titleEl ? titleEl.textContent.trim() : null;
                console.log(name);

                // retrieve price options based on condition
                const priceOptions = [];
                
                const variantsEl = card.querySelectorAll(".store-pass-product-select-area .store-pass-product-select option");
                variantsEl.forEach(variant => {
                    
                    //split text on " - " to seperate condition and price
                    const parts = variant.textContent.trim().split(' - ');

                    //retrieve condition
                    const condition = parts[0];

                    //only push if there's a dollar sign to filter out not in stock variants
                    let stock = "In Stock";

                    if (parts[1].includes("$")){
                        let price = parts[1];
                        
                        priceOptions.push({condition, stock, price});
                    }
                });
                return {name, priceOptions};
            })
            //filter out products with no variants
            .filter(product => {
                if (product.priceOptions.length != 0) { return product };
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

        console.log(JSON.stringify(products, null, 2));

        return products;
        
    } catch(err) {
        console.error('Error scraping HobbiesVille: ', err.message);
        return [];
    } finally {
        await browser.close();
    }
}

module.exports = { scrapeHBV };
