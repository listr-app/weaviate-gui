import { client } from "weaviate/client";
import { NextApiRequest, NextApiResponse } from "next";
import { generateUuid5, toBase64FromBlob } from "weaviate-ts-client";

import mockDataModule from "../../../../weaviatez/mock-data.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const class_name = "ClassOfCards29";

  let mockdata: Partial<Card> & { id: any; base64: any; name: string }[] =
    mockDataModule as any[];

  try {
    const datalength = mockdata.length;
    const batchSize = 50;

    // Split the JSON data into batches
    const batches = [];
    for (let i = 0; i < datalength; i += batchSize) {
      const batch = mockdata.slice(i, i + batchSize);
      batches.push(batch);
    }

    // Prepare an array to collect the objects
    const objectsToImport = [];

    for (const batch of batches) {
      for (const object of batch) {
        const namespace = "listrrr"; // Replace with your own namespace
        const objectId = generateUuid5(object.id, namespace);

        // Construct an object with a class, the generated ID, and other properties
        const obj = {
          class: class_name,
          id: objectId,
          properties: {
            nickname: object.name,
            image: object.base64,
          },
        };

        // Add the prepared object to the array
        objectsToImport.push(obj);
      }
    }

    let batcher = client.batch.objectsBatcher();

    // Add each prepared object to the batch queue
    for (const obj of objectsToImport) {
      batcher = batcher.withObject(obj);
    }
    // Flush the batch queue to send the objects to Weaviate
    await batcher.do();

    res.status(200).json({ resp: "Success!" });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error });
  }
}

async function toDataURL_node(imageUrl: string) {
  let response = await fetch(imageUrl);
  let blob = await response.blob();
  let buffer = Buffer.from(await blob.text());
  return "data:" + blob.type + ";base64," + buffer.toString("base64");
}
