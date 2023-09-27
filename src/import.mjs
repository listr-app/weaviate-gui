import { ObjectsBatcher, generateUuid5 } from "weaviate-ts-client";
import { getWeaviateClient } from "./client.mjs";
import fs from "fs";

const sourceBase = "../web-app/src/assets";
const sourceJsonFile = "../test/data/scryfall/new-data-2.json"; // Path to your JSON file

const client = getWeaviateClient();

export const importMediaFiles = async (collectionName) => {
  const data = readJsonFile(sourceJsonFile);

  if (!data) {
    console.error("Error reading JSON file.");
    return;
  }

  await insertObjects(collectionName, data);
};

const readJsonFile = (filePath) => {
  try {
    const rawData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error reading JSON file: `);
    return null;
  }
};

const insertObjects = async (collectionName, data) => {
  let batcher = client.batch.objectsBatcher();
  let counter = 0;
  const batchSize = 5;

  console.log(`Importing ${data.length} objects.`);

  for (const item of data) {
    console.log(`Adding [${item.toString()}]: ${item.name}`);
    console.log({ item });

    batcher = batcher.withObject({
      class: collectionName,
      properties: {
        name: item.name,
        image: item.base64Image,
        type: "image", // Use the base64 data from JSON
      },
    });

    if (++counter == batchSize) {
      console.log(`Flushing ${counter} items.`);

      // flush the batch queue
      await batcher.do();

      // restart the batch queue
      counter = 0;
      batcher = client.batch.objectsBatcher();
    }
  }

  if (counter > 0) {
    console.log(`Flushing remaining ${counter} item(s).`);
    await batcher.do();
  }
};

// Call importMediaFiles with your collection name
const collectionName = "ScryfallCard";
importMediaFiles(collectionName);
