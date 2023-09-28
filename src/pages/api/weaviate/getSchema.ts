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
    const response = await client.schema.getter().do();

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong in /weaviate getClient",
      errorMessage: error,
    });
  }
}
