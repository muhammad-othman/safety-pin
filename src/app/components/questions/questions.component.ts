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
  localStorage = window.localStorage;
  otherAnswer: string;

  constructor() { }

  ngOnInit() {
    this.loadQuestions();
  }
  loadQuestions(): any {
    const jsonObject = this.localStorage.getItem('formObject');
    if (jsonObject) {
      this.form = JSON.parse(jsonObject);
    } else {
      this.resetForm();
    }
    this.currentQuestion = this.form.questions.find(e => e.id === this.form.currentQuestionId);
    this.verifyDisabled();
  }

  public verifyDisabled() {
    if (this.currentQuestion.type === QuestionType.Textual || this.currentQuestion.type === QuestionType.Dropdown) {
      if (!this.currentQuestion.answer) {
        this.disabled = true;
      } else if (this.currentQuestion.validation &&
        !new RegExp(this.currentQuestion.validation).test(this.currentQuestion.answer)) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    } else if (this.currentQuestion.type === QuestionType.RadioButton || this.currentQuestion.type === QuestionType.RadioButtonWithImages) {
      if (this.currentQuestion.answer && this.currentQuestion.answer !== 'Other') {
        this.disabled = false;
      } else if (this.currentQuestion.answer === 'Other' && this.currentQuestion.otherAnswer) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    } else if (this.currentQuestion.type === QuestionType.CheckBox || this.currentQuestion.type === QuestionType.CheckBoxWithImages) {
      if (this.currentQuestion.answers && this.currentQuestion.answers.length > 0) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    } else if (this.currentQuestion.type === QuestionType.Form) {

      // tslint:disable-next-line:forin
      // tslint:disable-next-line:prefer-const
      for (let propertyName in this.currentQuestion.fields) {

        if (!this.currentQuestion.fields[propertyName].answer) {
          this.disabled = true;
          return;
        }
      }
      this.disabled = false;

    } else {
      this.disabled = true;
    }
  }

  public addNewQuestion() {
    if (this.disabled) {
      return;
    }

    const fields = this.currentQuestion.fields.map(element => {
      return {...element};
    });
    const newQuestion = { ...this.currentQuestion };

    newQuestion.fields = fields;
    // tslint:disable-next-line:prefer-const
    // tslint:disable-next-line:forin
    for (const propertyName in newQuestion.fields) {
      delete newQuestion.fields[propertyName].answer;
    }
    const id = Math.random() * 1000;
    this.currentQuestion.nextQuestionId = id;
    newQuestion.id = id;
    this.form.questions.push(newQuestion);
    this.submit();
  }

  public submit() {
    if (this.disabled) {
      return;
    }

    if (this.currentQuestion.variable) {
      this.form.variables[this.currentQuestion.variable] = this.currentQuestion.answer;
    }
    if (this.currentQuestion.nextQuestions && this.currentQuestion.type === QuestionType.CheckBoxWithImages) {
      this.form.currentQuestions = [...this.currentQuestion.nextQuestions];
    }
    if (this.form.currentQuestions && this.form.currentQuestions.length) {
      this.form.currentQuestionId = this.form.currentQuestions.pop();
    } else if (this.currentQuestion.nextQuestionId) {
      this.form.currentQuestionId = this.currentQuestion.nextQuestionId;
    } else if (this.currentQuestion.nextQuestions) {
      if (this.currentQuestion.type === QuestionType.RadioButton || this.currentQuestion.type === QuestionType.RadioButtonWithImages) {
        this.form.currentQuestionId = this.currentQuestion.nextQuestions[this.currentQuestion.fields.indexOf(this.currentQuestion.answer)];
      }
    } else {
      delete this.currentQuestion;
      return;
    }
    const previousQuestionId = this.currentQuestion.id;
    this.currentQuestion = this.form.questions.find(e => e.id === this.form.currentQuestionId);
    this.currentQuestion.previousQuestionId = previousQuestionId;
    this.replaceVariables();
    this.filterVariables();
    this.verifyDisabled();

    this.localStorage.setItem('formObject', JSON.stringify(this.form));
  }
  public filterVariables() {
    if (this.currentQuestion.type === QuestionType.Dropdown) {
      if (!this.currentQuestion.answer) {
        this.currentQuestion.answer = '';
      }
      if (this.currentQuestion.options.filter) {
        this.currentQuestion.options.list =
          this.currentQuestion.fields.filter(e => e.key === this.form.variables[this.currentQuestion.options.filter])
            .map(e => e.text);
      }
    }
  }

  public back() {
    this.form.currentQuestionId = this.currentQuestion.previousQuestionId;
    this.currentQuestion = this.form.questions.find(e => e.id === this.form.currentQuestionId);
    this.verifyDisabled();

    this.localStorage.setItem('formObject', JSON.stringify(this.form));
  }

  public checkBoxChanged(checked, choice) {
    if (checked) {
      if (this.currentQuestion.answers) {
        this.currentQuestion.answers.push(choice.text);
        this.currentQuestion.nextQuestions.push(choice.nextQuestionId);
      } else {
        this.currentQuestion.answers = [choice.text];
        this.currentQuestion.nextQuestions = [choice.nextQuestionId];
      }
    } else {
      this.currentQuestion.answers.splice(this.currentQuestion.answers.indexOf(choice.text), 1);
      this.currentQuestion.nextQuestions.splice(this.currentQuestion.nextQuestions.indexOf(choice.nextQuestionId), 1);
    }

    this.verifyDisabled();
  }
  private replaceVariables() {
    const arr = this.currentQuestion.header.split('[');
    for (let index = 1; index < arr.length; index++) {
      const variable = arr[index].split(']')[0];
      this.currentQuestion.header = this.currentQuestion.header.replace('[' + variable + ']', this.form.variables[variable]);
    }
  }

  public resetForm() {
    this.form = {
      finalMessage: 'Thanks for taking the survey',
      backgroundUrl: '../assets/background.jpeg',
      currentQuestionId: 1,
      variables: {},
      questions:
        [
          {
            id: 1,
            header: 'Enter Your Name',
            validation: '^[a-zA-Z ]{1,10}$',
            type: QuestionType.Textual,
            variable: 'name',
            nextQuestionId: 2
          }, {
            id: 2,
            header: 'Welcome [name], what state do you live in?',
            type: QuestionType.RadioButton,
            fields: ['state1', 'state2', 'state3'],
            variable: 'state',
            nextQuestionId: 12
          }, {
            id: 12,
            header: 'What county do you live in?',
            type: QuestionType.Dropdown,
            fields: [{ key: 'state1', text: 'state11' }, { key: 'state1', text: 'state12' }, { key: 'state1', text: 'state13' },
            { key: 'state2', text: 'state21' }, { key: 'state2', text: 'state22' }, { key: 'state2', text: 'state23' },
            { key: 'state3', text: 'state31' }, { key: 'state3', text: 'state32' }, { key: 'state3', text: 'state33' }
            ],
            nextQuestionId: 3,
            options: { filter: 'state', list: ['state3', 'state4', 'state5'] }
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
                url: '../../assets/movie.jpg',
                nextQuestionId: 7
              }, {
                text: 'Comedy',
                url: '../../assets/movie.jpg',
                nextQuestionId: 8
              }, {
                text: 'Romantic',
                url: '../../assets/movie.jpg',
                nextQuestionId: 9
              }
            ],
            variable: 'genre'
          }, {
            id: 7,
            header: 'Is Boris Karlov your favorite actor? {Horror}',
            type: QuestionType.RadioButton,
            fields: ['Yes', 'No'],
            nextQuestionId: 10
          }, {
            id: 8,
            header: 'Is Adam Sander funnier than David Spade? {Comedy}',
            type: QuestionType.RadioButton,
            fields: ['Yes', 'No'],
            nextQuestionId: 10
          }, {
            id: 9,
            header: 'Team Pitt or Team Clooney? {Romantic}',
            type: QuestionType.RadioButton,
            fields: ['Team Pitt', 'Team Cooney', 'Other'],
            nextQuestionId: 10
          }, {
            id: 10,
            header: 'What is your favorite movie?',
            type: QuestionType.Form,
            fields: [
              {
                label: 'Movie Name'
              }, {
                label: 'Movie Genere'
              }, {
                label: 'Date Released',
                // validation : '/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/'
              }
            ],
            nextQuestionId: 11
          }, {
            id: 11,
            header: 'Did you enjoy taking this survey?',
            type: QuestionType.RadioButton,
            fields: ['Yes', 'No']
          }
        ]
    };

    this.currentQuestion = this.form.questions.find(e => e.id === this.form.currentQuestionId);
    this.localStorage.setItem('formObject', JSON.stringify(this.form));
    this.verifyDisabled();
  }

}
