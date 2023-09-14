import { Card } from "@/types/Scryfall/Card";
import fs from "fs";
import { chain } from "stream-chain";
import { parser } from "stream-json";
import { streamArray } from "stream-json/streamers/StreamArray";
import { client } from "../../weaviate/client";
const { readFile } = fs.promises;
const SAMPLE_DATA_PATH = "./test/data/scryfall/unique-artwork.sample.json";
const DATA_PATH = "./test/data/scryfall/cards-with-base64.json";
const IMAGES_PATH = "dist/images/mtg";
const OUTPUT_JSON_PATH = "./output/cards-with-base64.json";

let count = 0;
(async () => {
  // Delete class if it already exists
  await client.schema.classDeleter().withClassName("ScryfallCard").do();

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
        count++;
        console.log(`Importing card number ${key}...`, card.name);
        batcher = batcher.withObject(card);
      } catch (error) {
        console.log("Error importing card", card.name, error);
      }
    },
  ]);

  pipeline.on("end", async () => {
    try {
      const resp = await batcher.do();
      console.log(resp);
      console.log(`${count} cards imported!`);
    } catch (error) {
      console.log("Error importing cards", error);
    }
  });
})();
