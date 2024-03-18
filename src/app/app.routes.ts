import { Routes } from '@angular/router';
import {PatientPageComponent} from "./pages/patient-page/patient-page.component";
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {AuthGuard} from "./guards/auth.guard";
import {TherapiesPageComponent} from "./pages/therapies-page/therapies-page.component";

export const routes: Routes = [
  {path: '', component: LoginPageComponent},
  {path: 'patients', component: PatientPageComponent, canActivate: [AuthGuard.canActivate]},
  {path: 'therapies', component: TherapiesPageComponent, canActivate: [AuthGuard.canActivate]},
  {path: 'login', component: LoginPageComponent}
];
