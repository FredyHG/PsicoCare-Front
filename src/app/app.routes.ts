import { Routes } from '@angular/router';
import {PatientPageComponent} from "./pages/patient-page/patient-page.component";
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {AuthGuard} from "./guards/auth.guard";
import {TherapiesPageComponent} from "./pages/therapies-page/therapies-page.component";
import {ProfilePageComponent} from "./pages/profile-page/profile-page.component";
import {MaintenancePageComponent} from "./pages/maintenance-page/maintenance-page.component";

export const routes: Routes = [
  {path: '', component: LoginPageComponent},
  {path: 'patients', component: PatientPageComponent, canActivate: [AuthGuard.canActivate]},
  {path: 'therapies', component: TherapiesPageComponent, canActivate: [AuthGuard.canActivate]},
  {path: 'profile', component: ProfilePageComponent, canActivate: [AuthGuard.canActivate]},
  {path: 'maintenance', component: MaintenancePageComponent},
  {path: 'login', component: LoginPageComponent}
];
