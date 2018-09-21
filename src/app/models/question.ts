export enum QuestionType {
    Numeric,
    Textual,
    ChooseOne,
    ChooseMany
}

export interface Question {
    id: number;
    header: string;
    answer?: string;
    type: QuestionType;
    choices?: string[];
    nextQuestionId?: number;
    nextQuestions?: {};
}
