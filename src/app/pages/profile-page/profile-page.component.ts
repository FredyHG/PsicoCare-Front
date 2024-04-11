import {Component} from '@angular/core';
import {Psychologist} from "../../models/Psychologist";
import {PsychologistService} from "../../services/psychologist.service";
import {response} from "express";
import {NgIf, TitleCasePipe} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
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
    ToastModule
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
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]]
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
}

