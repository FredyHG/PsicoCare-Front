import {Component, HostListener, signal} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
import {PatientPageComponent} from "./pages/patient-page/patient-page.component";
import {HttpRequestInterceptor} from "./helpers/HttpRequestInterceptor";
import {HttpClientModule} from "@angular/common/http";
import {AuthService} from "./services/auth.service";
import {Subscription} from "rxjs";
import {LoginPageComponent} from "./pages/login-page/login-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgOptimizedImage, PatientPageComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title: string = 'PsicoCare';

  isUserLoggedIn: boolean = false;
  private authSubscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router) {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      (isLoggedIn: boolean) => {
        this.isUserLoggedIn = isLoggedIn;
      }
    );
  }

  buttonHoverState: ButtonHoverState = {
    patient: false,
    therapy: false,
    schedule: false
  };


  onMouseEnter(button: keyof ButtonHoverState): void {
    this.buttonHoverState[button] = true;
  }

  onMouseLeave(button: keyof ButtonHoverState): void {
    this.buttonHoverState[button] = false;
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  validRoute(): boolean{

    if(!this.isUserLoggedIn){
      return false;
    }

    return this.router.url != '/login';


  }

  logout(){
    this.authService.logout();
  }

  navigateTo(routeURl: string) {
    this.router.navigate([routeURl]);
  }
}

type ButtonHoverState = {
  patient: boolean;
  therapy: boolean;
  schedule: boolean;
};
