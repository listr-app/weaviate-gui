import axios from "axios";
import fs from "fs";

async function processBatch(batch) {
  const base64Images = [];

  for (const item of batch) {
    const imageUrl = item.image_uris?.normal; // Assuming the property is optional
    console.log({ imageUrl });

    if (imageUrl) {
      try {
        console.log(`Processing URL: ${imageUrl}`);
        const response = await axios.get(imageUrl, {
          responseType: "arraybuffer",
        });
        const imageBuffer = response.data;
        const base64Image = Buffer.from(imageBuffer).toString("base64");

        const itemWithBase64 = {
          ...item, // Copy all original properties
          base64Image, // Add the base64Image property
        };

        base64Images.push(itemWithBase64);
      } catch (error) {
        console.error(`Failed to process URL: ${imageUrl}`, error);
      }
    }
  }

  return base64Images;
}

const batchSize = 10; // Adjust the batch size as needed

const jsonData = JSON.parse(
  fs.readFileSync("../test/data/scryfall/unique-artwork.sample.json", "utf-8"),
);

const base64Images = [];

for (let i = 0; i < jsonData.length; i += batchSize) {
  const batch = jsonData.slice(i, i + batchSize);

  const batchBase64Images = await processBatch(batch);

  base64Images.push(...batchBase64Images);
}

const outputJsonFile = "../test/data/scryfall/new-data.json";
fs.writeFileSync(outputJsonFile, JSON.stringify(base64Images, null, 2));

console.log(`Wrote ${base64Images.length} images to ${outputJsonFile}`);
