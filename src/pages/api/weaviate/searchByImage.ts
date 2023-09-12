import { NextApiRequest, NextApiResponse } from "next";
import { client } from "weaviate/client";

/**
 * Input: Array of image urls []
 * Output: Array of Ebay Listings
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    //KOR OUTFITTER
    //https://cards.scryfall.io/art_crop/front/5/4/540f3ddf-7512-42a0-ba22-b58453747346.jpg?1673301333

    //ACADEMIC PROBATION
    //https://cards.scryfall.io/art_crop/front/5/4/545011ff-848c-46b3-9d56-0d82b11fa7b6.jpg?1637082086

    //BIRDS OF PARADISE
    //https://cards.scryfall.io/art_crop/front/5/5/55fe6449-1f23-43dc-adee-d144cd505b5c.jpg?1600957940

    const imageUrl =
      "https://cards.scryfall.io/art_crop/front/5/5/55fe6449-1f23-43dc-adee-d144cd505b5c.jpg?1600957940";

    // Fetch URL into `content` variable
    const response = await fetch(imageUrl);
    const content = await response.buffer();
    const base64String = content.toString("base64");

    const test = "dfoijoij";

    console.log(base64String, "le base");

    // Perform query
    let result = await client.graphql
      .get()
      .withClassName("ClassOfCards29")
      .withNearImage({
        image: base64String,
        distance: 0.3,
      })
      .withLimit(5)
      .withFields("image nickname")
      .do();

    // console.log(JSON.stringify(result, null, 2));

    res.status(200).json({
      result: result,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
