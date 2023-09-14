import { client } from "../../weaviate/client";
import fs from "fs";

const FILEPATH = "./test/data/scryfall/test-prophetic-prism.jpg";

(async () => {
  const imageBuffer = await fs.promises.readFile(FILEPATH);
  const base64String = imageBuffer.toString("base64");

  let resp = await client.graphql
    .get()
    .withClassName("ScryfallCard")
    .withNearImage({
      image: base64String,
      distance: 0.5,
    })
    .withLimit(5)
    .withFields("image name")
    .do();
  console.dir(resp, { depth: null });
})();
