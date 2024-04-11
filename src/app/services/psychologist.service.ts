import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environment";
import {Psychologist} from "../models/Psychologist";
import {Observable} from "rxjs";
import {PaginatedResponse} from "../models/PaginatedResponse";
import {CookieService} from "ngx-cookie-service";
import {Patient} from "../models/Patient";

@Injectable({
  providedIn: 'root'
})
export class PsychologistService {

  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient, private cookieService: CookieService) {}

  getPsychologists(): Observable<PaginatedResponse<Psychologist>>{
    return this.httpClient.get<PaginatedResponse<Psychologist>>(this.apiUrl + "/psychologist/all");
  }

  getPsychologistByToken(): Observable<Psychologist>{

    let params = new HttpParams();
    params = params.set("token", this.cookieService.get('accessToken') )

    return this.httpClient.get<Psychologist>(this.apiUrl + "/psychologist/byToken", { params })
  }

  getPatientsFiltered(name: string,
                      lastName: string,
                      crp: string,
                      email: string,
                      pageNumber: number,
                      pageSize: number): Observable<PaginatedResponse<Psychologist>> {

    let params = new HttpParams();

    params = params.set('page', pageNumber.toString());
    params = params.set('size', pageSize.toString());
    params = params.set('sort', 'name');

    if (name !== '') {
      params = params.set('name', name);
    }
    if (lastName !== '') {
      params = params.set('lastName', lastName);
    }
    if (crp !== '') {
      params = params.set('cpf', crp);
    }
    if (email !== '') {
      params = params.set('email', email);
    }

    return this.httpClient.get<PaginatedResponse<Psychologist>>(this.apiUrl + '/psychologist/filter', { params });
  }
}
