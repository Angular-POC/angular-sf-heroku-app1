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
  ngOnInit() {}
  getname() {
    return this.myName;
  }
}
