export enum QuestionType {
    Numeric,
    Textual,
    CheckBox,
    CheckBoxWithImages,
    RadioButton,
    RadioButtonWithImages,
    Form
}

export interface Question {
    id: number;
    header: string;
    answer?: string;
    otherAnswer?: string;
    type: QuestionType;
    fields?: any[];
    nextQuestionId?: number;
    nextQuestions?: any[];
    variable?: string;
    validation?: string;
    previousQuestionId?: number;
}

export interface Form {
    variables: {};
    questions: Question[];
    backgroundUrl: string;
    currentQuestionId?: number;
    currentQuestions?: number[];
    finalMessage?: string;
}
