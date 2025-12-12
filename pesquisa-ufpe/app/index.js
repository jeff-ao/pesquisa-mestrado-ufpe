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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var util_1 = __importDefault(require("util"));
var fs_1 = __importDefault(require("fs"));
var uuid_1 = require("uuid");
var pexec = util_1.default.promisify(child_process_1.exec);
exports.default = (function (app) {
    app.on("pull_request.opened", function (context) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, owner, repo, pull_number, nome_branchs, merge_commit, i, parents, left, right, merge_base, baseParaMerge, baseParaA, baseParaB, codeReview;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = context.pullRequest(), owner = _a.owner, repo = _a.repo, pull_number = _a.pull_number;
                    return [4 /*yield*/, context.octokit.pulls.get({ owner: owner, repo: repo, pull_number: pull_number }).then(function (response) {
                            return {
                                nome_branch_a: response.data.base.ref,
                                nome_branch_b: response.data.head.ref
                            };
                        })
                        // cria um delay para aguardar o merge finalizar
                    ];
                case 1:
                    nome_branchs = _b.sent();
                    return [4 /*yield*/, context.octokit.pulls.get({ owner: owner, repo: repo, pull_number: pull_number })];
                case 2:
                    merge_commit = (_b.sent()).data.merge_commit_sha;
                    i = 0;
                    _b.label = 3;
                case 3:
                    if (!(!merge_commit && i < 5)) return [3 /*break*/, 7];
                    console.log("Waiting for merge commit...");
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, context.octokit.pulls.get({ owner: owner, repo: repo, pull_number: pull_number })];
                case 5:
                    merge_commit = (_b.sent()).data.merge_commit_sha;
                    _b.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 3];
                case 7:
                    // se não ocorre o merge ele lança uma exceção
                    if (!merge_commit)
                        throw new Error("No merge commit sha");
                    console.log(merge_commit);
                    return [4 /*yield*/, context.octokit.repos.getCommit({ owner: owner, repo: repo, ref: merge_commit })];
                case 8:
                    parents = (_b.sent()).data.parents;
                    left = parents[0].sha;
                    right = parents[1].sha;
                    console.log(left, right);
                    // clona o repositório
                    if (fs_1.default.existsSync(repo))
                        fs_1.default.rmSync(repo, { recursive: true, force: true });
                    return [4 /*yield*/, pexec("git clone https://github.com/".concat(owner, "/").concat(repo))];
                case 9:
                    _b.sent();
                    process.chdir(repo);
                    return [4 /*yield*/, pexec("git merge-base ".concat(left, " ").concat(right))];
                case 10:
                    merge_base = (_b.sent()).stdout;
                    merge_base = merge_base.trim();
                    console.log(merge_base);
                    // recria o merge localmente
                    return [4 /*yield*/, pexec("git checkout ".concat(left))];
                case 11:
                    // recria o merge localmente
                    _b.sent();
                    return [4 /*yield*/, pexec("git merge ".concat(right))];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, pexec("git rev-parse HEAD")];
                case 13:
                    merge_commit = (_b.sent()).stdout.trim();
                    return [4 /*yield*/, pexec("git diff ".concat(merge_base, " ").concat(merge_commit, " -U10000"))];
                case 14:
                    baseParaMerge = (_b.sent()).stdout;
                    return [4 /*yield*/, pexec("git diff ".concat(merge_base, " ").concat(left, " -U10000"))];
                case 15:
                    baseParaA = (_b.sent()).stdout;
                    return [4 /*yield*/, pexec("git diff ".concat(merge_base, " ").concat(right, " -U10000"))];
                case 16:
                    baseParaB = (_b.sent()).stdout;
                    codeReview = {
                        uuid: (0, uuid_1.v4)(),
                        repository: repo,
                        owner: owner,
                        pull_number: pull_number,
                        base_a: baseParaA, // persiste a diferença entre o código do base e branch_a
                        base_b: baseParaB, // persiste a diferença entre o código do base e branch_b
                        base_merge: baseParaMerge, // persiste a diferença entre o código do base o merge do branch_a e branch_b
                        branch_a: nome_branchs.nome_branch_a,
                        branch_b: nome_branchs.nome_branch_b
                    };
                    //apagar pastas geradas quando-se clona o repositório
                    process.chdir("..");
                    fs_1.default.rm(repo, { recursive: true, force: true }, function (err) {
                        if (err)
                            throw err;
                    });
                    return [4 /*yield*/, fetch("http://localhost:4000/codeReview", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ codeReview: codeReview })
                        })
                            .then(function (res) { return console.log(res.text()); })
                            .catch(function (error) { return console.log(error); })
                        // console.log(baseParaMerge);
                        // console.log();
                        // console.log(baseParaA);
                        // console.log();
                        // console.log(baseParaB);
                    ];
                case 17:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=index.js.map