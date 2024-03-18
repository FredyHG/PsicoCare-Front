import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environment";
import {Psychologist} from "../models/Psychologist";
import {Observable} from "rxjs";
import {PaginatedResponse} from "../models/PaginatedResponse";

@Injectable({
  providedIn: 'root'
})
export class PsychologistService {

  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getPsychologists(): Observable<PaginatedResponse<Psychologist>>{
    return this.httpClient.get<PaginatedResponse<Psychologist>>(this.apiUrl + "/psychologist/all");
  }
}
