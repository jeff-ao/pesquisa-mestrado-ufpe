"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisOutput = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class AnalysisOutput {
    constructor(analysisOutput) {
        this.uuid = analysisOutput.uuid;
        this.repository = analysisOutput.repository;
        this.owner = analysisOutput.owner;
        this.pull_number = analysisOutput.pull_number;
        this.data = analysisOutput.data;
        this.diff = analysisOutput.diff;
        this.events = analysisOutput.events;
    }
}
exports.AnalysisOutput = AnalysisOutput;
/* FileRepository deprecated in favor of MongoDB
function analysisMatches(
  analysis: AnalysisOutput,
  owner: string,
  repo?: string,
  pull_number?: number
): boolean {
  return (
    analysis.owner === owner &&
    (repo ? analysis.repository === repo : true) &&
    (pull_number ? analysis.pull_number === pull_number : true)
  );
}
*/
// Define the schema for the analysis output
const analysisSchema = new mongoose_1.default.Schema({
    uuid: String,
    repository: String,
    owner: String,
    pull_number: Number,
    data: Object,
    diff: String,
    events: {
        type: [
            {
                type: { type: String },
                label: String,
                body: {
                    description: String,
                    interference: [
                        {
                            type: { type: String },
                            branch: String,
                            text: String,
                            location: {
                                file: String,
                                class: String,
                                method: String,
                                line: Number
                            },
                            stackTrace: [
                                {
                                    class: String,
                                    method: String,
                                    line: Number
                                }
                            ]
                        }
                    ]
                }
            }
        ],
        default: []
    }
});
exports.default = mongoose_1.default.models.Analysis || mongoose_1.default.model("Analysis", analysisSchema);
