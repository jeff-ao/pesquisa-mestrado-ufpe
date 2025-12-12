"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeReviewModel = void 0;
const mongoose_1 = require("mongoose");
// Define the schema for the analysis output
const CodeReviewSchema = new mongoose_1.Schema({
    uuid: { type: String, required: true, unique: true },
    repository: { type: String, required: true },
    owner: { type: String, required: true },
    pull_number: { type: Number, required: true },
    base_a: { type: String, required: true },
    base_b: { type: String, required: true },
    base_merge: { type: String, required: true },
    branch_a: { type: String, required: true },
    branch_b: { type: String, required: true },
}, { timestamps: true });
// Exportar o modelo Mongoose como uma exportação nomeada `CodeReviewModel`
exports.CodeReviewModel = (0, mongoose_1.model)("RevisaodeCodigo", CodeReviewSchema);
// --- REMOÇÃO DA LINHA PROBLEMÁTICA: Não é mais necessária pois ICodeReview já foi exportada acima ---
// export { ICodeReview };
