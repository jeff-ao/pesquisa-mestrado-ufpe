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
exports.AnalysisOutputMongoRepository = void 0;
const AnalysisOutput_1 = __importDefault(require("../models/AnalysisOutput"));
/* FileRepository deprecated in favor of MongoDB

class AnalysisOutputFileRepository implements AnalysisOutputRepository {
  private analysisOutputs: AnalysisOutput[];
  private analysisFileContent: string;

  constructor(filepath: string) {
    this.analysisFileContent = fs.existsSync(filepath) ? fs.readFileSync(filepath, "utf-8") : "[]";
    this.analysisOutputs = JSON.parse(this.analysisFileContent);
  }

  async getAnalysisOutput(repo: string, owner: string, pull_number: number): Promise<AnalysisOutput | null> {
    return (
      this.analysisOutputs.find((analysisOutput) =>
        analysisMatches(analysisOutput, owner, repo, pull_number)
      ) || null
    );
  }

  async createAnalysisOutput(analysisOutput: AnalysisOutput): Promise<AnalysisOutput> {
    const analysisOutputExists = await this.getAnalysisOutput(
      analysisOutput.repository,
      analysisOutput.owner,
      analysisOutput.pull_number
    );

    if (analysisOutputExists) {
      return await this.updateAnalysisOutput(analysisOutput);
    } else {
      this.analysisOutputs.push(analysisOutput);
      return analysisOutput;
    }
  }

  async updateAnalysisOutput(newAnalysisOutput: AnalysisOutput): Promise<AnalysisOutput> {
    const index = this.analysisOutputs.findIndex((analysisOutput) =>
      analysisMatches(
        analysisOutput,
        newAnalysisOutput.owner,
        newAnalysisOutput.repository,
        newAnalysisOutput.pull_number
      )
    );

    if (index === -1) throw new Error("Analysis output not found");
    this.analysisOutputs[index] = newAnalysisOutput;
    return newAnalysisOutput;
  }

  async deleteAnalysisOutput(repo: string, owner: string, pull_number: number): Promise<void> {
    this.analysisOutputs = this.analysisOutputs.filter(
      (analysisOutput) => !analysisMatches(analysisOutput, owner, repo, pull_number)
    );
  }

  async listAllAnalysisFromRepo(repo: string, owner: string): Promise<AnalysisOutput[]> {
    return this.analysisOutputs.filter((analysisOutput) => analysisMatches(analysisOutput, owner, repo));
  }

  async listAllAnalysisFromOwner(owner: string): Promise<AnalysisOutput[]> {
    return this.analysisOutputs.filter((analysisOutput) => analysisMatches(analysisOutput, owner));
  }
}
*/
class AnalysisOutputMongoRepository {
    constructor() {
        this.db = AnalysisOutput_1.default;
    }
    getAnalysisOutput(repo, owner, pull_number) {
        return __awaiter(this, void 0, void 0, function* () {
            const analysis = yield this.db.findOne({ repository: repo, owner, pull_number }, { projection: { _id: 0 } });
            if (!analysis)
                throw new Error("Analysis output not found");
            console.log("Found: ", analysis);
            return analysis;
        });
    }
    createAnalysisOutput(analysisOutput) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.create(analysisOutput);
            console.log("Created: ", analysisOutput);
            return analysisOutput;
        });
    }
    updateAnalysisOutput(newAnalysisOutput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { repository, owner, pull_number } = newAnalysisOutput;
            const a = yield this.db.updateOne({ repository, owner, pull_number }, { $set: newAnalysisOutput });
            if (!a.acknowledged)
                throw new Error("Failed to update analysis output");
            console.log("Updated: ", newAnalysisOutput);
            return newAnalysisOutput;
        });
    }
    deleteAnalysisOutput(repo, owner, pull_number) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.deleteOne({ repository: repo, owner, pull_number });
            console.log("Deleted: ", { repository: repo, owner, pull_number });
        });
    }
    listAllAnalysisFromRepo(repo, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const analyses = yield this.db.find({ repository: repo, owner }, { projection: { _id: 0 } });
            console.log("Found: ", analyses);
            return analyses;
        });
    }
    listAllAnalysisFromOwner(owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const analyses = yield this.db.find({ owner }, { projection: { _id: 0 } });
            console.log("Found: ", analyses);
            return analyses;
        });
    }
}
exports.AnalysisOutputMongoRepository = AnalysisOutputMongoRepository;
