import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './shared/material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

import { httpInterceptorProviders } from './_helpers/http.interceptor';
import { MainComponent } from './main/main.component';
import { MatchingComponent } from './matching/matching.component';
import { AuthGuard } from './_guards/auth.guard';
import { RoleGuard } from './_guards/role.guard';
import { CollabComponent } from './collab/collab.component';
import { ChatComponent } from './collab/chat/chat.component';
import { HistoryComponent } from './history/history.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    AdminComponent,
    UserComponent,
    MainComponent,
    MatchingComponent,
    CollabComponent,
    ChatComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    MonacoEditorModule.forRoot(),
  ],
  providers: [httpInterceptorProviders, AuthGuard, RoleGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
