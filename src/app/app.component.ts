import {Component, HostListener} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {PatientPageComponent} from "./patient-page/patient-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgOptimizedImage, PatientPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title: string = 'PsicoCare';

  resized: boolean = false;

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


}

type ButtonHoverState = {
  patient: boolean;
  therapy: boolean;
  schedule: boolean;
};
