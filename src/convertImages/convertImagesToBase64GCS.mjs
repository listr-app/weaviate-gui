import { Storage } from "@google-cloud/storage";
import axios from "axios";
import fs from "fs";
import os from "os";
import path from "path";

// Initialize the Cloud Storage client
const storage = new Storage();

// Google Cloud Function to process a batch of JSON data
exports.processBatch = async (event, context) => {
  const fileBucket = event.bucket;
  const filePath = event.name;

  // Check if the event is for a JSON file
  if (!filePath.endsWith(".json")) {
    console.log(`File ${filePath} is not a JSON file. Igwhat noring.`);
    return;
  }

  // Download the JSON file from Cloud Storage
  const bucket = storage.bucket(fileBucket);
  const file = bucket.file(filePath);
  const tmpFilePath = path.join(os.tmpdir(), filePath);
  await file.download({ destination: tmpFilePath });

  // Read and parse the JSON data
  const jsonData = JSON.parse(fs.readFileSync(tmpFilePath, "utf-8"));

  // Define a batch size (adjust as needed)
  const batchSize = 10;

  // Split the JSON data into batches
  const batches = [];
  for (let i = 0; i < jsonData.length; i += batchSize) {
    batches.push(jsonData.slice(i, i + batchSize));
  }

  // Process each batch in parallel using Promise.all()
  const promises = batches.map(async (batch, index) => {
    const base64Images = [];

    for (const item of batch) {
      const imageUrl = item.image_uris?.normal;

      if (imageUrl) {
        try {
          const response = await axios.get(imageUrl, {
            responseType: "arraybuffer",
          });

          const imageBuffer = response.data;
          const base64Image = Buffer.from(imageBuffer).toString("base64");

          base64Images.push({
            ...item,
            base64Image,
          });
        } catch (error) {
          console.error(`Failed to process URL: ${imageUrl}`, error);
        }
      }
    }

    // Do something with the processed batch, like saving it to Cloud Storage
    // For demonstration, we will log it
    console.log(`Processed batch ${index + 1}`);
    console.log(base64Images);

    return base64Images;
  });

  // Wait for all batches to complete
  const results = await Promise.all(promises);

  // Consolidate results if needed
  const consolidatedResults = [].concat(...results);

  // Do something with the consolidated results, like saving them to Cloud Storage
  // For demonstration, we will log them
  console.log("Consolidated Results:");
  console.log(consolidatedResults);

  // Clean up the temporary file
  fs.unlinkSync(tmpFilePath);

  console.log("Processing complete.");
};
