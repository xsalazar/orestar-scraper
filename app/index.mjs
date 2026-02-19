import { launch } from "puppeteer";
import * as cheerio from "cheerio";
import fs from "node:fs";

async function main() {
  // Working variables
  var startDate = new Date("01/01/2026"); // Inclusive
  var endDate = new Date("01/01/2026"); // Exclusive

  // Launch the browser and open a new blank page.
  const browser = await launch({
    headless: false,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  const client = await page.createCDPSession();

  // Download behavior
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: "./downloads",
  });

  if (!fs.existsSync(`./downloads`)) {
    fs.mkdirSync(`./downloads`);
  }

  // Loop over set date range
  for (var day = startDate; day < endDate; day.setDate(day.getDate() + 1)) {
    // Navigate the page to a URL.
    await page.goto(
      `https://secure.sos.state.or.us/orestar/gotoPublicTransactionSearch.do`,
    );
    console.log("Loaded page");

    // Fill in date ranges
    await page
      .locator("#cneSearchTranStartDate")
      .fill(day.toLocaleDateString());
    await page.locator("#cneSearchTranEndDate").fill(day.toLocaleDateString());
    console.log(
      `Filled in date range: ${day.toLocaleDateString()} - ${day.toLocaleDateString()}`,
    );

    // Initiate search and wait for results to populate
    var button = page.locator('[name="search"]');
    await button.click();
    await page.waitForSelector('a[href*="XcelCNESearch"]');
    console.log("Searched");

    // Find how many results we have to process
    var resultsTable = await page.evaluate(() => {
      return document.querySelectorAll("table")[4].outerHTML;
    });
    var $ = cheerio.load(resultsTable);
    var numberOfResults = $("table tr td:contains('records found')")
      .text()
      .trim()
      .split(" ")[0];
    // The web viewer only returns the first 5000 results, both in the web view and data export
    // We should try and catch this and manually fix up
    console.log(
      `${numberOfResults >= 5000 ? "🚨 " : ""}Downloading ${numberOfResults} rows of data`,
    );

    // Download
    await page.click('a[href*="XcelCNESearch"]');

    // Sleep for random time, between 10 - 20 seconds
    await delay((Math.floor(Math.random() * 20) + 10) * 1000);
    fs.renameSync(
      `./downloads/XcelCNESearch.xls`,
      `./downloads/${day.toISOString()}.xls`,
    );

    /**
     * Local delay helper
     */
    function delay(time) {
      return new Promise(function (resolve) {
        setTimeout(resolve, time);
      });
    }
  }

  await browser.close();
}

main();
