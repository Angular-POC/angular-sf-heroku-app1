import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BroadcasterService } from './broadcaster.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [BrowserModule, FormsModule, CommonModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(broadcaster: BroadcasterService) {}
}
