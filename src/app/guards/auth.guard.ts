import {inject, Injectable} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {catchError, map, Observable, of} from "rxjs";
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";

export namespace AuthGuard {
  export const canActivate = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.checkLogin().pipe(
      map(() => true),
      catchError(() => {
          router.navigate(['login']);
          return of(false);
        }
      )
    );
  }

  export const canActivateChild = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => canActivate(route, state);
}
