import fs from "fs";
import path from "path";
import { client } from "../../weaviate/client";
const { readFile } = fs.promises;

const IMAGES_PATH = "./dist/images/mtg";
const FILENAME = "229-prophetic-prism.jpeg";

(async () => {
  const imageBuffer = await fs.promises.readFile(
    path.join(IMAGES_PATH, FILENAME),
  );
  const base64String = imageBuffer.toString("base64");

  let batcher = client.batch.objectsBatcher();
  batcher = batcher.withObject({
    properties: {
      name: "Prophetic Prism",
      image: base64String,
    },
    class: "ScryfallCard",
  });
  await batcher.withConsistencyLevel("ALL").do();
  console.log(`Card imported!`);
})();
