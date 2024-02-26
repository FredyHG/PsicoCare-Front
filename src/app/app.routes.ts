import { Routes } from '@angular/router';
import {PatientPageComponent} from "./pages/patient-page/patient-page.component";
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {AuthGuard} from "./auth.guard";

export const routes: Routes = [
  {path: '', component: LoginPageComponent},
  {path: 'patients', component: PatientPageComponent, canActivate: [AuthGuard.canActivate]},
  {path: 'login', component: LoginPageComponent}
];
