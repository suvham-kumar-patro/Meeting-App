import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../Services/global.service';
import Imeeting from '../Models/IMeeting';
// import { Route,RouterLink,RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-calendar',
  imports: [ FormsModule, CommonModule, ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  selectedDate: string = new Date().toISOString().split('T')[0];
  // timeSlots: string[] = Array.from({ length: 24 }, (_, i) =>
  //   i.toString().padStart(2, '0') + ':00'
  // );
  timeSlots: string[] = [];
  meetings: Imeeting[] = []; 
  filteredMeetings: Imeeting[] = [];

  constructor(private globalService: GlobalService) {
    for (let hour = 0; hour < 24; hour++) {
      const hourString = hour.toString().padStart(2, '0');
      this.timeSlots.push(`${hourString}:00`);
      this.timeSlots.push(`${hourString}:30`);
    }
  }

  

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings(): void {
    this.globalService.getMeetings().subscribe({
      next: (data) => {
        this.meetings = data;
         console.log(data);
        this.filterMeetingsByDate();
      },
      error: (err) => {
        console.error('Error loading meetings:', err);
      }
    });
  }

  filterMeetingsByDate(): void {
    const formattedDate = new Date(this.selectedDate).toISOString().split('T')[0]; // Normalize selected date
    this.filteredMeetings = this.meetings.filter(meeting => {
      
      const meetingDate = new Date(meeting.date).toISOString().split('T')[0];
      return meetingDate === formattedDate;
    });
  }

  onDateChange(): void {
    this.filterMeetingsByDate(); 
  }

  getMeetingForSlot(timeSlot: string): any {
    // 
    const [hours, minutes] = timeSlot.split(':').map(num => parseInt(num, 10));

    // Return all meetings that match the given time slot
    // return this.filteredMeetings.filter(meeting =>
    //   meeting.startTime.hours === hours && meeting.startTime.minutes === minutes
      
    // );
    const filteredMeetings = this.filteredMeetings.filter(meeting => {
      return meeting.startTime.hours === hours && meeting.startTime.minutes === minutes;
    });  
    return filteredMeetings;
  }
}
