import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgStyle} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {UserLogin} from "../../models/UserLogin";
import {AuthResponse} from "../../models/dto/AuthResponse";
import {Router} from "@angular/router";


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgStyle
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) {

    if(authService.isLoggedIn$){
      this.router.navigate(['/patients']);
    }

    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required]],
      password: [null, Validators.required]
    });


  }

  submit() {

    let form: UserLogin = this.loginForm.value as UserLogin;

    this.authService.submitLoginForm(form).subscribe({
      next: (response: AuthResponse): void => {
        console.log(response)
        this.authService.login(response.refresh_token, response.access_token)
      }, error: (err): void => {
        console.log(err)
      }, complete: (): void => {
        this.router.navigate(['/patients']);
      }
    })
  }

  checkForm() {

  }

  checkField(field: string) {
    if(this.loginForm.controls[field].value === null) return false;

    return this.loginForm.controls[field].invalid;

  }

  reloadPage(): void {
    window.location.reload();
  }


}
