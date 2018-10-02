import { Component, OnInit } from '@angular/core';
import 'hammerjs';
import { Question, QuestionType, Form } from '../../models/question';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {


  form: Form;
  currentQuestion: Question;
  QuestionType: any = QuestionType;
  disabled = true;

  constructor() { }

  ngOnInit() {
    this.loadQuestions();
  }
  loadQuestions(): any {
    this.form = {
      backgroundUrl: '../assets/background.jpeg',
      currentQuestionId: 1,
      variables: {},
      questions:
        [
          {
            id: 1,
            header: 'Enter Your Name',
            // validation: '^[a-zA-Z ]{1,10}$',
            type: QuestionType.Textual,
            variable: 'name',
            nextQuestionId: 2
          }, {
            id: 2,
            header: 'Welcome [name], what state do you live in?',
            type: QuestionType.RadioButton,
            fields: ['state1', 'state2', 'state3'],
            nextQuestionId: 3
          }, {
            id: 3,
            header: 'What do you like?',
            type: QuestionType.RadioButton,
            fields: ['Cookies ', 'Ice cream'],
            nextQuestions: [4, 5]
          }, {
            id: 4,
            header: 'Great: What is your favorite cookie?',
            type: QuestionType.RadioButton,
            fields: ['Oreos', 'Chips Ahoy', 'Other'],
            nextQuestionId: 6
          }, {
            id: 5,
            header: 'Great, What is your favorite flavor?',
            type: QuestionType.RadioButton,
            fields: ['Vanilla', 'Chocolate', 'Other'],
            nextQuestionId: 6
          }, {
            id: 6,
            header: 'What are you favorite movie Genres?',
            type: QuestionType.CheckBoxWithImages,
            fields: [
              {
                text: 'Horror',
                url: 'url1'
              }, {
                text: 'Comedy',
                url: 'url1'
              }, {
                text: 'Romantic',
                url: 'url1'
              }
            ],
            nextQuestions: [7, 8, 9],
            variable: 'genre'
          }, {
            id: 7,
            header: 'Is Boris Karlov your favorite actor?',
            type: QuestionType.RadioButton,
            fields: ['Yes', 'No'],
            nextQuestionId: 10
          }, {
            id: 8,
            header: 'Is Adam Sander funnier than David Spade?',
            type: QuestionType.RadioButton,
            fields: ['Yes', 'No'],
            nextQuestionId: 10
          }, {
            id: 9,
            header: 'Team Pitt or Team Clooney?',
            type: QuestionType.RadioButton,
            fields: ['Team Pitt', 'Team Cooney', 'Other'],
            nextQuestionId: 10
          }, {
            id: 10,
            header: 'What is your favorite movie?',
            type: QuestionType.Form,
            fields: [
              {
                text: 'MovieName'
              }, {
                text: 'MovieGenere'
              }, {
                text: 'DateReleased',
                // tslint:disable-next-line:max-line-length
                // regex: new RegExp('^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$')
              }
            ],
            nextQuestionId: 11
          }, {
            id: 7,
            header: 'Did you enjoy taking this survey?',
            type: QuestionType.RadioButton,
            fields: ['Yes', 'No']
          }
        ]
    };
    this.currentQuestion = this.form.questions.find(e => e.id === this.form.currentQuestionId);
  }

  public inputUpdated() {
    if (this.currentQuestion.type === QuestionType.Textual) {
      if (this.currentQuestion.validation && !new RegExp(this.currentQuestion.validation).test(this.currentQuestion.answer)) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    } else if (this.currentQuestion.type === QuestionType.RadioButton || this.currentQuestion.type === QuestionType.RadioButtonWithImages) {
      this.disabled = false;
    }
  }


  public submit() {
    if (this.currentQuestion.variable) {
      if (this.currentQuestion.type === QuestionType.Textual) {
        this.form.variables[this.currentQuestion.variable] = this.currentQuestion.answer;
      }
    }
    if (this.form.currentQuestions && this.form.currentQuestions.length) {
      this.currentQuestion.nextQuestionId = this.form.currentQuestions.pop();
    }

    if (this.currentQuestion.nextQuestionId) {
      this.form.currentQuestionId = this.currentQuestion.nextQuestionId;
    } else if (this.currentQuestion.nextQuestions) {
      if (this.currentQuestion.type === QuestionType.RadioButton || this.currentQuestion.type === QuestionType.RadioButtonWithImages) {
        this.form.currentQuestionId = this.currentQuestion.nextQuestions[this.currentQuestion.fields.indexOf(this.currentQuestion.answer)];
      }
    }

    this.currentQuestion = this.form.questions.find(e => e.id === this.form.currentQuestionId);
    this.replaceVariables();
    this.disabled = true;
  }

  private replaceVariables() {
    const arr = this.currentQuestion.header.split('[');
    for (let index = 1; index < arr.length; index++) {
      const variable = arr[index].split(']')[0];
      this.currentQuestion.header = this.currentQuestion.header.replace('[' + variable + ']', this.form.variables[variable]);
    }
  }

}
