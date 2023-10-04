import axios from "axios";
import fs from "fs";

// Function to process a single item and return a promise
async function processItem(item) {
  const imageUrl = item.image_uris?.png; // Assuming the property is optional

  console.log(!!imageUrl);
  if (imageUrl) {
    try {
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      const imageBuffer = response.data;
      const base64Image = Buffer.from(imageBuffer).toString("base64");
      console.log(!!base64Image);
      const cardName = item.name;

      return {
        name: cardName, // Copy all original properties
        base64Image, // Add the base64Image property
      };
    } catch (error) {
      console.error(`Failed to process URL: ${imageUrl}`, error);
      return null;
    }
  }
  console.log("no image url");

  return null;
}

const batchSize = 100; // Adjust the batch size as needed

const jsonData = JSON.parse(
  fs.readFileSync(
    "/Users/beni/Documents/Listr-New/weaviate-gui/test/data/scryfall/default-main.json",
    "utf-8",
  ),
);

const base64Images = [];

// Function to process a batch of items concurrently
async function processBatchConcurrently(batch) {
  const promises = batch.map(processItem);

  // Use Promise.all() to execute all promises concurrently
  const results = await Promise.all(promises);

  // Filter out any null results (failed processing)
  return results.filter((result) => result !== null);
}

async function main() {
  let index = 0; // Initialize the index counter

  for (let i = 0; i < jsonData.length; i += batchSize) {
    const batch = jsonData.slice(i, i + batchSize);

    const batchBase64Images = await processBatchConcurrently(batch);

    base64Images.push(...batchBase64Images);

    // Log the current index
    console.log(`Processed ${index + 1} items`);
    index += batchSize; // Increment the index by the batch size
  }

  const outputJsonFile =
    "/Users/beni/Documents/Listr-New/weaviate-gui/test/data/scryfall/new-data-9.json";

  fs.writeFileSync(outputJsonFile, JSON.stringify(base64Images, null, 2));

  console.log(`Wrote ${base64Images.length} images to ${outputJsonFile}`);
}

main();
