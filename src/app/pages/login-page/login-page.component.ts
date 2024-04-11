import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf, NgStyle} from "@angular/common";
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
    NgStyle,
    NgIf
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
      email: [null, [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });


  }

  submit() {

    let form: UserLogin = this.loginForm.value as UserLogin;

    this.authService.submitLoginForm(form).subscribe({
      next: (response: AuthResponse): void => {
        this.authService.login(response.refresh_token, response.access_token)
      }, error: (err): void => {
      }, complete: (): void => {
        this.router.navigate(['/patients']);
      }
    })
  }

  checkForm() {

  }

  checkField(field: string) {
    if(this.loginForm.controls[field].value === null) return false;

    return this.loginForm.controls[field].invalid || this.loginForm.controls[field].touched;

  }

  reloadPage(): void {
    window.location.reload();
  }

}
