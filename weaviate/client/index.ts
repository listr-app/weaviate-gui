import weaviate, { WeaviateClient, ApiKey } from "weaviate-ts-client";

export const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080", // Replace with your endpoint
  // apiKey: new ApiKey("rvIOODTLIJaMropyiudJQiSk2nOZjaNzMM21"),
  headers: {
    "X-OpenAI-Api-Key": "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",
  },
});
