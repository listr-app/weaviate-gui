import weaviate from "weaviate-ts-client";

const WEAVIATE__HOST = process.env.WEAVIATE_HOST || "localhost:8080";
const OPENAI__API_KEY = "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";

export const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080", // Replace with your endpoint
  // apiKey: new ApiKey("rvIOODTLIJaMropyiudJQiSk2nOZjaNzMM21"),
  headers: {
    "X-OpenAI-Api-Key": OPENAI__API_KEY,
  },
});
