import {Component, ViewChild} from '@angular/core';
import {DatePipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ConfirmPopupComponent} from "../../popups/confirm-popup/confirm-popup.component";
import {PaginatedResponse} from "../../models/PaginatedResponse";
import {Patient} from "../../models/Patient";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PatientsService} from "../../services/patients.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PatientPutRequest} from "../../models/dto/PatientPutRequest";
import {Observable} from "rxjs";
import {ResponseMessage} from "../../models/dto/ResponseMessage";
import {NgxMaskDirective} from "ngx-mask";

const AUTH_API = 'http://localhost:8080/api/patient';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

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
    NgxMaskDirective
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

  selectedPatient!: Patient;

  minDate: string = '';

  maxDate: string = '';
  showCreate(){
    this.createVisible = true;
  }


  constructor(private httpClient: HttpClient,
              private patientService: PatientsService,
              private formBuilder: FormBuilder) {

    this.patientService.getPatients().subscribe({
      next: (response: PaginatedResponse<Patient>): PaginatedResponse<Patient> => this.paginatedResponse = response
    })

    this.setMinAndMaxDate();

    this.editForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      lastName: [null, Validators.required],
      birthDate: [null, Validators.required],
      cpf: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required]
    });

  }

  getPatientsData(){
    this.patientService.getPatients().subscribe({
      next: (response: PaginatedResponse<Patient>): PaginatedResponse<Patient> => this.paginatedResponse = response
    })
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
        next: () => this.getPatientsData()
      });
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  cleanInput(inputName: HTMLInputElement, inputLastName: HTMLInputElement, inputCPF: HTMLInputElement, inputEmail: HTMLInputElement):void {

    inputName.value = '';
    inputLastName.value = '';
    inputCPF.value = '';
    inputEmail.value = '';

    this.patientService.getPatients().subscribe({
      next: (response: PaginatedResponse<Patient>): PaginatedResponse<Patient> => this.paginatedResponse = response
    })

  }

  filterList(inputName: HTMLInputElement, inputLastName: HTMLInputElement, inputCPF: HTMLInputElement, inputEmail: HTMLInputElement): void {

    this.patientService.getPatientsFiltered(inputName.value, inputLastName.value, inputCPF.value, inputEmail.value)
      .subscribe(result => {
        this.paginatedResponse = result;
      });
  }

  getPatients(){
    this.httpClient.get(AUTH_API, httpOptions).subscribe(value => console.log(value))
  }

  setMinAndMaxDate(): void{
    const minDate = new Date();
    const maxDate = new Date();

    maxDate.setFullYear(maxDate.getFullYear() - 100);
    minDate.setFullYear(minDate.getFullYear() - 3);

    this.minDate = this.formatDate(minDate);
    this.maxDate = this.formatDate(maxDate);
  }

  editPatient(){
    this.editForm.get('cpf')?.setValue(this.selectedPatient.cpf)

    let editForm: PatientPutRequest = this.editForm.value as PatientPutRequest

    this.patientService.editPatient(editForm).subscribe({
      next: (response: ResponseMessage): void => {
        if(response.statusCode == 200){
          this.getPatientsData();
          this.closeCard();
        }
      },
      complete: (): void => {
        this.editForm.reset();
      }
    })
  }

  createPatient() {
    let createForm: PatientPutRequest = this.editForm.value as PatientPutRequest

    this.patientService.createPatient(createForm).subscribe({
      next: (response: ResponseMessage): void => {
        if(response.statusCode == 201){
          this.getPatientsData();
          this.closeCard();
        }
      },
      complete: (): void => {
        this.editForm.reset();
      }
    })
  }
}





