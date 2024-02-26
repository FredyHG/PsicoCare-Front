import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, switchMap, throwError} from "rxjs";
import {AuthService} from "../services/auth.service";
import {CookieService} from "ngx-cookie-service";
import {AuthResponse} from "../models/dto/AuthResponse";


@Injectable({
  providedIn: 'root'
})
export class HttpRequestInterceptor implements HttpInterceptor{

  private isRefreshing = false;

  constructor(
    private authService: AuthService,
    private cookieService: CookieService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if(!req.url.includes('auth/refresh-token')){
      req = this.setCookieHeader(req)
    }


    return next.handle(req).pipe(
      catchError((error: any): Observable<any> => {
        if (
          error instanceof HttpErrorResponse &&
          !req.url.includes('auth/authenticate') &&
          error.status === 403
        ) {
          return this.handle409Error(req, next);
        }


        console.log('chegou aqui')

        return throwError(() => error);
      })
    );
  }

  private handle409Error(request: HttpRequest<any>, next: HttpHandler) {

    if (!this.isRefreshing) {
      this.isRefreshing = true;

      if (this.authService.isLoggedIn$) {
        return this.authService.refreshToken().pipe(
          switchMap((authResponse: AuthResponse) => {

            this.cookieService.set('accessToken', authResponse.access_token, 86400000)

            request = this.setCookieHeader(request);

            this.isRefreshing = false;
            return next.handle(request);
          }),
          catchError((error) => {
            this.isRefreshing = false;

            if (error.status == '403') {
              this.authService.logout()
            }

            return throwError(() => error);
          })
        );
      }
    }

    return next.handle(request);
  }

  setCookieHeader(request: HttpRequest<any>){
    return request.clone({

      setHeaders: {
        Authorization: 'Bearer ' + this.cookieService.get('accessToken')
      }
    });
  }

}


