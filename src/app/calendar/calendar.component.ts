import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-calendar',
  imports: [NavbarComponent, FormsModule, CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  selectedDate: string = new Date().toISOString().split('T')[0];
 
  timeSlots: string[] = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0') + ':00'
  );

}
