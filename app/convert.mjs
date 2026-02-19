import fs from "node:fs";
import pkg from "xlsx";
const { readFile, writeFile } = pkg;

async function main() {
  fs.readdirSync(`./downloads`).forEach((inputFileName) => {
    var outputFileName = `${inputFileName.split(".xls")[0]}.csv`;
    var year = outputFileName.split("-")[0];
    var month = outputFileName.split("-")[1];
    var outputFilePath = `./data/${year}/${month}/${outputFileName}`;

    // Only convert if it doesn't exist already
    if (!fs.existsSync(outputFilePath)) {
      // Create output year/month if we don't have it
      if (!fs.existsSync(`./data/${year}/${month}`)) {
        fs.mkdirSync(`./data/${year}/${month}`, { recursive: true });
      }

      console.log(`Converting: ${inputFileName}`);
      const workBook = readFile(`./downloads/${inputFileName}`);
      writeFile(workBook, `${outputFilePath}`, {
        bookType: "csv",
      });
    }
  });
}

main();
