import weaviate from "weaviate-ts-client";

const WEAVIATE__HOST = "34.172.254.77";
const OPENAI__API_KEY = "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";

export const client = weaviate.client({
  scheme: "http",
  host: WEAVIATE__HOST, // Replace with your endpoint
  // apiKey: new ApiKey("rvIOODTLIJaMropyiudJQiSk2nOZjaNzMM21"),
  headers: {
    "X-OpenAI-Api-Key": OPENAI__API_KEY,
  },
});
