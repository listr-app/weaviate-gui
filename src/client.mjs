import weaviate from "weaviate-ts-client";

let client;

export const getWeaviateClient = () => {
  if (!client) {
    client = weaviate.client({
      scheme: "http",
      host: "localhost:8080",
    });
  }

  // client.misc.readyChecker().do().then(console.log)
  return client;
};
