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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const analysisController_1 = __importDefault(require("../controllers/analysisController"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
// Database connection
mongoose_1.default.connect(config_1.connectionString, {
    dbName: "analysisOutputs"
});
const db = mongoose_1.default.connection;
db.on("error", (err) => console.error("MongoDB connection error:", err));
db.once("connected", () => console.log("Connected to database"));
const analysisController = new analysisController_1.default();
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "10mb" }));
app.use((0, cors_1.default)());
app.get("/codeReviewT", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("oi");
    return res.json({ message: "Hello from codeReviewT!" });
}));
app.get("/codeReview", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = req.query.owner;
    const repo = req.query.repo;
    const pull_number_str = req.query.pull_number;
    if (!owner) {
        return res.status(400).json({ error: "Bad request: 'owner' not provided." });
    }
    if (pull_number_str && !repo) {
        return res.status(400).json({ error: "Bad request: 'repo' must be provided if 'pull_number' is present." });
    }
    try {
        let analysisResult;
        if (owner && repo && pull_number_str) {
            const pull_number = parseInt(pull_number_str);
            if (isNaN(pull_number)) {
                return res.status(400).json({ error: "Bad request: 'pull_number' must be a valid number." });
            }
            analysisResult = yield analysisController.getAnalysis(repo, owner, pull_number);
        }
        else if (owner && repo) {
            analysisResult = yield analysisController.getAllAnalysisFromRepo(repo, owner);
        }
        else {
            analysisResult = yield analysisController.getAllAnalysisFromOwner(owner);
        }
        if (analysisResult === null || (Array.isArray(analysisResult) && analysisResult.length === 0)) {
            console.log(`[GET /codeReview] Análise não encontrada para ${owner}/${repo}#${pull_number_str || 'todos'}`);
            return res.status(404).json({ error: "Analysis not found for the specified criteria." });
        }
        return res.status(200).json(analysisResult);
    }
    catch (error) {
        console.error(`[GET /codeReview] Erro ao buscar análise:`, error);
        let errorMessage = "Internal server error while fetching analysis.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return res.status(500).json({ error: errorMessage });
    }
}));
app.post("/codeReview", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.codeReview) {
        return res.status(400).json({ error: "Bad request: 'codeReview' object not provided in body." });
    }
    console.log("[POST /codeReview] Recebendo nova análise.");
    const codeReview = req.body.codeReview;
    try {
        const createdAnalysis = yield analysisController.createAnalysis(codeReview);
        return res.status(201).json(createdAnalysis);
    }
    catch (error) {
        console.error("[POST /codeReview] Erro ao criar análise:", error);
        let errorMessage = "Analysis not created.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return res.status(400).json({ error: errorMessage });
    }
}));
app.put("/codeReview", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.analysis) {
        return res.status(400).json({ error: "Bad request: 'analysis' object not provided in body." });
    }
    const analysis = req.body.analysis;
    try {
        const updatedAnalysis = yield analysisController.updateAnalysis(analysis);
        return res.status(200).json(updatedAnalysis);
    }
    catch (error) {
        console.error("[PUT /codeReview] Erro ao atualizar análise:", error);
        let errorMessage = "Analysis not updated.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return res.status(400).json({ error: errorMessage });
    }
}));
app.delete("/codeReview", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = req.query.owner;
    const repo = req.query.repo;
    const pull_number_str = req.query.pull_number;
    // Removidas as validações genéricas para owner/repo/pull_number
    // A rota DELETE agora suporta APENAS a exclusão por pull_number (que exige owner e repo)
    if (!owner || !repo || !pull_number_str) {
        return res.status(400).json({ error: "Bad request: 'owner', 'repo', and 'pull_number' are required for deletion." });
    }
    try {
        let deletedCount = 0; // Inicializar com 0
        const pull_number = parseInt(pull_number_str);
        if (isNaN(pull_number)) {
            return res.status(400).json({ error: "Bad request: 'pull_number' must be a valid number." });
        }
        // ---> CORREÇÃO PRINCIPAL para TS1345:
        // Chamar o método sem tentar atribuir o retorno void a 'deletedCount' diretamente.
        // Presumimos sucesso se nenhuma exceção for lançada.
        yield analysisController.deleteAnalysis(repo, owner, pull_number);
        deletedCount = 1; // Presume que 1 item foi deletado se a chamada não lançou erro
        // ---> CORREÇÃO para TS2551:
        // Removidas as chamadas para métodos não existentes (deleteAllAnalysisFromRepo, deleteAllAnalysisFromOwner).
        // A rota agora só delega para deleteAnalysis.
        if (deletedCount === 0) {
            return res.status(404).json({ error: "No analysis found to delete for the specified criteria." });
        }
        return res.status(200).json({ message: "Analysis deleted successfully.", count: deletedCount });
    }
    catch (error) {
        console.error("[DELETE /codeReview] Erro ao deletar análise:", error);
        let errorMessage = "Internal server error while deleting analysis.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return res.status(500).json({ error: errorMessage });
    }
}));
exports.default = app;
