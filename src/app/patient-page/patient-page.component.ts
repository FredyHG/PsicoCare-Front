import {Component, ElementRef, ViewChild} from '@angular/core';
import {DatePipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ConfirmPopupComponent} from "../confirm-popup/confirm-popup.component";
import {PaginatedResponse} from "../models/PaginatedResponse";
import {patients} from "../models/PatientsMock";
import {Patient} from "../models/Patient";

@Component({
  selector: 'patient-page',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgOptimizedImage,
    ConfirmPopupComponent,
    DatePipe
  ],
  templateUrl: './patient-page.component.html',
  styleUrl: './patient-page.component.scss'
})
export class PatientPageComponent {

  paginatedResponse: PaginatedResponse<Patient> = {
    content: patients,
    totalElements: 50,
    size: 10,
    number: 0,
    last: false
  };


  @ViewChild('popupRef') popupRef!: ConfirmPopupComponent;
  idToExclude!: number;

  detailsVisible: boolean = false;

  editVisible: boolean = false;

  selectedPatient!: Patient;

  minDate: string;

  maxDate: string;

  constructor() {

    const minDate = new Date();
    const maxDate = new Date();

    maxDate.setFullYear(maxDate.getFullYear() - 100);
    minDate.setFullYear(minDate.getFullYear() - 3);

    this.minDate = this.formatDate(minDate);
    this.maxDate = this.formatDate(maxDate);
  }

  deletePatient(id: number): void{
    this.paginatedResponse.content.forEach(pat => {
        this.paginatedResponse.content = this.paginatedResponse.content.filter(item => item.id != id);
      }
    )
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

  closeEdit(){
    this.editVisible = false;
  }

  getDetailData(): Patient{
    return this.selectedPatient;
  }

  closeDetails(): void {
    this.detailsVisible = false;
  }

  handleConfirmation(confirmed: boolean) {
    if (confirmed) {
      console.log('Usuário confirmou!');
      this.deletePatient(this.idToExclude)
    } else {
      console.log('Usuário não confirmou.');
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

    this.paginatedResponse.content = patients;

  }

  filterList(inputName: HTMLInputElement, inputLastName: HTMLInputElement, inputCPF: HTMLInputElement, inputEmail: HTMLInputElement): void {

      this.paginatedResponse.content = patients;

      this.paginatedResponse.content = this.paginatedResponse.content.filter(item => {
      const nameMatches = inputName.value ? item.name.startsWith(inputName.value) : true;
      const lastNameMatches = inputLastName.value ? item.lastName.startsWith(inputLastName.value) : true;
      const cpfMatches = inputCPF.value ? item.cpf.startsWith(inputCPF.value) : true;
      const emailMatches = inputEmail.value ? item.email.startsWith(inputEmail.value) : true;

      return nameMatches && lastNameMatches && cpfMatches && emailMatches;
    });
  }
}





