import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BroadcasterService } from '../broadcaster.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  public isLoggedin = false;
  public angularEvents = {};
  public sessionDetails = [];
  usersList = [];
  isAdd = false;
  isEdit = false;
  editedRecordIndex = 0;
  recordId: any;
  createdDate: Date;
  eventDate: Date;
  timeSpent: string;
  eventType: string = '';
  currentDate = new Date().toLocaleDateString('en-US');
  displayUserName: string = '';
  // tslint:disable-next-line: typedef
  constructor(public broadcaster: BroadcasterService) {
    let that = this;
    that.broadcaster.on('SEND_ANGULAR_EVENTS').subscribe(() => {
      that.sendAngularEvents();
    });
    this.getSessionDetilsPost();
  }

  ngOnInit() {
    this.getSessionDetilsReceive();
  }
  ngAfterViewInit() {
    this.getJsonData();
  }
  // tslint:disable-next-line: typedef
  sendAngularEvents() {
    this.angularEvents = {};
    switch (this.eventType) {
      case 'LOGIN':
        this.angularEvents = {
          createdDate: this.changerDate(this.currentDate),
          DeviceSessionId: this.sessionDetails[0].DeviceSessionId,
          UserId: this.sessionDetails[0].UserId,
          Username: this.sessionDetails[0].Username,
          Operation: this.eventType,
          PageUrl: '/login',
          PreviousPageUrl: ' ',
          RecordId: ' ',
          SourceIp: ' 165.225.122.179',
          eventDate: this.changerDate(this.currentDate),
        };
        break;
      case 'ADD':
      case 'UPDATE':
        this.angularEvents = {
          createdDate: this.createdDate,
          DeviceSessionId: this.sessionDetails[0].DeviceSessionId,
          UserId: this.sessionDetails[0].UserId,
          Username: this.sessionDetails[0].Username,
          Operation: this.eventType,
          PageUrl: '/addUpdate',
          PreviousPageUrl: '/login',
          RecordId: this.recordId,
          SourceIp: ' 165.225.122.179',
          eventDate: this.eventDate,
        };
        break;
    }

    parent.postMessage(JSON.stringify(this.angularEvents), '*');
  }

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
          console.log(that.sessionDetails);
          that.displayUserName = that.sessionDetails[0].Username;
          console.log(that.displayUserName);
        }
      }
    });
  }
  openLandingPage() {
    this.isLoggedin = true;
    this.eventType = 'LOGIN';
    this.sendAngularEvents();
  }

  getJsonData() {
    let tempList = JSON.parse(localStorage.getItem('UserData' || '[]'));
    if (tempList) {
      this.usersList = tempList;
    } else {
      this.usersList = [
        {
          createdDate: '2021-06-15',
          eventDate: '2021-06-05',
          timeSpent: '0.5',
          recordId: '1001',
        },
        {
          createdDate: '2016-06-16',
          eventDate: '2016-06-18',
          timeSpent: '1.5',
          recordId: '1002',
        },
        {
          createdDate: '2016-06-16',
          eventDate: '2016-06-16',
          timeSpent: '1',
          recordId: '1003',
        },
      ];
    }
    localStorage.setItem('UserData', JSON.stringify(this.usersList));
    console.log(this.usersList);
  }
  editDetails(index: any) {
    this.isEdit = true;
    this.editedRecordIndex = index;
    this.recordId = this.usersList[index].recordId;
    this.createdDate = this.usersList[index].createdDate;
    this.eventDate = this.usersList[index].eventDate;
    this.timeSpent = this.usersList[index].timeSpent;
  }
  addDetails() {
    this.isAdd = true;
    this.recordId = '';
    this.createdDate = null;
    this.eventDate = null;
    this.timeSpent = null;
  }
  addOrUpdateDetails() {
    let tempObj = {
      recordId: '',
      createdDate: null,
      eventDate: null,
      timeSpent: '',
    };
    if (this.isAdd) {
      this.eventType = 'ADD';
      tempObj.recordId = this.recordId
        ? this.recordId
        : Number(this.usersList[this.usersList.length - 1].recordId) + 1;
      tempObj.createdDate = this.createdDate;
      tempObj.eventDate = this.eventDate;
      tempObj.timeSpent = this.timeSpent;

      if (this.usersList && this.usersList.length > 0) {
        this.usersList.push(tempObj);
      } else {
        this.usersList = [];
        this.usersList.push(tempObj);
      }
      this.isAdd = false;
    } else if (this.isEdit) {
      this.eventType = 'UPDATE';
      this.isEdit = false;
      if (this.usersList[this.editedRecordIndex]) {
        this.usersList[this.editedRecordIndex].recordId = this.recordId;
        this.usersList[this.editedRecordIndex].createdDate = this.createdDate;
        this.usersList[this.editedRecordIndex].eventDate = this.eventDate;
        this.usersList[this.editedRecordIndex].timeSpent = this.timeSpent;
      }
    }
    localStorage.removeItem('UserData');
    localStorage.setItem('UserData', JSON.stringify(this.usersList));
    this.sendAngularEvents();
    console.log(this.usersList);
  }
  changerDate(currentDate) {
    let currentDateArray = currentDate.split('/');
    currentDate =
      currentDateArray[2] +
      '-' +
      currentDateArray[0] +
      '-' +
      currentDateArray[1];
    return currentDate;
  }
}
