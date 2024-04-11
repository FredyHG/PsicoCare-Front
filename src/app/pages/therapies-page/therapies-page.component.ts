import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
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
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {PaginatorModule} from "primeng/paginator";
import {CalendarModule} from "primeng/calendar";


@Component({
  selector: 'app-therapies-page',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgxMaskDirective,
    ReactiveFormsModule,
    DatePipe,
    FormsModule,
    CalendarModule,
    AutoCompleteModule,
    TitleCasePipe,
    PaginatorModule,
    CalendarModule
  ],
  templateUrl: './therapies-page.component.html',
  styleUrl: './therapies-page.component.scss',
})
export class TherapiesPageComponent implements OnInit {

  responseTherapy!: PaginatedResponse<Therapy>;
  responsePsychologist!: PaginatedResponse<Psychologist>;
  responsePatient!: PaginatedResponse<Patient>;

  createVisible: boolean = false;
  detailsVisible: boolean = false;
  editVisible: boolean = false;

  selectedStatus: string = '';
  selectedPatient!: Patient;
  selectedPsychologist!: Psychologist;
  selectedTherapy!: Therapy;

  rangeDates!: Date[];
  minDate!: Date;

  filtered: boolean = false;

  createForm: FormGroup;

  constructor(private therapyServices: TherapiesService,
              private formBuilder: FormBuilder,
              private psychologistService: PsychologistService,
              private patientService: PatientsService) {

    this.createForm = this.formBuilder.group({
      crpPsychologist: [null, Validators.required],
      cpfPatient: [null, Validators.required],
      dateTime: [new Date(), Validators.required]
    })


  }

  ngOnInit(): void {
    this.loadBaseDate();
    this.setPageDefaultDate();
  }


  filterList(page: number, size: number): void {

    let cpfPatient = '';
    let crpPsychologist = '';

    if(this.selectedPatient != undefined){
      cpfPatient = this.selectedPatient.cpf;
    }

    if(this.selectedPsychologist != undefined){
      crpPsychologist = this.selectedPsychologist.crp;
    }


    this.therapyServices.getTherapiesFiltered(cpfPatient, crpPsychologist, this.selectedStatus,  this.rangeDates[0], this.rangeDates[1])
      .subscribe(response => {
        this.responseTherapy = response;
      });
  }

  closeCard(){
    this.detailsVisible = false;
    this.createVisible = false;
    this.editVisible = false;
  }

  getTherapiesData(pageNumber: number, pageSize: number){

    this.therapyServices.getTherapies(pageNumber, pageSize).subscribe({
      next: (response: PaginatedResponse<Therapy>): PaginatedResponse<Therapy> => this.responseTherapy = response
    })
  }

  getPatientsFiltered(event: AutoCompleteCompleteEvent) {
    this.patientService.getPatientsFiltered(event.query, '', '', '', 0, 20).subscribe({
      next: response => this.responsePatient = response,
      error: err => console.error('Error loading patients', err),
    })
  }

  getPsychologistFiltered(event: AutoCompleteCompleteEvent) {
    this.psychologistService.getPatientsFiltered(event.query, '', '', '', 0, 20).subscribe({
      next: response => this.responsePsychologist = response,
      error: err => console.error('Error loading psychologist', err),
    })
  }

  createTherapy() {
    let createForm: TherapyPostRequest = this.createForm.value as TherapyPostRequest;

    createForm.cpfPatient = this.extractCpfFromControl();
    createForm.crpPsychologist = this.extractCrpFromControl();


    this.therapyServices.createTherapy(createForm).subscribe({
      next: (response: ResponseMessage): void => {
        if(response.statusCode == 201){
          this.getTherapiesData(0, 10);
          this.closeCard();
        }
      },
      complete: (): void => {
        this.createForm.reset();
      }
    })
  }

  toggleCreate(){
    this.createVisible = true;
  }

  toggleEdit(){
    this.editVisible = !this.editVisible;
  }

  toggleDetails() {
    this.detailsVisible = !this.detailsVisible;
  }

  editTherapy() {

  }



  getCurrentDateTime() {
    let date = new Date();
    date.toISOString()
  }


  plusMonthOnDate(date: Date, qtd: number): Date{
    date.setMonth(date.getMonth() + qtd);
    return date;
  }


  loadBaseDate(): void{
    this.therapyServices.getTherapies(0, 10).subscribe({
      next: response => this.responseTherapy = response,
      error: err => console.error('Error loading therapies', err),
    });

    this.psychologistService.getPsychologists().subscribe({
      next: response => this.responsePsychologist = response,
      error: err => console.error('Error loading psychologists', err),

    });

    this.patientService.getPatients(1, 20).subscribe({
      next: response => this.responsePatient = response,
      error: err => console.error('Error loading patients', err),
    })
  }

  setPageDefaultDate(): void{
    this.getCurrentDateTime();

    this.minDate = new Date();
    this.minDate.setHours(6, 0, 0, 0);


    this.rangeDates = [
      this.minDate,
      this.plusMonthOnDate(new Date(), 1)
    ];

    this.createForm.get('dateTime')?.setValue(this.minDate);

    this.createForm.get('dateTime')?.setValue(this.minDate);

  }

  extractCpfFromControl() {
    const patientData = this.createForm.get('cpfPatient')?.value;
    return patientData ? patientData.cpf : null;
  }

  extractCrpFromControl() {
    const psychologistData = this.createForm.get('crpPsychologist')?.value;
    return psychologistData ? psychologistData.crp : null;
  }
}


