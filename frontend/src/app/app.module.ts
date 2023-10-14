import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OverlayModule } from '@angular/cdk/overlay';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ChangePasswordComponent, ProfileComponent } from './profile/profile.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';

import { httpInterceptorProviders } from './_helpers/http.interceptor';
import { MainComponent } from './main/main.component';
import { MatchingComponent } from './matching/matching.component';

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
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    OverlayModule,
    ReactiveFormsModule
  ],
  providers: [
    httpInterceptorProviders, 
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
