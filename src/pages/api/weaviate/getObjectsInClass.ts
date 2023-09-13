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
  console.log(req.body);

  const class_name = req.body.class_name;

  console.log(class_name);

  try {
    let result = await client.graphql
      .get()
      .withClassName(class_name)
      .withFields("nickname image")
      .do();

    console.log(result.data);
    res.status(200).json(result);
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      error: "Something went wrong in /weaviate getObjectsInClass",
    });
  }
}
