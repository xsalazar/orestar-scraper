# ORESTAR Scraper

This application is used to help facilitate exporting data out of the ORESTAR database. It relies on interactive browser automation using `puppeteer` (https://pptr.dev/) and HTML manipulation using `cheerio` (https://cheerio.js.org/)

## Getting Started

```bash
cd ./app && npm install
```

## Running

```bash
node index.mjs
```

## Configuration

By default, the application will use the two variables defined in the script and process data day-by-day. These follow `MM/DD/YYYY` format.

The Excel spreadsheet data will be downloaded into a local `./downloads` directory. This directory is ignored, and Excel spreadsheets are not checked into this repository.

### Converting to `.csv`

```bash
node convert.mjs
```

This will convert Excel spreadsheets into the CSVs found in the [`./data`](./data/) directory

### Aggregating data

```bash
node merge.mjs
```

This will merge the daily data into aggregate data for full-months and full-years. The daily files are still tracked and maintained, but are largely more cumbersome to work with.

The aggregated data can be found in [`./data/agg`](./data/agg/).

## Considerations

Use of this tool is not intended to be malicious or destructive. Measures have been put in place to temper the speed of collection as to not impact production services. Additionally, it is not advised to export more than one-month at a time, at reasonable intervals.

Additionally, if any single day has more than 5000 records, manual intervention may be needed to export that data. The web interface does not have any more granular controls to request smaller chunks of information.