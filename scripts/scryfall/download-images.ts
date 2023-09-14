#!/usr/bin/env ts-node
const SAMPLE_DATA_PATH = "./test/data/mtg/unique-artwork.sample.json";
const DATA_PATH = "./test/data/mtg/unique-artwork-20230913090249.json";
const OUTPUT_PATH = "dist/images/mtg";
import download from "download";
import fs from "fs";
import StreamArray from "stream-json/streamers/StreamArray";
import { Card } from "../../types/Scryfall/Card";
import { toString } from "../../modules/functions/scryfall/card/toString";

const pipeline = fs.createReadStream(DATA_PATH).pipe(StreamArray.withParser());

pipeline.on(
  "data",
  async ({ key, value: card }: { key: number; value: Card }) => {
    // Do something with the data
    console.log(
      `Downloading card number ${key}...`,
      card.name,
      card.image_uris?.border_crop,
    );

    if (!card.image_uris?.border_crop) {
      console.log("No border_crop image found");
      return;
    }

    try {
      const file = await download(card.image_uris?.border_crop);
      fs.writeFileSync(`${OUTPUT_PATH}/${toString(card)}.jpg`, file);
    } catch (e) {
      console.log("Error downloading image", e);
    }
  },
);

pipeline.on("end", () => {
  // The stream has ended
  console.log("done");
});
