import {Injectable} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserLogin} from "../models/UserLogin";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {AuthResponse} from "../models/dto/AuthResponse";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../environment";
import {ResponseMessage} from "../models/dto/ResponseMessage";
import {ChangePasswordRequest} from "../models/dto/ChangePasswordRequest";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedIn.asObservable();
  isUserLoggedIn: boolean = false;
  private authSubscription: Subscription;
  private apiUrlAuth = environment.apiUrlAuth;
  private apiUrl = environment.apiUrl;

  constructor(private cookieService: CookieService,
              private httpClient: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
  ) {

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
    return this.httpClient.post<AuthResponse>(this.apiUrlAuth + '/authenticate', formData, httpOptions)
  }

  refreshToken() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.cookieService.get('refreshToken') })
    }

    if(this.cookieService.get('refreshToken') == null){
      this.isLoggedIn.next(false);
      this.redirectToLogin();
    }

    return this.httpClient.post<AuthResponse>(this.apiUrlAuth + '/refresh-token', { }, httpOptions);
  }

  login(refreshToken: string, accessToken: string): void{
    this.isLoggedIn.next(true);
    this.cookieService.set('accessToken', accessToken, 86400000);
    this.cookieService.set('refreshToken', refreshToken, 604800000);
  }

  logout(): Observable<any>{
    this.isLoggedIn.next(false);
    this.redirectToLogin();

    return this.httpClient.post(this.apiUrlAuth + 'logout', { }, httpOptions);
  }

  redirectToLogin() {
    this.cookieService.delete('accessToken');
    this.cookieService.delete('refreshToken');

    this.router.navigate(['/login'], {relativeTo: this.route});
  }

  checkLogin() {
    return this.httpClient.post<any>(this.apiUrlAuth + '/check-login', { }, httpOptions);
  }

  changePassword(formData: ChangePasswordRequest): Observable<ResponseMessage>{
    return this.httpClient.post<ResponseMessage>(this.apiUrlAuth + '/change-password', formData, httpOptions)
  }

  checkStatus(): Observable<ResponseMessage> {
    return this.httpClient.get<ResponseMessage>(this.apiUrl + '/status', httpOptions)
  }
}
