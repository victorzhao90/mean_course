import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
]
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    CommonModule,
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {

}