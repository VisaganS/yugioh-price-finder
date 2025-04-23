# Yu-Gi-Oh! Price Finder Backend

A Node.js/Express backend that scrapes Toronto hobby stores (Dollys, 401 Games, HobbiesVille) for Yu‑Gi‑Oh! card prices and exposes a unified API endpoint to retrieve the best prices across conditions and availability.

---

## Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Environment Variables](#environment-variables)
6. [Project Structure](#project-structure)
7. [Usage](#usage)
8. [API Endpoint](#api-endpoint)
9. [Error Handling](#error-handling)
10. [Debugging](#debugging)
11. [Contributing](#contributing)
12. [License](#license)

---

## Features

- **Unified Scraping**: Fetches live pricing and availability from Dollys, 401 Games, and HobbiesVille.
- **Price Comparison**: Flattens all variants across stores into a single list, sorted by lowest price.
- **Condition & Stock**: Returns condition (e.g. NM, LP) and stock status for each listing.
- **Direct Links**: Includes store URL for each card.
- **Simple API**: One endpoint (`/card/:cardName`) returning JSON.

---

## Tech Stack

- **Node.js** with **Express**
- **Puppeteer** for headless scraping
- **JavaScript (ES2020+)**

---

## Prerequisites

- [Node.js](https://nodejs.org/) v14 or newer
- npm (bundled with Node.js) or Yarn

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/VisaganS/yugioh-price-finder.git
   cd yugioh-price-finder
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

---

## Environment Variables

Optional `.env` file in project root:

```ini
PORT=3000    # HTTP port
DEBUG=true   # enable debug logging
```

---

## Project Structure

```
yugioh-price-finder/
├── src/
│   ├── utils/
│   │   └── logger.js              # Conditional logger function
│   ├── controllers/
│   │   └── scraperController.js   # orchestrates all store scrapers
│   ├── scrapers/
│   │   ├── dollysScraper.js       # Dollys Toys & Games
│   │   ├── scrape401games.js      # 401 Games
│   │   └── scrapeHBV.js           # HobbiesVille
│   └── index.js                   # Express server entry point
├── .env                           # environment overrides (gitignored)
├── .gitignore
├── package.json                   # project metadata & dependencies
└── README.md
```

---

## Usage

This project’s `package.json` includes the following scripts:

```json
"scripts": {
  "start": "node src/index.js",
  "dev": "nodemon src/index.js"
}
```

- **Start the server** (production mode):
  ```bash
  npm start
  ```

- **Start in development mode** (auto-reloads on file changes):
  ```bash
  npm run dev
  ```
  (Requires [nodemon]; install with `npm install --save-dev nodemon` if not already installed.)

## API Endpoint

### GET `/card/:cardName`

Returns a sorted list of all in-stock variants for the specified card across all stores.

**Request**
```http
GET /card/Dark Magician
Host: localhost:3000
```

**Response**
- **Status**: `200 OK`
- **Body**: JSON array of entries:
  ```json
  [
    {
      "name": "Dark Magician - TN23-EN001 - Ultra Rare",
      "store": "HobbiesVille",
      "condition": "NM",
      "stock": "In Stock",
      "price": "$1.00",
      "url": "https://hobbiesville.com/..."
    },
    { /* ... */ }
  ]
  ```

---

## Error Handling

- Individual scraper failures do not prevent others from returning results.
- On overall failure, the endpoint returns `500` with:
  ```json
  { "error": "Failed to fetch card prices" }
  ```

---

## Debugging

- Enable debug logs: set `DEBUG=true` in `.env`

---

## Contributing

If you'd like to contribute, please fork the repository and make changes as you'd like. Pull requests are warmly welcome.

---

## License

This project is licensed under an Unlicense license. This license does not require you to take the license with you to your project.

