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
const config_1 = require("../config");
// Importar a interface do repositório, e a implementação concreta para instanciar
const CodeReviewRepository_1 = require("../data/CodeReviewRepository");
// A instância do repositório deve ser baseada na interface
let analysisOutputRepository;
// Inicialização da instância do repositório
if (config_1.persistenceType === "mongo") {
    analysisOutputRepository = new CodeReviewRepository_1.CodeReviewMongoRepository();
}
else {
    // Mantendo como MongoDB por padrão se houver outras opções no futuro
    analysisOutputRepository = new CodeReviewRepository_1.CodeReviewMongoRepository();
}
class AnalysisController {
    // --- CORREÇÃO 1: Ajustar nome do método chamado no repositório e tipo de retorno ---
    getAnalysis(repo, owner, pull_number) {
        return __awaiter(this, void 0, void 0, function* () {
            // getCodeReview no repositório foi renomeado para getAnalysisOutput
            return yield analysisOutputRepository.getAnalysisOutput(owner, repo, pull_number);
        });
    }
    // --- CORREÇÃO 2: Ajustar tipo de retorno para ICodeReview[] ---
    getAllAnalysisFromRepo(repo, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield analysisOutputRepository.listAllAnalysisFromRepo(repo, owner);
        });
    }
    // --- CORREÇÃO 3: Ajustar tipo de retorno para ICodeReview[] ---
    getAllAnalysisFromOwner(owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield analysisOutputRepository.listAllAnalysisFromOwner(owner);
        });
    }
    // --- CORREÇÃO 4: createAnalysis agora chama o método 'save' do repositório ---
    createAnalysis(analysis) {
        return __awaiter(this, void 0, void 0, function* () {
            // O método 'save' do repositório espera Omit<ICodeReview, ...>, que ICodeReview já é compatível
            return yield analysisOutputRepository.save(analysis);
        });
    }
    // --- CORREÇÃO 5: updateAnalysis agora chama o método 'save' do repositório ---
    updateAnalysis(analysis) {
        return __awaiter(this, void 0, void 0, function* () {
            // O método 'save' do repositório fará o upsert (atualizar se existir, criar se não)
            return yield analysisOutputRepository.save(analysis);
        });
    }
    // --- CORREÇÃO 6: deleteAnalysis agora retorna Promise<number> ---
    deleteAnalysis(repo, owner, pull_number) {
        return __awaiter(this, void 0, void 0, function* () {
            // deleteCodeReview no repositório agora retorna number
            return yield analysisOutputRepository.deleteCodeReview(repo, owner, pull_number);
        });
    }
    // --- Implementações de métodos de deleção em massa (que não existem no repo ainda) ---
    // Apenas para que o app.ts compile. Você precisa implementar estes no CodeReviewMongoRepository
    deleteAllAnalysisFromRepo(repo, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            console.warn("deleteAllAnalysisFromRepo not fully implemented in CodeReviewMongoRepository yet. Returning 0.");
            // Exemplo: return await analysisOutputRepository.deleteMany({ repository: repo, owner });
            return 0;
        });
    }
    deleteAllAnalysisFromOwner(owner) {
        return __awaiter(this, void 0, void 0, function* () {
            console.warn("deleteAllAnalysisFromOwner not fully implemented in CodeReviewMongoRepository yet. Returning 0.");
            // Exemplo: return await analysisOutputRepository.deleteMany({ owner });
            return 0;
        });
    }
}
exports.default = AnalysisController;
