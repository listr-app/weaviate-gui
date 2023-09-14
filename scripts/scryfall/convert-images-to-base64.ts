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
const SAMPLE_DATA_PATH = "./test/data/mtg/unique-artwork.sample.json";
const DATA_PATH = "./test/data/mtg/unique-artwork-20230913090249.json";
const IMAGES_PATH = "dist/images/mtg";
const OUTPUT_JSON_PATH = "./output/cards-with-base64.json";

let count = 0;

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
      return cardWithBase64;
    } catch (error) {
      console.log("Error converting image", error);
      return {};
    }
  },
  disassembler(),
  stringer({ makeArray: true }),
  fs.createWriteStream(OUTPUT_JSON_PATH),
]);

pipeline.on("end", () => {
  console.log(`${count} Images converted to base64!`);
});
