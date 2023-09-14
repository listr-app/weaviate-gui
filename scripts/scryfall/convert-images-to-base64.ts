import { Card } from "@/types/Scryfall/Card";
import fs from "fs";
import path from "path";
import { parser } from "stream-json";
import { stringer } from "stream-json/Stringer";
import { streamArray } from "stream-json/streamers/StreamArray";
import { disassembler } from "stream-json/Disassembler";
import { toString } from "../../modules/functions/scryfall/card/toString";
import { chain } from "stream-chain";

const { readFile } = fs.promises;
const SAMPLE_DATA_PATH = "./test/data/scryfall/unique-artwork.sample.json";
const DATA_PATH = "./test/data/scryfall/unique-artwork-20230913090249.json";
const IMAGES_PATH = "dist/images/mtg";
const OUTPUT_JSON_PATH = "./test/data/scryfall/cards-with-base64.json";

let count = 0;

const writeStream = fs.createWriteStream(OUTPUT_JSON_PATH);

const pipeline = chain([
  fs.createReadStream(DATA_PATH),
  parser(),
  streamArray(),
  async ({ key, value: card }: { key: number; value: Card }) => {
    try {
      const filename = toString(card) + ".jpg";
      console.log(`Converting card number ${key}...`, filename);

      const filePath = path.join(IMAGES_PATH, filename);
      const imageBuffer = await readFile(filePath);

      const base64Image = imageBuffer.toString("base64");
      const cardWithBase64 = {
        ...card,
        base64: base64Image,
      };
      count++;
      console.log(`Converted card number ${key}...`, filename);
      return cardWithBase64;
    } catch (error) {
      console.log("Error converting image", error.message);
      return { error: error.message };
    }
  },
  disassembler(),
  stringer({ makeArray: true }),
  writeStream,
]);

pipeline.on("end", () => {
  // The stream has ended
  console.log("done");
});

// Listen for the 'finish' event on the write stream
writeStream.on("finish", () => {
  console.log("All writes are now complete.");
});

// Optionally, you can also listen for errors on the write stream
writeStream.on("error", (err) => {
  console.error("An error occurred:", err);
});
