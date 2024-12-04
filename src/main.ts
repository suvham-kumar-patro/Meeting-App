import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { MeetingAppRoutingModule } from './app/meeting-app-routing.module';  
import { appConfig } from './app/app.config';

// bootstrapApplication(AppComponent, {
//   providers: [
//     MeetingAppRoutingModule,  
//   ],
// }).catch((err) => console.error(err));

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
