import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {catchError, map, of} from "rxjs";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";

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

}
