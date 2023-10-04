import { client } from "weaviate/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const batchSize = 20;
  const className = "WineReview";
  const classProperties = ["title"];

  async function getBatchWithCursor(
    client?: any,
    className?: string,
    classProperties?: string[],
    batchSize?: number,
    cursor?: string,
  ): Promise<{ data: any }> {
    const query = client.graphql
      .get()
      // .withClassName(className)
      .withClassName("ScryfallCard")
      // Optionally retrieve the vector embedding by adding `vector` to the _additional fields
      .withFields("name")
      // .withFields(classProperties.join(" ") + " _additional { id vector }")
      .withLimit(20);

    console.log(query);
    if (cursor) {
      return await query.withAfter(cursor).do();
    } else {
      return await query.do();
    }
  }

  getBatchWithCursor(client);
}
