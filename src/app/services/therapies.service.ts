import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {PaginatedResponse} from "../models/PaginatedResponse";
import {Therapy} from "../models/Therapy";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../../environment";
import {Patient} from "../models/Patient";
import {ResponseMessage} from "../models/dto/ResponseMessage";
import {TherapyPostRequest} from "../models/dto/TherapyPostRequest";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TherapiesService {

  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getTherapiesFiltered(patientName: string, patientCPF: string, psychologistName: string, psychologistCRP: string): Observable<PaginatedResponse<Therapy>> {
    let params = new HttpParams();

    if (patientName !== '') {
      params = params.set('patientName', patientName);
    }
    if (patientCPF !== '') {
      params = params.set('patientCPF', patientCPF);
    }
    if (psychologistName !== '') {
      params = params.set('psychologistName', psychologistName);
    }
    if (psychologistCRP !== '') {
      params = params.set('psychologistCRP', psychologistCRP);
    }

    return this.httpClient.get<PaginatedResponse<Therapy>>(this.apiUrl + '/therapy/filter', { params });
  }

  getTherapies(): Observable<PaginatedResponse<Therapy>> {
    return this.httpClient.get<PaginatedResponse<Therapy>>(this.apiUrl + '/therapy/all');
  }

  getTherapiesWithStatus(status: string): Observable<PaginatedResponse<Therapy>> {

    let params = new HttpParams();

    params = params.set('status', status);

    return this.httpClient.get<PaginatedResponse<Therapy>>(this.apiUrl + '/therapy/allWithStatus', { params });
  }

  createTherapy(createForm: TherapyPostRequest): Observable<ResponseMessage>{
    return this.httpClient.post<ResponseMessage>(this.apiUrl + '/therapy/schedule', createForm, httpOptions)
  }

}
