import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommunicationService } from './Services/CommunicationService.service';
import { SurveyApplicationComponent } from './UI-Elements/survey-application/survey-application.component';
import { DialogComponent } from './UI-Elements/dialog/dialog-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SurveyApplicationComponent,
    DialogComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'survey-system-client';

  constructor(private commService: CommunicationService) {}
}
