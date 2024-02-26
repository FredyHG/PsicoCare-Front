import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../../environment";
import {PaginatedResponse} from "../models/PaginatedResponse";
import {Patient} from "../models/Patient";
import {Observable} from "rxjs";
import {PatientPutRequest} from "../models/dto/PatientPutRequest";
import {AuthResponse} from "../models/dto/AuthResponse";
import {ResponseMessage} from "../models/dto/ResponseMessage";


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getPatients(): Observable<PaginatedResponse<Patient>>{
    return this.httpClient.get<PaginatedResponse<Patient>>(this.apiUrl + '/patient');
  }

  getPatientsFiltered(name: string,
                      lastName: string,
                      cpf: string,
                      email: string,): Observable<PaginatedResponse<Patient>>{


    let params = new HttpParams();

    if (name !== '') {
      params = params.set('name', name);
    }
    if (lastName !== '') {
      params = params.set('lastName', lastName);
    }
    if (cpf !== '') {
      params = params.set('cpf', cpf);
    }
    if (email !== '') {
      params = params.set('email', email);
    }

    return this.httpClient.get<PaginatedResponse<Patient>>(this.apiUrl + '/patient/filter', { params });
  }

  deletePatient(cpf: string){

    let params = new HttpParams();

    params = params.set('cpf', cpf)

    return this.httpClient.delete<void>(this.apiUrl + '/patient/delete', { params });
  }

  editPatient(editForm: PatientPutRequest): Observable<ResponseMessage> {
    return this.httpClient.put<ResponseMessage>(this.apiUrl + '/patient', editForm, httpOptions)
  }

  createPatient(createForm: PatientPutRequest) {
    return this.httpClient.post<ResponseMessage>(this.apiUrl + '/patient', createForm, httpOptions)
  }
}
