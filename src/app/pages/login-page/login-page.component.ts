import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {UserLogin} from "../../models/UserLogin";
import {AuthResponse} from "../../models/dto/AuthResponse";
import {Router} from "@angular/router";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgStyle,
    NgIf,
    ToastModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private messageService: MessageService) {

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
        this.authService.login(response.refresh_token, response.access_token);
      },
      error: (err): void => {
        this.showFailedLogin();
        this.loginForm.reset();
      },
      complete: (): void => {
        this.showSuccessLogin();
        this.router.navigate(['/patients']);
      }
    })
  }


  reloadPage(): void {
    window.location.reload();
  }

  showSuccessLogin(): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successfully' });
  }

  showFailedLogin(): void {
    this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Incorrect username or password. Please try again.' });
  }

}
