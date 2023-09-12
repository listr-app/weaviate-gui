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
  const {
    class_name,
  }: {
    class_name: string;
  } = req.body;

  try {
    const emptyClassDefinition = {
      class: class_name,
      moduleConfig: {
        "img2vec-neural": {
          imageFields: ["image"],
        },
      },
      properties: [
        {
          dataType: ["blob"],
          description: "Grayscale image",
          name: "image",
        },
        {
          dataType: ["text"],
          description: "person's nickname",
          name: "nickname",
          tokenization: "word",
        },
      ],
      vectorizer: "img2vec-neural",
      vectorIndexConfig: {
        distance: "cosine",
      },
    };

    let resp = await client.schema
      .classCreator()
      .withClass(emptyClassDefinition)
      .do();

    res.status(200).json({ resp });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      error: "Something went wrong in /weaviate addClass",
    });
  }
}
