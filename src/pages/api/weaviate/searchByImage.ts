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
    const base64String = req.body.base64String;
    // Perform query
    let result = await client.graphql
      .get()
      .withClassName("ScryfallCard")
      .withNearImage({
        image: base64String,
        distance: 0.3,
      })
      .withLimit(5)
      .withFields("name image")
      .do();

    res.status(200).json({
      result: result,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
