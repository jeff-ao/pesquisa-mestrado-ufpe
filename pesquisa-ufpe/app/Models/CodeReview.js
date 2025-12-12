"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeReview = void 0;
var CodeReview = /** @class */ (function () {
    function CodeReview(codeReview) {
        this.uuid = codeReview.uuid,
            this.repository = codeReview.repository,
            this.owner = codeReview.owner,
            this.pull_number = codeReview.pull_number,
            this.base_a = codeReview.base_a,
            this.base_b = codeReview.base_b,
            this.base_merge = codeReview.base_merge,
            this.branch_a = codeReview.branch_a,
            this.branch_b = codeReview.branch_b;
    }
    return CodeReview;
}());
exports.CodeReview = CodeReview;
//# sourceMappingURL=CodeReview.js.map