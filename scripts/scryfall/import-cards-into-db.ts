import { Card } from "@/types/Scryfall/Card";
import fs from "fs";
import { chain } from "stream-chain";
import { parser } from "stream-json";
import { streamArray } from "stream-json/streamers/StreamArray";
import { client } from "../../weaviate/client";
const { readFile } = fs.promises;
const SAMPLE_DATA_PATH = "./test/data/scryfall/unique-artwork.sample.json";
const DATA_PATH = "./test/data/scryfall/cards-with-base64.json";

let count = 0;
(async () => {
  try {
    console.log("Deleting class...");

    // Delete class if it already exists
    const resp = await client.schema
      .classDeleter()
      .withClassName("ScryfallCard")
      .do();

    console.dir(resp, { depth: 1 });

    console.log("Creating class...");

    await client.schema
      .classCreator()
      .withClass({
        class: "ScryfallCard",
        moduleConfig: {
          "img2vec-neural": {
            imageFields: ["image"],
          },
        },
        properties: [
          {
            dataType: ["blob"],
            description: "Grayscale image",
            name: "image",
          },
          {
            dataType: ["text"],
            description: "card name",
            name: "name",
            tokenization: "word",
          },
        ],
        vectorizer: "img2vec-neural",
        vectorIndexConfig: {
          distance: "cosine",
        },
      })
      .do();

    let batcher = client.batch.objectsBatcher();

    const pipeline = chain([
      fs.createReadStream(DATA_PATH),
      parser(),
      streamArray(),
      async ({ key, value: card }: { key: number; value: Card }) => {
        try {
          // add card to import batch
          console.log(`Adding card number ${key}...`, card.name);
          if (!card.base64 || !card.name) {
            console.log("No base64 image found");
            return;
          }
          count++;

          if (count % 100 === 0) {
            await batcher.withConsistencyLevel("ALL").do();
            console.log(`${count} cards imported!`);
            batcher = client.batch.objectsBatcher();
          }

          batcher = batcher.withObject({
            properties: {
              name: card.name,
              image: card.base64,
            },
            class: "ScryfallCard",
          });
        } catch (error) {
          console.log("Error importing card", card.name, error);
        }
      },
    ]);

    pipeline.on("finish", async () => {
      try {
        console.log("Importing cards...");
        const resp = await batcher.withConsistencyLevel("ALL").do();
        console.dir(resp, { depth: 1 });
        console.log(`${count} cards imported!`);
      } catch (error) {
        console.log("Error importing cards", error);
      }
    });
  } catch (error) {
    console.log("Error importing cards", error);
  }
})();
