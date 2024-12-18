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
  //   selectedDate: string = new Date().toISOString().split('T')[0]; // Initialize with current date
  //   timeSlots: string[] = Array.from({ length: 24 }, (_, i) => 
  //     i.toString().padStart(2, '0') + ':00' // Generate time slots 00:00 to 23:00
  //   );
  //   meetings!: Imeeting[];
  //   filteredMeetings: Imeeting[] = [];
  //   constructor(private meetingsService:MeetingsService){}
  
  //   ngOnInit(): void {
  //     this.fetchMeetings();  // Initially filter meetings by today's date
  //   }
  //   fetchMeetings(): void {
  //     this.meetingsService.getMeetings().subscribe(
  //       (meetings) => {
  //         this.meetings = meetings;
  //         console.log(meetings); // Assign the fetched meetings to the meetings array
  //         this.filterMeetingsByDate(); // Filter the meetings by the selected date
  //       },
  //       (error) => {
  //         console.error('Error fetching meetings', error);
  //       }
  //     );
  //   }
  
  //   // Filter meetings for the selected date
  //   filterMeetingsByDate(): void {
  //     const formattedDate = new Date(this.selectedDate).toISOString().split('T')[0]; // Normalize selected date
  //     this.filteredMeetings = this.meetings.filter(meeting => {
  //       const meetingDate = new Date(meeting.date).toISOString().split('T')[0];
  //       return meetingDate === formattedDate;
  //     });
  //   }
  
  //   // Get all meetings for a specific time slot (e.g., 09:00)
  //   getMeetingsForSlot(timeSlot: string): Imeeting[] {
  //     const [hours, minutes] = timeSlot.split(':').map(num => parseInt(num, 10));
  
  //     // Return all meetings that match the given time slot
  //     return this.filteredMeetings.filter(meeting =>
  //       meeting.startTime.hours === hours && meeting.startTime.minutes === minutes
  //     );
  //   }
  
  //   // Triggered when the user changes the date
  //   onDateChange(): void {
  //     this.filterMeetingsByDate();  // Re-filter meetings based on the selected date
  //   }
  // }
  selectedDate: string = new Date().toISOString().split('T')[0]; // Initialize with current date
    timeSlots: string[] = Array.from({ length: 24 }, (_, i) => 
      i.toString().padStart(2, '0') + ':00' // Generate time slots 00:00 to 23:00
    );
    meetings: Imeeting[] = [];
    filteredMeetings: Imeeting[] = [];
  
    constructor(private globalService: GlobalService){}
  
    ngOnInit(): void {
      this.fetchMeetings(); // Initially fetch meetings
    }
  
    fetchMeetings(): void {
      this.globalService.getMeetings().subscribe(
        (meetings) => {
          this.meetings = meetings;
          console.log(meetings); // Log the fetched meetings to the console
          this.filterMeetingsByDate(); // Filter meetings by the selected date
        },
        (error) => {
          console.error('Error fetching meetings', error);
        }
      );
    }
  
    filterMeetingsByDate(): void {
      // Filter meetings by the selected date
      this.filteredMeetings = this.meetings.filter(meeting =>
        meeting.date.startsWith(this.selectedDate) // Check if meeting date starts with selectedDate
      );
    }
  
    getMeetingsForSlot(time: string): Imeeting[] {
      return this.filteredMeetings.filter(meeting => {
        // Check if the meeting time is within the current time slot
        const meetingStartTime = meeting.startTime;
        const meetingEndTime = meeting.endTime;
        return (
          meetingStartTime <= time && meetingEndTime > time
        );
      });
    }
  
    onDateChange(): void {
      this.filterMeetingsByDate(); // Re-filter meetings when the date is changed
    }
  }