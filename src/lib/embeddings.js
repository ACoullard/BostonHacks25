import { embed, embedMany } from 'ai';
import { google } from '@ai-sdk/google';

const embeddingModel = google.embedding('gemini-embedding-001');

// Chunking function
const generateChunks = (input) => {
  return input
    .trim()
    .split('.')
    .filter(i => i !== '');
};

// // Generate embeddings for multiple chunks
// export const generateEmbeddings = async (items) => {
//   // items: [{ id, content }]
//   const chunks = items.map(item => item.content);
//   const { embeddings } = await embedMany({
//     model: embeddingModel,
//     values: chunks,
//   });
//   return embeddings.map((e, i) => ({
//     id: items[i].id,
//     content: chunks[i],
//     embedding: e
//   }));
// };

// Generate single embedding
export const generateEmbedding = async (value) => {
  const input = value.replaceAll('\\n', ' ');
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

// Cosine similarity calculation
const cosineSimilarity = (a, b) => {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

// Add content to store
export const addToStore = async (items) => {
  // items: [{ id, content }]
  const embeddings = await generateEmbeddings(items);
  embeddingStore.push(...embeddings);
};

// Find relevant content
export const findRelevantContent = async (
  userQuery,
  embeddingStore,
  similarityThreshold = 0.5,
  limit = 4
) => {
  const userQueryEmbedding = await generateEmbedding(userQuery);

  const results = embeddingStore
    .map(item => ({
      id: item.id,
      content: item.content,
      similarity: cosineSimilarity(userQueryEmbedding, item.embedding),
    }))
    .filter(item => item.similarity > similarityThreshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return results;
};

