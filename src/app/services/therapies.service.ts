import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {PaginatedResponse} from "../models/PaginatedResponse";
import {Therapy} from "../models/Therapy";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../../environment";
import {Patient} from "../models/Patient";
import {ResponseMessage} from "../models/dto/ResponseMessage";
import {TherapyPostRequest} from "../models/dto/TherapyPostRequest";
import {TherapyPutRequest} from "../models/dto/TherapyPutReques";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TherapiesService {

  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getTherapiesFiltered(patientCPF: string, psychologistCRP: string, statusTherapy: string, startDate: Date, endDate: Date): Observable<PaginatedResponse<Therapy>> {
    let params = new HttpParams();

    if (patientCPF !== '') {
      params = params.set('patientCPF', patientCPF);
    }
    if (psychologistCRP !== '') {
      params = params.set('psychologistCRP', psychologistCRP);
    }
    if (statusTherapy !== '') {
      params = params.set('status', statusTherapy);
    }

    params = params.set('startDate', startDate.toISOString());
    params = params.set('endDate', endDate.toISOString());

    return this.httpClient.get<PaginatedResponse<Therapy>>(this.apiUrl + '/therapy/filter', { params });
  }

  getTherapies(pageNumber: number, pageSize: number): Observable<PaginatedResponse<Therapy>> {

    let params = new HttpParams();
    params = params.set('page', pageNumber.toString());
    params = params.set('size', pageSize.toString());
    params = params.set('sort', 'dateTime');

    return this.httpClient.get<PaginatedResponse<Therapy>>(this.apiUrl + '/therapy/all', { params });
  }

  getTherapiesWithStatus(status: string): Observable<PaginatedResponse<Therapy>> {

    let params = new HttpParams();

    params = params.set('status', status);

    return this.httpClient.get<PaginatedResponse<Therapy>>(this.apiUrl + '/therapy/allWithStatus', { params });
  }

  createTherapy(createForm: TherapyPostRequest): Observable<ResponseMessage>{
    return this.httpClient.post<ResponseMessage>(this.apiUrl + '/therapy/schedule', createForm, httpOptions);
  }

  editTherapy(editForm: TherapyPutRequest): Observable<ResponseMessage>{
    return this.httpClient.post<ResponseMessage>(this.apiUrl + '/therapy/reschedule', editForm, httpOptions);
  }
}
