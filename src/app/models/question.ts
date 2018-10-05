export enum QuestionType {
    Numeric = 1,
    Textual = 2,
    CheckBox = 3,
    CheckBoxWithImages = 4,
    RadioButton = 5,
    RadioButtonWithImages = 6,
    Form = 7,
    Dropdown = 8
}

export interface Question {
    id: number;
    questionText: string;
    answer?: string;
    answers?: string[];
    otherAnswer?: string;
    type: QuestionType;
    fields?: any[];
    nextQuestionId?: number;
    nextQuestions?: any[];
    variable?: string;
    validation?: string;
    previousQuestionId?: number;
    options?: any;
}

export interface Form {
    variables: {};
    questions: Question[];
    backgroundUrl: string;
    currentQuestionId?: number;
    currentQuestions?: number[];
    finalMessage?: string;
}
