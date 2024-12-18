import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../Services/global.service';
import Imeeting from '../Models/IMeeting';

@Component({
  selector: 'app-calendar',
  imports: [ FormsModule, CommonModule ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  selectedDate: string = new Date().toISOString().split('T')[0]; // Initialize with current date
    timeSlots: string[] = Array.from({ length: 24 }, (_, i) => 
      i.toString().padStart(2, '0') + ':00' // Generate time slots 00:00 to 23:00
    );
    meetings: Imeeting[] = [];
    filteredMeetings: Imeeting[] = [];
  
    constructor(private globalService: GlobalService){}
  
    ngOnInit(): void {
      this.fetchMeetings();
    }
  
    fetchMeetings(): void {
      this.globalService.getMeetings().subscribe(
        (meetings) => {
          this.meetings = meetings;
          console.log(meetings);
          this.filterMeetingsByDate();
        },
        (error) => {
          console.error('Error fetching meetings', error);
        }
      );
    }
  
    filterMeetingsByDate(): void {
      this.filteredMeetings = this.meetings.filter(meeting =>
        meeting.date.startsWith(this.selectedDate)
      );
    }
  
    getMeetingsForSlot(time: string): Imeeting[] {
      return this.filteredMeetings.filter(meeting => {
        const meetingStartTime = meeting.startTime;
        const meetingEndTime = meeting.endTime;
        return (
          meetingStartTime <= time && meetingEndTime > time
        );
      });
    }
  
    onDateChange(): void {
      this.filterMeetingsByDate();
    }
  }