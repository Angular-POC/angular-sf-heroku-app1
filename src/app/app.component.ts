import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'angular-sf-poc';
  public myName = 'Shreyas';
  public sessionDetails = [];
  // tslint:disable-next-line: typedef
  constructor() {
    this.getSessionDetilsPost();
  }
  getname() {
    return this.myName;
  }

  ngOnInit() {
    this.getSessionDetilsReceive();
  }
  // tslint:disable-next-line: typedef
  getSessionDetilsPost() {
    const obj = {
      type: 'GET_SESSION_DETAILS',
      data: {
        apexClass: 'MS_CC_LCC_GetSessionDetails',
        methodName: 'getSessionDetails',
        methodParams: '',
      },
    };
    parent.postMessage(JSON.stringify(obj), '*');
  }
  // tslint:disable-next-line: typedef
  getSessionDetilsReceive() {
    // tslint:disable-next-line: no-unused-expression
    var eventMethod = window.addEventListener
      ? 'addEventListener'
      : 'attachEvent';
    // if (typeof window.addEventListener !== 'undefined') {
    //   eventMethod == 'addEventListener';
    // }
    //
    var eventer: any = window[eventMethod];
    console.log(eventer);
    var messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';
    let that = this;
    eventer(messageEvent, function (e: any) {
      var messageData = e.data instanceof Object ? e.data : JSON.parse(e.data);
      if (messageData.type == 'GET_SESSION_DETAILS_RESPONSE') {
        if (messageData.data != null) {
          console.log(messageData);
          that.sessionDetails = messageData.data;
        }
      }
    });
    console.log(typeof eventer);
  }
}
