#!/usr/bin/env ts-node
const SAMPLE_DATA_PATH = "./test/data/mtg/sample.json";
const DATA_PATH = "./test/data/mtg/unique-artwork-20230913090249.json";
import download from "download";
import fs from "fs";
import StreamArray from "stream-json/streamers/StreamArray";

type Card = {
  name: string;
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop?: string;
  };
};

const pipeline = fs
  .createReadStream(SAMPLE_DATA_PATH)
  .pipe(StreamArray.withParser());

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
      await download(card.image_uris?.border_crop, "dist");
    } catch (e) {
      console.log("Error downloading image", e);
    }
  },
);

pipeline.on("end", () => {
  // The stream has ended
  console.log("done");
});
