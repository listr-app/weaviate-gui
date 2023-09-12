import { client } from "weaviate/client";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Input: Array of image urls []
 * Output: Array of Ebay Listings
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const className = "ClassOfCards29";

  try {
    let result = await client.graphql
      .get()
      .withClassName(className)
      .withFields("nickname image")
      .do();

    console.log(result.data);
    res.status(200).json({
      result: result,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      error: "Something went wrong in /weaviate getObjectsInClass",
    });
  }
}