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
  meetings: any[] = []; 
  filteredMeetings: any[] = [];

  ngOnInit(): void {
    this.loadMeetings();
    this.filterMeetingsByDate();
  }

  loadMeetings(): void {
    this.meetings = [
      {
        id: 1,
        date: '2024-12-05', 
        startTime: '06:00',
        endTime: '07:00',
        title: 'Project Kickoff',
        attendees: ['mark@example.com', 'jane@example.com']
      },
      {
        id: 2,
        date: '2024-12-05', 
        startTime: '08:00',
        endTime: '09:30',
        title: 'AWS Architecture',
        attendees: ['john@example.com', 'jane@example.com']
      }
    ];
  }

  filterMeetingsByDate(): void {
    this.filteredMeetings = this.meetings.filter(meeting => meeting.date === this.selectedDate);
  }

  onDateChange(): void {
    this.filterMeetingsByDate();
  }

  getMeetingForSlot(timeSlot: string): any {
    return this.filteredMeetings.find(meeting => meeting.startTime === timeSlot);
  }
}