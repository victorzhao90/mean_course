import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { AngularMaterialModule } from "../angular-material.module";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "../app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { AuthRoutingModule } from "./auth-routing.module";

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    AuthRoutingModule,
    AngularMaterialModule,
  ],
})
export class AuthModule {

}