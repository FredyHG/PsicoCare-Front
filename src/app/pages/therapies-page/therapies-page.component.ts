import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {Therapy} from "../../models/Therapy";
import {TherapiesService} from "../../services/therapies.service";
import {NgxMaskDirective} from "ngx-mask";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {PsychologistService} from "../../services/psychologist.service";
import {Psychologist} from "../../models/Psychologist";
import {PaginatedResponse} from "../../models/PaginatedResponse";
import {Patient} from "../../models/Patient";
import {PatientsService} from "../../services/patients.service";
import {TherapyPostRequest} from "../../models/dto/TherapyPostRequest";
import {ResponseMessage} from "../../models/dto/ResponseMessage";
import {PatientPutRequest} from "../../models/dto/PatientPutRequest";


@Component({
  selector: 'app-therapies-page',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgxMaskDirective,
    ReactiveFormsModule,
    DatePipe,
    FormsModule
  ],
  templateUrl: './therapies-page.component.html',
  styleUrl: './therapies-page.component.scss'
})
export class TherapiesPageComponent implements OnInit{

  paginatedResponse!: PaginatedResponse<Therapy>;

  paginatedResponsePsychologist!: PaginatedResponse<Psychologist>;

  paginatedResponsePatient!: PaginatedResponse<Patient>;

  createForm: FormGroup;

  createVisible: boolean = true;

  selectedStatus: string = 'ALL';




  constructor(private therapyServices: TherapiesService,
              private formBuilder: FormBuilder,
              private psychologistService: PsychologistService,
              private patientService: PatientsService) {

    this.createForm = this.formBuilder.group({
      crpPsychologist: [null, Validators.required],
      cpfPatient: [null, Validators.required],
      dateTime: [null, Validators.required]
    })



    this.getCurrentDateTime();
  }

  ngOnInit(): void {
    this.therapyServices.getTherapies().subscribe({
      next: response => this.paginatedResponse = response,
      error: err => console.error('Erro ao carregar terapias', err),
    });

    this.psychologistService.getPsychologists().subscribe({
      next: response => this.paginatedResponsePsychologist = response,
      error: err => console.error('Erro ao carregar psicólogos', err),
    });

    this.patientService.getPatients().subscribe({
      next: response => this.paginatedResponsePatient = response,
      error: err => console.error('Erro ao carregar patients', err),
    })
  }



  filterList(inputPatientName: HTMLInputElement, inputPatientCPF: HTMLInputElement, inputPsychologistName: HTMLInputElement, inputPsychologistCRP: HTMLInputElement): void {

    this.therapyServices.getTherapiesFiltered(inputPatientName.value, inputPatientCPF.value, inputPsychologistName.value, inputPsychologistCRP.value)
      .subscribe(result => {
        this.paginatedResponse = result;
      });
  }

  cleanInput(inputPatientName: HTMLInputElement, inputPatientCPF: HTMLInputElement, inputPsychologistName: HTMLInputElement, inputPsychologistCRP: HTMLInputElement):void {

    inputPatientName.value = '';
    inputPatientCPF.value = '';
    inputPsychologistName.value = '';
    inputPsychologistCRP.value = '';

    this.therapyServices.getTherapies().subscribe({
      next: (response: PaginatedResponse<Therapy>) => this.paginatedResponse = response
    })

  }

  getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);
    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);

    const initialDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    this.createForm.get('dateTime')?.setValue((initialDateTime));
  }

  getTimeNow(): Date{
    return new Date()
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  showCreate(){
    this.createVisible = true;
  }

  closeCard(){
    this.createVisible = false;
  }

  getTherapiesData(){
    this.therapyServices.getTherapies().subscribe({
      next: (response: PaginatedResponse<Therapy>): PaginatedResponse<Therapy> => this.paginatedResponse = response
    })
  }

  createTherapy() {
    let createForm: TherapyPostRequest = this.createForm.value as TherapyPostRequest;

    this.therapyServices.createTherapy(createForm).subscribe({
      next: (response: ResponseMessage): void => {
        if(response.statusCode == 201){
          this.getTherapiesData();
          this.closeCard();
        }
      },
      complete: (): void => {
        this.createForm.reset();
      }
    })
  }

  getTherapiesByStatus(){
    if(this.selectedStatus == 'ALL'){
      this.therapyServices.getTherapies().subscribe({
        next: (response: PaginatedResponse<Therapy>): PaginatedResponse<Therapy> => this.paginatedResponse = response
      })
      return;
    }

    this.therapyServices.getTherapiesWithStatus(this.selectedStatus).subscribe({
      next: (response: PaginatedResponse<Therapy>): PaginatedResponse<Therapy> => this.paginatedResponse = response
    })
  }

}
