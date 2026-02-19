import fs from "node:fs";

async function main() {
  var years = ["2026"];
  var months = [
    "01",
    // "02",
    // "03",
    // "04",
    // "05",
    // "06",
    // "07",
    // "08",
    // "09",
    // "10",
    // "11",
    // "12",
  ];

  years.forEach((year) => {
    // Pre-create the aggregate year folder if we don't have it yet
    if (!fs.existsSync(`./data/agg/${year}`)) {
      fs.mkdirSync(`./data/agg/${year}`);
    }

    // Go through each month and aggregate each days into one file for the month
    // Store this in its own agg directory
    months.forEach((month) => {
      var aggMonth = [];
      fs.readdirSync(`./data/${year}/${month}`)
        .filter((fileName) => fileName.endsWith(".csv"))
        .forEach((fileName) => {
          var file = fs.readFileSync(
            `./data/${year}/${month}/${fileName}`,
            "utf-8",
          );

          var rows = file.split("\n");

          if (aggMonth.length === 0) {
            // Keep header on first file
            aggMonth.push(...rows);
          } else {
            // Remove header from all subsequent files
            rows.shift();
            aggMonth.push(...rows);
          }
        });

      console.log(`${year}-${month} - ${aggMonth.length}`);
      fs.writeFileSync(
        `./data/agg/${year}/${year}-${month}.csv`,
        aggMonth.join("\n"),
      );
    });

    // Now take each aggregate month and combine into one file for the year
    var aggYear = [];
    fs.readdirSync(`./data/agg/${year}`)
      .filter((fileName) => fileName.endsWith(".csv"))
      .forEach((fileName) => {
        var file = fs.readFileSync(`./data/agg/${year}/${fileName}`, "utf-8");

        var rows = file.split("\n");

        if (aggYear.length === 0) {
          aggYear.push(...rows);
        } else {
          rows.shift();
          aggYear.push(...rows);
        }
      });

    console.log(`${year} - ${aggYear.length}`);
    fs.writeFileSync(`./data/agg/${year}/${year}.csv`, aggYear.join("\n"));
  });
}

main();
