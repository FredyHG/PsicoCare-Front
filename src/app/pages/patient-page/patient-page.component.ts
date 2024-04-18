import {Component, ViewChild} from '@angular/core';
import {DatePipe, NgForOf, NgIf, NgOptimizedImage, TitleCasePipe} from "@angular/common";
import {ConfirmPopupComponent} from "../../popups/confirm-popup/confirm-popup.component";
import {PaginatedResponse} from "../../models/PaginatedResponse";
import {Patient} from "../../models/Patient";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PatientsService} from "../../services/patients.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PatientPutRequest} from "../../models/dto/PatientPutRequest";
import {ResponseMessage} from "../../models/dto/ResponseMessage";
import {NgxMaskDirective} from "ngx-mask";
import {PaginatorModule} from "primeng/paginator";
import {CalendarModule} from "primeng/calendar";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";


@Component({
  selector: 'patient-page',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgOptimizedImage,
    ConfirmPopupComponent,
    DatePipe,
    ReactiveFormsModule,
    NgxMaskDirective,
    PaginatorModule,
    CalendarModule,
    ToastModule,
    TitleCasePipe
  ],
  templateUrl: './patient-page.component.html',
  styleUrl: './patient-page.component.scss'
})
export class PatientPageComponent {

  paginatedResponse!: PaginatedResponse<Patient>;

  @ViewChild('popupRef') popupRef!: ConfirmPopupComponent;

  editForm: FormGroup;

  detailsVisible: boolean = false;
  createVisible: boolean = false;
  editVisible: boolean = false;
  filtered: boolean = false;

  selectedPatient!: Patient;
  totalElements!: number;

  minDate!: Date;


  showCreate(){
    this.createVisible = true;
  }


  constructor(private httpClient: HttpClient,
              private patientService: PatientsService,
              private messageService: MessageService,
              private formBuilder: FormBuilder) {

    this.patientService.getPatients(0, 10).subscribe({
      next: (response: PaginatedResponse<Patient>): PaginatedResponse<Patient> => this.paginatedResponse = response,
      complete: () => this.totalElements = this.paginatedResponse.totalElements
    })

    this.editForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      lastName: [null, Validators.required],
      birthDate: [null, Validators.required],
      cpf: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required]
    });

    this.setPageDefaultDate();
  }

  getPatientsData(pageNumber: number, pageSize: number){

    this.patientService.getPatients(pageNumber, pageSize).subscribe({
      next: (response: PaginatedResponse<Patient>): PaginatedResponse<Patient> => this.paginatedResponse = response
    });
  }

  showPopup(): void {
    this.popupRef.show();
  }

  showDetails(patient: Patient): void{

    patient.birthDateView = new Date(patient.birthDate);
    patient.createAtView = new Date(patient.createAt);

    this.selectedPatient = patient;
    this.detailsVisible = true;
  }

  showEdit(patient: Patient): void{
    this.selectedPatient = patient;
    this.editForm.get('birthDate')?.setValue(patient.birthDate);
    this.editVisible = true;
  }

  closeCard(){
    this.editVisible = false;
    this.detailsVisible = false;
    this.createVisible = false;
  }

  getDetailData(): Patient{
    return this.selectedPatient;
  }

  handleConfirmation(confirmed: boolean) {
    if (confirmed) {
      this.patientService.deletePatient(this.selectedPatient.cpf).subscribe({
        error: (err): void => {
          if(err.status == 409){
            this.showFailed("You cannot delete a patient who is linked to a therapy.");
          } else {
            this.showFailed("Failed to delete this patient");
          }
        },
        complete: (): void => {
          this.showSuccess("Patient deleted successfully.");
          this.getPatientsData(1, 10);
        }
      });
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  cleanInput(inputName: HTMLInputElement, inputLastName: HTMLInputElement, inputCPF: HTMLInputElement, inputEmail: HTMLInputElement):void {

    this.filtered = false;

    inputName.value = '';
    inputLastName.value = '';
    inputCPF.value = '';
    inputEmail.value = '';

    this.patientService.getPatients(1, 10).subscribe({
      next: (response: PaginatedResponse<Patient>): PaginatedResponse<Patient> => this.paginatedResponse = response
    })

  }

  filterList(inputName: HTMLInputElement, inputLastName: HTMLInputElement, inputCPF: HTMLInputElement, inputEmail: HTMLInputElement, pageNumber: number, pageSize: number): void {

    this.filtered = true;

    this.patientService.getPatientsFiltered(inputName.value, inputLastName.value, inputCPF.value, inputEmail.value, pageNumber, pageSize)
      .subscribe(result => {
        this.paginatedResponse = result;
      });
  }


  editPatient(){
    this.editForm.get('cpf')?.setValue(this.selectedPatient.cpf);

    let editForm: PatientPutRequest = this.editForm.value as PatientPutRequest;

    this.patientService.editPatient(editForm).subscribe({
      next: (response: ResponseMessage): void => {
        if(response.statusCode == 200){
          this.getPatientsData(1, 10);
          this.closeCard();
        }
      },
      error: (err): void => {
        this.showFailed("Failed to edit this patient.");
        this.editForm.reset();
      },
      complete: (): void => {
        this.showSuccess("Patient edited successfully.");
        this.editForm.reset();
      }
    });
  }

  createPatient() {
    let createForm: PatientPutRequest = this.editForm.value as PatientPutRequest;

    this.patientService.createPatient(createForm).subscribe({
      next: (response: ResponseMessage): void => {
        if(response.statusCode == 201){
          this.getPatientsData(1, 10);
          this.closeCard();
        }
      },
      error: (err): void => {
        this.showFailed("Failed to create a patient.");
        this.editForm.reset();
      },
      complete: (): void => {
        this.showSuccess("Patient created successfully.");
        this.editForm.reset();
      }
    });
  }

  getCurrentDateTime() {
    let date = new Date();
    date.toISOString();
  }

  setPageDefaultDate(): void{
    this.getCurrentDateTime();

    this.minDate = new Date();
    this.minDate.setDate(-3);

    this.editForm.get('birthDate')?.setValue(this.minDate);

  }

  showSuccess(msg: string): void{
    this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
  }

  showFailed(msg: string): void{
    this.messageService.add({ severity: 'error', summary: 'Failed', detail: msg });
  }

}





