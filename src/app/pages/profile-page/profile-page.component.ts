import {Component} from '@angular/core';
import {Psychologist} from "../../models/Psychologist";
import {PsychologistService} from "../../services/psychologist.service";
import {response} from "express";
import {NgIf, NgStyle, TitleCasePipe} from "@angular/common";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors, ValidatorFn,
  Validators
} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {PatientPutRequest} from "../../models/dto/PatientPutRequest";
import {ChangePasswordRequest} from "../../models/dto/ChangePasswordRequest";
import {ResponseMessage} from "../../models/dto/ResponseMessage";
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    TitleCasePipe,
    NgIf,
    ReactiveFormsModule,
    ToastModule,
    NgStyle
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {

  profile!: Psychologist;

  changePasswordVisible: boolean = false;

  changePasswordForm: FormGroup;


  constructor(private psychologistService: PsychologistService,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private messageService: MessageService) {

    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    })

    this.getPsychologistFromToken();

  }

  getPsychologistFromToken(){
    this.psychologistService.getPsychologistByToken().subscribe({
      next: (response: Psychologist): Psychologist => this.profile = response,
    })
  }

  toggleChangeWindow() {
    console.log("ent")
    this.changePasswordVisible = true;
  }

  changeEmail(){
    console.log('Changed successfully')
  }

  changePassword(){
    let changeForm: ChangePasswordRequest = this.changePasswordForm.value as ChangePasswordRequest

    this.authService.changePassword(changeForm).subscribe({
      error: (err): void => {
        this.showErrorPasswordInvalid();
        this.changePasswordForm.reset();
      },
      complete: (): void => {
        this.showSuccessChanged();
        this.closeCard();
        this.changePasswordForm.reset();
      }
    })
  }

  closeCard() {
    this.changePasswordVisible = false;
  }

  showSuccessChanged() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password changed successfully' });
  }

  showErrorPasswordInvalid() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'The old password is invalid' });
  }


  confirmPasswordMatch(){
    if (
      this.changePasswordForm.controls['newPassword'].value !=
      this.changePasswordForm.controls['confirmPassword'].value
    ) {
      if (this.changePasswordForm.controls['newPassword'].hasError('required')) {
        return;
      }
      this.changePasswordForm.setErrors({ 'invalid': true });
      this.changePasswordForm.controls['confirmPassword'].setErrors({
        passwordMisMatch: true

      });
    }
  }
}



