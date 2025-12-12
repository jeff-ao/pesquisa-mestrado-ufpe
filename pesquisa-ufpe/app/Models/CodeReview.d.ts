interface ICodeReview {
    uuid: string;
    repository: string;
    owner: string;
    pull_number: number;
    base_a: string;
    base_b: string;
    base_merge: string;
    branch_a: string;
    branch_b: string;
}
declare class CodeReview implements ICodeReview {
    uuid: string;
    repository: string;
    owner: string;
    pull_number: number;
    base_a: string;
    base_b: string;
    base_merge: string;
    branch_a: string;
    branch_b: string;
    constructor(codeReview: ICodeReview);
}
export { CodeReview, ICodeReview };
