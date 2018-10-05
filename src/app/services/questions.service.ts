import { Injectable } from '@angular/core';
import { Form } from '../models/question';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Guid } from 'guid-typescript';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  private headers = new Headers({
    'Content-Type': 'application/json',
    'x-apikey': '03fb66be8f95cc2df33c807d345ab8e4b55d7',
    'Access-Control-Allow-Origin': '*'
  });
  private baseUrl = 'https://safety-b379.restdb.io/rest/';

  submitForm(form: Form) {

    const options = new RequestOptions({ headers: this.headers });
    const submissionForm = {
      'referenceId': Guid.create(),
      'form-submission-name': 'testing-form',
      'form-space-name': 'testing-form',
      'form-name': 'testing-form',
      'form-version': 'v1',
      'submitted-on-device': this.deviceService.getDeviceInfo(),
      'received-on-server': new Date(),
      'submitter': 'muhammad.oth91@gmail.com',
      'form-submission': form
    };

    this.http.post(this.baseUrl + 'form-submission', submissionForm, options).subscribe(res => console.log(res));
  }

  constructor(private http: Http, private deviceService: DeviceDetectorService) { }
}
