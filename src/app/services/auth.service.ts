import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserLogin} from "../models/UserLogin";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {AuthResponse} from "../models/dto/AuthResponse";
import {Router} from "@angular/router";
import {routes} from "../app.routes";


const AUTH_API = 'http://18.228.189.118:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedIn = new BehaviorSubject<boolean>(false);

  isUserLoggedIn: boolean = false;

  private authSubscription: Subscription;


  constructor(private cookieService: CookieService,
              private httpClient: HttpClient,
              private router: Router) {

    this.authSubscription = this.isLoggedIn$.subscribe(
      (isLoggedIn: boolean) => {
        this.isUserLoggedIn = isLoggedIn;
      }
    );

    if(cookieService.get('accessToken') != null){
      this.isLoggedIn.next(true);
    }

    if(cookieService.get('accessToken') == null){
      this.isLoggedIn.next(false);
    }

    if(cookieService.get('refreshToken') == null){
      this.isLoggedIn.next(false);
    }

  }

  submitLoginForm(formData: UserLogin): Observable<AuthResponse> {

    return this.httpClient.post<AuthResponse>(AUTH_API + 'authenticate', formData, httpOptions)
  }

  refreshToken() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.cookieService.get('refreshToken') })
    };

    if(this.cookieService.get('refreshToken') == null){
      this.isLoggedIn.next(false);
      this.router.navigate(['/login'])
    }

    return this.httpClient.post<AuthResponse>(AUTH_API + 'refresh-token', { }, httpOptions);
  }

  login(refreshToken: string, accessToken: string): void{
    this.isLoggedIn.next(true);
    this.cookieService.set('accessToken', accessToken, 86400000)
    this.cookieService.set('refreshToken', refreshToken, 604800000)
  }

  logout(): Observable<any>{
    this.isLoggedIn.next(false);
    this.redirectToLogin();
    return this.httpClient.post(AUTH_API + 'logout', { }, httpOptions);
  }


  isLoggedIn$ = this.isLoggedIn.asObservable();



  redirectToLogin() {
    this.cookieService.delete('accessToken');
    this.cookieService.delete('refreshToken');

    this.router.navigate(['/login']);
  }

  checkLogin() {
    return this.httpClient.post<any>(AUTH_API + 'check-login', { }, httpOptions);
  }
}
