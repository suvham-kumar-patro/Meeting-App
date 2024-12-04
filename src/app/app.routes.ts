import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { TeamsComponent } from './teams/teams.component';


export const routes: Routes = [
    { 
        path: '',
        component:LoginComponent,
        title:"Login page"
    } ,
    { 
        path: "login",
        component: LoginComponent,
        title:'Login page'
    },
  // { path: "register", component: LoginComponent },
    { 
        path: "calendar",
        component: CalendarComponent,
        title:"calendar"
    },
    { 
        path: "meetings",
        component: MeetingsComponent,
        title:"meetings"
    },
  { 
    path: "teams", 
    component: TeamsComponent,
    title:"teams"
}
    // {path:'meeting-app',loadChildren:()=> import('./meeting-app.module').then(m=> m.MeetingAppModule)}
    ];