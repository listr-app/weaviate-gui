import axios from "axios";
import fs from "fs";
import cluster from "cluster";
import os from "os";

// Worker function for image processing
async function processBatchWorker(batch) {
  const base64Images = [];

  for (const item of batch) {
    const imageUrl = item.image_uris?.normal;

    if (imageUrl) {
      try {
        console.log(`Worker ${cluster.worker.id}: Processing URL: ${imageUrl}`);
        const response = await axios.get(imageUrl, {
          responseType: "arraybuffer",
        });
        const imageBuffer = response.data;
        const base64Image = Buffer.from(imageBuffer).toString("base64");

        base64Images.push({
          ...item,
          base64Image,
        });

        console.log(`Worker ${cluster.worker.id}: Processed URL: ${imageUrl}`);
      } catch (error) {
        console.error(
          `Worker ${cluster.worker.id}: Failed to process URL: ${imageUrl}`,
          error,
        );
      }
    }
  }

  console.log(`Worker ${cluster.worker.id}: Finished processing batch`);
  return base64Images;
}

// Main function for processing a batch in parallel
async function processBatchParallel(batch) {
  const numCPUs = os.cpus().length / 5; // Get the number of CPU cores
  console.log(`Master Process: Using ${numCPUs} CPU cores`);
  console.log(`Master Process: Total items to process: ${batch.length}`);

  if (cluster.isMaster) {
    // If the current process is the master process, fork worker processes
    const batches = [];
    for (let i = 0; i < batch.length; i += batchSize) {
      batches.push(batch.slice(i, i + batchSize));
    }

    const promises = [];

    // Fork a worker for each CPU core
    for (let i = 0; i < numCPUs; i++) {
      const worker = cluster.fork();
      const batchForWorker = batches[i];

      console.log(`Master Process: Forked worker ${worker.id}`);

      // Handle messages from worker
      worker.on("message", (message) => {
        if (message.type === "batchProcessed") {
          promises.push(message.result);

          // Check if all batches have been processed
          if (promises.length === numCPUs) {
            const base64Images = [].concat(...promises);
            saveBase64Images(base64Images);
          }
        }
      });

      // Send batch data to worker
      worker.send({ type: "processBatch", batch: batchForWorker });
    }
  } else {
    // Worker process
    process.on("message", async (message) => {
      if (message.type === "processBatch") {
        console.log(
          `Worker ${cluster.worker.id}: Received batch for processing`,
        );
        const result = await processBatchWorker(message.batch);
        console.log(`Worker ${cluster.worker.id}: Finished processing batch`);
        process.send({ type: "batchProcessed", result });
        process.exit(0);
      }
    });
  }
}

const batchSize = 10; // Adjust the batch size as needed

const jsonData = JSON.parse(
  fs.readFileSync("../../test/data/scryfall/default-main.json", "utf-8"),
);

// Function to save processed data
function saveBase64Images(base64Images) {
  const outputJsonFile = "../test/data/scryfall/new-data4.json";
  fs.writeFileSync(outputJsonFile, JSON.stringify(base64Images, null, 2));
  console.log(
    `Master Process: Wrote ${base64Images.length} images to ${outputJsonFile}`,
  );
  console.log(`Processing completed.`);
}

// Call the main processing function
console.log(`Starting the processing...`);
processBatchParallel(jsonData);

//
