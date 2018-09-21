import { Component, OnInit } from '@angular/core';
import 'hammerjs';
import { Question, QuestionType } from '../../models/question';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  questions: Question[];
  currentQuestion: Question;
  QuestionType: any = QuestionType;
  constructor() { }

  ngOnInit() {
    this.loadQuestions();
  }
  loadQuestions(): any {
    // TODO: load questions from server
    this.questions = [
      {
        id: 1,
        header: 'Would you like to eat or drink?',
        type: QuestionType.ChooseOne,
        choices: ['Drink', 'Eat'],
        nextQuestions: {
          'Drink': 2,
          'Eat': 3
        }
      }, {
        id: 2,
        header: 'What can I bring you to drink?',
        type: QuestionType.Textual,
        nextQuestionId: 4
      }, {
        id: 3,
        header: 'Choose your preferences?',
        type: QuestionType.ChooseMany,
        choices: ['Cheese', 'Chocolate', 'Fish'],
        nextQuestionId: 4
      }, {
        id: 4,
        header: 'How many people are you bringing?',
        type: QuestionType.Numeric,
        nextQuestionId: 1
      }
    ];

    this.currentQuestion = this.questions[0];
  }

  public submit() {
    if (this.currentQuestion.nextQuestionId) {
      this.currentQuestion = this.questions.find(e => e.id === this.currentQuestion.nextQuestionId);
    } else if (this.currentQuestion.answer && this.currentQuestion.nextQuestions) {
      this.currentQuestion = this.questions.find(e =>
        e.id === this.currentQuestion.nextQuestions[this.currentQuestion.answer]);
    }
  }

}
