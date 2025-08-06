"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cosineSimilarity = cosineSimilarity;
function cosineSimilarity(a, b) {
    const dotProduct = a.reduce((sum, aVal, index) => sum + aVal * b[index]);
    const normA = Math.sqrt(a.reduce((sum, aVal) => sum + aVal * aVal, 0));
    const normB = Math.sqrt(b.reduce((sum, bVal) => sum + bVal * bVal, 0));
    return dotProduct / (normA * normB);
}
