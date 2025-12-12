"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeReviewMongoRepository = void 0;
const CodeReview_1 = require("../models/CodeReview"); // Use ICodeReview consistentemente
class CodeReviewMongoRepository {
    constructor() {
        this.db = CodeReview_1.CodeReviewModel;
    }
    getAnalysisOutput(owner, repository, pull_number) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryFilter = {
                    owner: owner,
                    repository: repository,
                    pull_number: pull_number
                };
                console.log(`[CodeReviewRepo] QUERY: Tentando buscar análise para PR: ${owner}/${repository}#${pull_number}. Filtro Mongoose:`, queryFilter); // <-- ADICIONADO LOG DA QUERY
                const analysis = yield this.db.findOne(queryFilter, { projection: { _id: 0, __v: 0 } }).lean();
                if (analysis) {
                    console.log(`[CodeReviewRepo] SUCESSO: Análise ENCONTRADA para PR: ${owner}/${repository}#${pull_number}.`);
                    // Se possível, logue uma parte do ID ou um campo único para confirmar que é o dado certo
                    // console.log(`[CodeReviewRepo] UUID do documento encontrado: ${analysis.uuid}`); 
                    return analysis;
                }
                else {
                    console.log(`[CodeReviewRepo] FALHA: Análise NÃO ENCONTRADA no DB para PR: ${owner}/${repository}#${pull_number}. RETORNANDO NULL.`);
                    return null;
                }
            }
            catch (error) {
                console.error(`[CodeReviewRepo] ERRO FATAL no MongoDB ao buscar análise para PR ${owner}/${repository}#${pull_number}:`, error);
                throw new Error(`Erro no banco de dados ao buscar análise: ${error.message}`);
            }
        });
    }
    save(codeReviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = {
                    owner: codeReviewData.owner,
                    repository: codeReviewData.repository,
                    pull_number: codeReviewData.pull_number
                };
                const updatedCodeReview = yield this.db.findOneAndUpdate(filter, codeReviewData, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();
                if (!updatedCodeReview) {
                    throw new Error('Falha ao salvar ou atualizar análise (documento não retornado).');
                }
                console.log(`[CodeReviewRepo] Análise para PR ${codeReviewData.owner}/${codeReviewData.repository}#${codeReviewData.pull_number} salva/atualizada com sucesso.`);
                return updatedCodeReview;
            }
            catch (error) {
                console.error(`[CodeReviewRepo] ERRO FATAL ao salvar/atualizar análise para PR ${codeReviewData.owner}/${codeReviewData.repository}#${codeReviewData.pull_number}:`, error);
                throw new Error(`Erro no banco de dados ao salvar análise: ${error.message}`);
            }
        });
    }
    deleteCodeReview(repo, owner, pull_number) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`[CodeReviewRepo] Tentando deletar análise para PR: ${owner}/${repo}#${pull_number}.`);
                const result = yield this.db.deleteOne({ repository: repo, owner, pull_number });
                console.log(`[CodeReviewRepo] Análise para PR ${owner}/${repo}#${pull_number} deletada. Contagem: ${result.deletedCount}`);
                return result.deletedCount;
            }
            catch (error) {
                console.error(`[CodeReviewRepo] ERRO FATAL ao deletar análise para PR ${owner}/${repo}#${pull_number}:`, error);
                throw new Error(`Erro no banco de dados ao deletar análise: ${error.message}`);
            }
        });
    }
    listAllAnalysisFromRepo(repo, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const analyses = yield this.db.find({ repository: repo, owner }, { projection: { _id: 0, __v: 0 } }).lean();
                console.log(`[CodeReviewRepo] Encontradas ${analyses.length} análises para repo: ${owner}/${repo}.`);
                return analyses;
            }
            catch (error) {
                console.error(`[CodeReviewRepo] ERRO FATAL ao listar análises por repositório ${owner}/${repo}:`, error);
                throw new Error(`Erro no banco de dados ao listar análises por repositório: ${error.message}`);
            }
        });
    }
    listAllAnalysisFromOwner(owner) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const analyses = yield this.db.find({ owner }, { projection: { _id: 0, __v: 0 } }).lean();
                console.log(`[CodeReviewRepo] Encontradas ${analyses.length} análises para owner: ${owner}.`);
                return analyses;
            }
            catch (error) {
                console.error(`[CodeReviewRepo] ERRO FATAL ao listar análises por owner ${owner}:`, error);
                throw new Error(`Erro no banco de dados ao listar análises por owner: ${error.message}`);
            }
        });
    }
}
exports.CodeReviewMongoRepository = CodeReviewMongoRepository;
